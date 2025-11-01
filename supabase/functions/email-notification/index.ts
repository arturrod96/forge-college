import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const SITE_URL =
  Deno.env.get("SITE_URL") ??
  Deno.env.get("VITE_SITE_URL") ??
  "https://forgecollege.com";

const SUPPORTED_LANGUAGES = ["pt-BR", "en-US"] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const DEFAULT_LANGUAGE: SupportedLanguage = "pt-BR";

type EmailContent = {
  subject: string;
  html: string;
  text: string;
};

type GenericPayload = {
  title?: string;
  message?: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

type PathEnrollmentPayload = {
  enrollmentId: string;
  learningPathId: string;
  pathTitle?: string;
  pathDescription?: string;
  pathSlug?: string;
  coursesCount?: number;
  modulesCount?: number;
};

type TemplatePayloadMap = {
  "generic-notification": GenericPayload;
  "path-enrollment": PathEnrollmentPayload;
};

type TemplateKey = keyof TemplatePayloadMap;

const SUPPORTED_TEMPLATES = new Set<TemplateKey>([
  "generic-notification",
  "path-enrollment",
]);

type EmailRequestBody = {
  mode?: "send" | "process-queue";
  userId?: string;
  template?: TemplateKey;
  payload?: Record<string, unknown>;
  to?: string;
  queueId?: string;
  batchSize?: number;
  dryRun?: boolean;
};

const templateCache = new Map<string, string>();

async function loadTemplate(relativePath: string): Promise<string> {
  const cached = templateCache.get(relativePath);
  if (cached) {
    return cached;
  }

  const url = new URL(`./templates/${relativePath}`, import.meta.url);
  const content = await Deno.readTextFile(url);
  templateCache.set(relativePath, content);
  return content;
}

function applyTemplate(
  template: string,
  variables: Record<string, string>,
): string {
  return template.replace(
    /{{\s*([\w-]+)\s*}}/g,
    (_, key) => variables[key] ?? "",
  );
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing required Supabase environment variables.");
  throw new Error("Supabase environment variables are not configured.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

type QueueRecord = {
  id: string;
  user_id: string;
  template: TemplateKey;
  payload: unknown;
  attempts: number;
};

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function ensureRecord(
  value: unknown,
): Record<string, unknown> {
  if (isRecord(value)) {
    return value;
  }
  try {
    if (typeof value === "string") {
      const parsed = JSON.parse(value);
      return isRecord(parsed) ? parsed : {};
    }
  } catch {
    // ignore JSON parse issues
  }
  return {};
}

async function resolveCommunicationLanguage(
  userId: string,
): Promise<SupportedLanguage> {
  const { data, error } = await supabase
    .from("profiles")
    .select("communication_language")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Failed to load profile language preference:", error);
    return DEFAULT_LANGUAGE;
  }

  const profileLanguage = data?.communication_language;
  if (
    profileLanguage &&
    SUPPORTED_LANGUAGES.includes(profileLanguage as SupportedLanguage)
  ) {
    return profileLanguage as SupportedLanguage;
  }

  const { data: userData, error: userError } = await supabase.auth.admin
    .getUserById(userId);
  if (userError) {
    console.error("Failed to load user metadata language:", userError);
    return DEFAULT_LANGUAGE;
  }

  const metadataLanguage = userData?.user?.user_metadata?.communication_language;
  if (
    metadataLanguage &&
    SUPPORTED_LANGUAGES.includes(metadataLanguage as SupportedLanguage)
  ) {
    return metadataLanguage as SupportedLanguage;
  }

  return DEFAULT_LANGUAGE;
}

async function resolveRecipientEmail(userId: string): Promise<string | null> {
  const { data, error } = await supabase.auth.admin.getUserById(userId);
  if (error) {
    console.error("Failed to load user email:", error);
    return null;
  }

  const email = data.user?.email ?? null;
  if (!email) {
    console.warn(`User ${userId} does not have a primary email configured.`);
  }

  return email;
}

async function dispatchEmail(
  to: string,
  content: EmailContent,
  dryRun = false,
) {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const resendFromEmail = Deno.env.get("RESEND_FROM_EMAIL");

  if (dryRun || !resendApiKey || !resendFromEmail) {
    console.log("Email provider not configured. Previewing payload instead.", {
      to,
      ...content,
    });

    return {
      delivered: false,
      preview: {
        to,
        ...content,
      },
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      to,
      from: resendFromEmail,
      subject: content.subject,
      html: content.html,
      text: content.text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend error ${response.status}: ${body}`);
  }

  const body = await response.json();
  return {
    delivered: true,
    providerResponse: body,
  };
}

async function buildEmailContent(
  template: TemplateKey,
  language: SupportedLanguage,
  payload: Record<string, unknown>,
): Promise<EmailContent> {
  switch (template) {
    case "path-enrollment":
      return buildPathEnrollmentEmail(
        language,
        payload as PathEnrollmentPayload,
      );
    case "generic-notification":
    default:
      return buildGenericNotificationEmail(
        language,
        payload as GenericPayload,
      );
  }
}

async function sendEmail(args: {
  userId: string;
  template: TemplateKey;
  payload?: unknown;
  to?: string;
  dryRun?: boolean;
}) {
  const { userId, template, payload, to, dryRun = false } = args;
  const normalizedPayload = ensureRecord(payload);

  const language = await resolveCommunicationLanguage(userId);
  const content = await buildEmailContent(
    template,
    language,
    normalizedPayload,
  );

  const recipient = to ?? (await resolveRecipientEmail(userId));
  if (!recipient) {
    throw new Error("Unable to determine recipient email");
  }

  const result = await dispatchEmail(recipient, content, dryRun);

  return {
    language,
    delivered: result.delivered,
    providerResponse: result.providerResponse ?? null,
    preview: result.preview ?? null,
  };
}

async function lockQueueRecord(id: string, attempts: number) {
  const { data, error } = await supabase
    .from("notification_queue")
    .update({
      status: "processing",
      attempts: attempts + 1,
    })
    .eq("id", id)
    .eq("status", "pending")
    .select("attempts")
    .single();

  if (error) {
    return { success: false as const, attempts };
  }

  return { success: true as const, attempts: data.attempts };
}

async function updateQueueSuccess(id: string) {
  await supabase
    .from("notification_queue")
    .update({
      status: "sent",
      last_error: null,
      scheduled_for: new Date().toISOString(),
    })
    .eq("id", id);
}

async function updateQueueFailure(
  id: string,
  attempts: number,
  error: unknown,
) {
  const message =
    error instanceof Error ? error.message : "Unknown error sending email";

  const shouldRetry = attempts < 3;
  const retryDelayMinutes = Math.min(attempts * 15, 120);
  const nextAttempt = new Date(Date.now() + retryDelayMinutes * 60 * 1000)
    .toISOString();

  await supabase
    .from("notification_queue")
    .update({
      status: shouldRetry ? "pending" : "failed",
      last_error: message.slice(0, 500),
      scheduled_for: shouldRetry ? nextAttempt : new Date().toISOString(),
    })
    .eq("id", id);
}

async function processQueue(batchSize = 10, dryRun = false) {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("notification_queue")
    .select("id, user_id, template, payload, attempts")
    .eq("status", "pending")
    .lte("scheduled_for", now)
    .order("created_at", { ascending: true })
    .limit(batchSize);

  if (error) {
    console.error("Failed to load queue:", error);
    return new Response(
      JSON.stringify({ error: "Failed to load queue items" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const items = data ?? [];
  if (items.length === 0) {
    return new Response(
      JSON.stringify({ processed: 0, results: [] }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  const results: Array<Record<string, unknown>> = [];

  for (const item of items as QueueRecord[]) {
    const lock = await lockQueueRecord(item.id, item.attempts);
    if (!lock.success) {
      results.push({
        id: item.id,
        status: "skipped",
        reason: "Could not acquire lock",
      });
      continue;
    }

    try {
      const sendResult = await sendEmail({
        userId: item.user_id,
        template: item.template,
        payload: ensureRecord(item.payload),
        dryRun,
      });
      await updateQueueSuccess(item.id);
      results.push({
        id: item.id,
        status: "sent",
        language: sendResult.language,
        delivered: sendResult.delivered,
      });
    } catch (err) {
      await updateQueueFailure(item.id, lock.attempts, err);
      results.push({
        id: item.id,
        status: "error",
        attempts: lock.attempts,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return new Response(
    JSON.stringify({ processed: results.length, results }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body: EmailRequestBody;

  try {
    body = await req.json();
  } catch (error) {
    console.error("Invalid JSON payload:", error);
    return new Response(JSON.stringify({ error: "Invalid JSON payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (body.mode === "process-queue") {
    const batchSize = Number(body.batchSize ?? 10);
    const dryRun = Boolean(body.dryRun);
    return processQueue(Number.isFinite(batchSize) ? batchSize : 10, dryRun);
  }

  if (!body.userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.template || !SUPPORTED_TEMPLATES.has(body.template)) {
    return new Response(
      JSON.stringify({ error: "Unsupported or missing template" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const result = await sendEmail({
      userId: body.userId,
      template: body.template,
      payload: body.payload ?? {},
      to: body.to,
      dryRun: Boolean(body.dryRun),
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to send email:", error);
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
function buildGenericNotificationEmail(
  language: SupportedLanguage,
  payload: GenericPayload,
): EmailContent {
  const baseTitle =
    language === "pt-BR" ? "Notificação Forge College" : "Forge College Notification";
  const baseMessage =
    language === "pt-BR"
      ? "Você recebeu uma nova notificação da Forge College."
      : "You have a new notification from Forge College.";
  const baseCta =
    language === "pt-BR" ? "Ver detalhes" : "View details";
  const footerNote =
    language === "pt-BR"
      ? "Você está recebendo esta mensagem porque sua preferência de comunicação é Português (Brasil)."
      : "You're receiving this message because your profile preference is set to English.";

  const subject = payload.title ?? baseTitle;
  const message = payload.message ?? baseMessage;
  const ctaLabel = payload.ctaLabel ?? baseCta;
  const ctaUrl = payload.ctaUrl;

  const htmlCta = ctaUrl
    ? `<p style="margin-top: 24px;"><a href="${ctaUrl}" style="background-color: #FF6B00; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-family: sans-serif;">${ctaLabel}</a></p>`
    : "";

  return {
    subject,
    html: `
      <h1 style="font-family: sans-serif; color: #FF6B00;">${subject}</h1>
      <p style="font-family: sans-serif; color: #1F2933;">${message}</p>
      ${htmlCta}
      <p style="font-family: sans-serif; font-size: 12px; color: #6B7280; margin-top: 32px;">${footerNote}</p>
    `,
    text: `${subject}\n\n${message}${
      ctaUrl ? `\n\n${ctaLabel}: ${ctaUrl}` : ""
    }\n\n${footerNote}`,
  };
}

const PATH_ENROLLMENT_COPY: Record<
  SupportedLanguage,
  {
    templatePath: string;
    preview: string;
    heroFallback: string;
    descriptionFallback: string;
    subjectPrefix: string;
    subjectFallback: string;
    ctaLabel: string;
    statsCoursesLabel: string;
    statsModulesLabel: string;
    additionalNote: string;
  }
> = {
  "en-US": {
    templatePath: "notifications/path-enrollment.en-US.html",
    preview: "You're enrolled in a new Forge College path.",
    heroFallback: "You just enrolled in a new learning path!",
    descriptionFallback:
      "Stay tuned for curated modules, resources, and projects tailored to boost your skills.",
    subjectPrefix: "You're in! ",
    subjectFallback: "New learning path unlocked",
    ctaLabel: "Start exploring",
    statsCoursesLabel: "curated courses",
    statsModulesLabel: "modules",
    additionalNote:
      "You're receiving this message because your Forge College profile is configured to receive updates in English.",
  },
  "pt-BR": {
    templatePath: "notifications/path-enrollment.pt-BR.html",
    preview: "Você se matriculou em uma nova trilha da Forge College.",
    heroFallback: "Você acaba de se matricular em uma nova trilha!",
    descriptionFallback:
      "Prepare-se para receber módulos, recursos e projetos pensados para acelerar seu desenvolvimento.",
    subjectPrefix: "Inscrição confirmada: ",
    subjectFallback: "Nova trilha disponível",
    ctaLabel: "Acessar trilha",
    statsCoursesLabel: "cursos selecionados",
    statsModulesLabel: "módulos",
    additionalNote:
      "Você está recebendo esta mensagem porque sua preferência de comunicação na Forge College está configurada para Português (Brasil).",
  },
};

async function buildPathEnrollmentEmail(
  language: SupportedLanguage,
  payload: PathEnrollmentPayload,
): Promise<EmailContent> {
  const copy = PATH_ENROLLMENT_COPY[language] ?? PATH_ENROLLMENT_COPY[DEFAULT_LANGUAGE];
  const heroTitle = payload.pathTitle ?? copy.heroFallback;
  const description = payload.pathDescription ?? copy.descriptionFallback;
  const subject =
    copy.subjectPrefix + (payload.pathTitle ?? copy.subjectFallback);
  const statsParts: string[] = [];

  if (typeof payload.coursesCount === "number") {
    statsParts.push(`${payload.coursesCount} ${copy.statsCoursesLabel}`);
  }
  if (typeof payload.modulesCount === "number") {
    statsParts.push(`${payload.modulesCount} ${copy.statsModulesLabel}`);
  }

  const statsText = statsParts.join(" · ");
  const statsMarkup = statsText
    ? `<p style="color:#4B5563;font-size:15px;line-height:1.6;margin:0 0 12px 0;">${statsText}</p>`
    : "";

  const url = payload.pathSlug
    ? `${SITE_URL.replace(/\/$/, "")}/paths/${payload.pathSlug}`
    : SITE_URL;

  const htmlTemplate = await loadTemplate(copy.templatePath);
  const html = applyTemplate(htmlTemplate, {
    subject,
    preview_text: copy.preview,
    hero_title: heroTitle,
    description,
    stats_markup: statsMarkup,
    cta_label: copy.ctaLabel,
    cta_url: url,
    additional_note: copy.additionalNote,
  });

  const text = [
    heroTitle,
    "",
    description,
    statsText ? `\n${statsText}` : "",
    "",
    `${copy.ctaLabel}: ${url}`,
    "",
    copy.additionalNote,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject,
    html,
    text,
  };
}
