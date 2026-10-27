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
          const link = `<link rel="preload" as="image" href="${base}opt/главныйэкран-cut.webp" fetchpriority="high">`;
          return html.replace("</head>", `${link}\n  </head>`);
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