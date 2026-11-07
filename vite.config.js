import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const base = mode === "gh-pages" ? "/batigyan-doctor-site/" : "/";
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "inject-lcp-preload",
        transformIndexHtml(html) {
          const link = `<link rel="preload" as="image" href="${base}opt/ge-pc.webp" media="(min-width: 769px)" fetchpriority="high">\n  <link rel="preload" as="image" href="${base}opt/ge-mobil.webp" media="(max-width: 768px)" fetchpriority="high">`;
          const noindex = mode === "gh-pages" ? `\n  <meta name="robots" content="noindex, nofollow">` : "";
          return html.replace("</head>", `${link}${noindex}\n  </head>`);
        },
      },
    ],
    base,
    server: {
      host: "0.0.0.0",
      port: 3000,
      strictPort: true,
      hmr: {
        port: 3000,
      },
    },
  };
});