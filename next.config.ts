import type { NextConfig } from "next";

/**
 * `PAGES=1` liga o modo prévia: exportação estática para o GitHub Pages,
 * que serve o site em /cabanaafrodite e não tem servidor para otimizar
 * imagem sob demanda. O build normal (Vercel, Node, qualquer host) fica
 * intocado, com otimização de imagem ligada.
 */
const isPages = process.env.PAGES === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Remove o indicador "N" do Next no canto da tela em desenvolvimento.
  devIndicators: false,
  ...(isPages
    ? {
        output: "export" as const,
        distDir: ".next-pages",
        basePath,
        assetPrefix: basePath,
        /* Gera `reserva/index.html` em vez de `reserva.html`. O GitHub Pages
           serve o índice do diretório, então a página abre tanto em
           /reserva quanto em /reserva/ — sem isso, a URL com barra final
           dava 404, e é fácil um link chegar assim ao cliente. */
        trailingSlash: true,
      }
    : {}),
  images: {
    // Sem servidor no Pages, as imagens vão como estão.
    unoptimized: isPages,
    // AVIF primeiro, WebP como fallback. JPEG/PNG só para navegadores antigos.
    formats: ["image/avif", "image/webp"],
    // Larguras alinhadas aos breakpoints reais do layout, evita gerar variantes inúteis.
    deviceSizes: [420, 640, 828, 1080, 1280, 1600, 1920, 2560],
    imageSizes: [160, 240, 320, 400, 560],
    qualities: [75, 82, 85],
  },
  poweredByHeader: false,
};

export default nextConfig;
