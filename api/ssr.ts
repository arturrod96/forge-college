import { readFileSync } from "fs";
import { join } from "path";

let cachedTemplate: string | null = null;
let ssrRender: null | ((url: string) => Promise<string>) = null;

export default async function handler(req: any, res: any) {
  try {
    // DEBUG: comente após testar
    res.status(200).send("<h1>SSR BOOT OK</h1>");
    return;

    // 1) Carregar template sempre DENTRO do try
    if (!cachedTemplate) {
      const htmlPath = join(process.cwd(), "public", "index.html");
      cachedTemplate = readFileSync(htmlPath, "utf-8");
      if (!cachedTemplate.includes("<!--ssr-outlet-->")) {
        // fallback seguro para evitar corpo vazio
        cachedTemplate =
          "<!doctype html><html><head><meta charset='utf-8'><title>Forge</title></head><body><!--ssr-outlet--></body></html>";
      }
    }

    // 2) Import SSR bundle DENTRO do try (evita crash em cold start)
    if (!ssrRender) {
      // 👇 **AQUI** precisa apontar para o bundle SSR gerado pelo `vite build --ssr`
      const mod = await import("../dist/client/entry-server.js"); // ou .mjs conforme seu output
      ssrRender = mod.render ?? mod.default;
      if (!ssrRender) throw new Error("SSR render() not found in entry-server");
    }

    const url = req.url || "/";
    const appHtml = await ssrRender(url);
    const html = cachedTemplate.replace("<!--ssr-outlet-->", appHtml);

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  } catch (e: any) {
    // Devolva SEMPRE um corpo de erro visível (evita "0 linhas")
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.status(500).send("SSR ERROR: " + (e?.stack || e?.message || String(e)));
  }
}
