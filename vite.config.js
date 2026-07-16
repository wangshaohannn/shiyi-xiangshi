import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fallbackSiteUrl, requireSiteUrl } from "./config/env.js";

function htmlSeoPlugin(siteUrl) {
  return {
    name: "shiyi-html-seo",
    transformIndexHtml(html) {
      return html.replaceAll("__SITE_URL__", siteUrl);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const mergedEnv = { ...env, ...process.env };
  const siteUrl = mode === "production" ? requireSiteUrl(mergedEnv) : fallbackSiteUrl(mergedEnv);

  return {
    base: mergedEnv.VITE_BASE_PATH || "/",
    plugins: [react(), tailwindcss(), htmlSeoPlugin(siteUrl)],
    server: {
      proxy: {
        "/api": "http://127.0.0.1:8787",
      },
    },
  };
});
