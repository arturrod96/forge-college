import { join } from "path";
import { readFileSync, existsSync } from "fs";
import { pathToFileURL } from "url";

let cachedTemplate: string | null = null;
let ssrRender: null | ((url: string) => Promise<string>) = null;

export default async function handler(req: any, res: any) {
  try {
    if (!cachedTemplate) {
      const publicDir = join(process.cwd(), "public");
      const indexPath = join(publicDir, "index.html");
      const fallbackPath = join(publicDir, "bare.html");
      if (existsSync(indexPath)) {
        cachedTemplate = readFileSync(indexPath, "utf-8");
      } else if (existsSync(fallbackPath)) {
        cachedTemplate = readFileSync(fallbackPath, "utf-8");
      } else {
        cachedTemplate = "";
      }
    }

    if (!ssrRender) {
      try {
        const publicDir = join(process.cwd(), "public");
        const candidates = [
          join(publicDir, "entry-server.js"),
          join(publicDir, "entry-server.mjs"),
          join(publicDir, "server", "entry-server.js"),
          join(publicDir, "server", "entry-server.mjs"),
          join(process.cwd(), "api", "entry-server.js"),
          join(process.cwd(), "api", "entry-server.mjs"),
        ];
        const existing = candidates.find((p) => existsSync(p));
        if (existing) {
          const ssrUrl = pathToFileURL(existing).href;
          const mod = await import(ssrUrl);
          ssrRender = mod.render || null;
        }
      } catch {}
      if (!ssrRender) {
        ssrRender = async () => ""; // CSR fallback
      }
    }

    const url = req.url || "/";
    const appHtml = await ssrRender(url);
    const html = cachedTemplate.replace("<!--ssr-outlet-->", appHtml);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  } catch (e: any) {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(500).send("SSR ERROR: " + (e?.stack || e?.message || String(e)));
  }
}
