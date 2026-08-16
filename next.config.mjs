/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: true,
    browsersListForSwc: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  compress: true,
  poweredByHeader: false,

  async rewrites() {
    return [
      {
        source: "/api/converted/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/converted/:path*`,
      },
      {
      source: "/converted/:path*",
      destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/converted/:path*`,
      },
      {
        source: "/convert/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/:path*`,
      },
      {
        source: "/api/:path((?!convert).*)",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      // Internal redirects only
      { source: "/tools/:slug*", destination: "/:slug*", permanent: true },
      { source: "/excel-to-pdf", destination: "/excel-pdf", permanent: true },
      { source: "/blog/excel-to-pdf", destination: "/blog/excel-pdf", permanent: true },

      // ===== Tool Pages migrated to convertlinx.com (same slug) =====
      { source: "/image-converter", destination: "https://convertlinx.com/image-converter", permanent: true },
      { source: "/heic-to-jpg", destination: "https://convertlinx.com/heic-to-jpg", permanent: true },
      { source: "/signature-maker", destination: "https://convertlinx.com/signature-maker", permanent: true },
      { source: "/image-to-text", destination: "https://convertlinx.com/image-to-text", permanent: true },
      { source: "/image-compressor", destination: "https://convertlinx.com/image-compressor", permanent: true },
      { source: "/youtube-thumbnail", destination: "https://convertlinx.com/youtube-thumbnail", permanent: true },
      { source: "/unit-converter", destination: "https://convertlinx.com/unit-converter", permanent: true },
      { source: "/password-gen", destination: "https://convertlinx.com/password-gen", permanent: true },
      { source: "/qr-generator", destination: "https://convertlinx.com/qr-generator", permanent: true },
      { source: "/image-resizer", destination: "https://convertlinx.com/image-resizer", permanent: true },

      // ===== Old Blog Pages migrated to convertlinx.com (updated slugs) =====
      { source: "/blog/heic-to-jpg", destination: "https://convertlinx.com/blog/convert-heic-to-jpg-free-online", permanent: true },
      { source: "/blog/signature-maker", destination: "https://convertlinx.com/blog/create-digital-signature-online-free", permanent: true },
      { source: "/blog/image-to-text", destination: "https://convertlinx.com/blog/extract-text-from-image-ocr-free", permanent: true },
      { source: "/blog/image-compressor", destination: "https://convertlinx.com/blog/compress-images-without-losing-quality", permanent: true },
      { source: "/blog/youtube-thumbnail", destination: "https://convertlinx.com/blog/download-youtube-thumbnail-hd-free", permanent: true },
      { source: "/blog/unit-converter", destination: "https://convertlinx.com/blog/free-online-unit-converter-guide", permanent: true },
      { source: "/blog/password-gen", destination: "https://convertlinx.com/blog/how-to-create-strong-password-online", permanent: true },
      { source: "/blog/qr-generator", destination: "https://convertlinx.com/blog/how-to-generate-qr-code-online-free", permanent: true },

      // ===== Blog routes renamed WITHIN pdflinx.com (old slug -> current live slug) =====
      { source: "/blog/pdf-to-word", destination: "/blog/pdf-to-word-accuracy-tips", permanent: true },
      { source: "/blog/word-to-pdf", destination: "/blog/word-to-pdf-best-practices", permanent: true },
      { source: "/blog/image-to-pdf", destination: "/blog/image-to-pdf-quality-guide", permanent: true },
      { source: "/blog/merge-pdf", destination: "/blog/when-to-merge-pdf-files", permanent: true },
      { source: "/blog/split-pdf", destination: "/blog/split-pdf-for-sharing", permanent: true },
      { source: "/blog/compress-pdf", destination: "/blog/compress-pdf-without-losing-quality", permanent: true },
      { source: "/blog/excel-pdf", destination: "/blog/excel-to-pdf-print-layout", permanent: true },
      { source: "/blog/pdf-to-jpg", destination: "/blog/pdf-to-jpg-vs-png", permanent: true },
      { source: "/blog/ppt-to-pdf", destination: "/blog/ppt-to-pdf-fonts-missing", permanent: true },
      { source: "/blog/protect-pdf", destination: "/blog/pdf-password-best-practices", permanent: true },
      { source: "/blog/unlock-pdf", destination: "/blog/forgot-pdf-password-options", permanent: true },
      { source: "/blog/rotate-pdf", destination: "/blog/pdf-pages-upside-down-fix", permanent: true },
      { source: "/blog/sign-pdf", destination: "/blog/digital-vs-electronic-signature-pdf", permanent: true },
      { source: "/blog/ocr-pdf", destination: "/blog/ocr-pdf-accuracy-languages", permanent: true },
      { source: "/blog/edit-pdf", destination: "/blog/edit-pdf-without-word", permanent: true },
      { source: "/blog/add-watermark", destination: "/blog/watermark-pdf-for-freelancers", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/embed/:path*",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
        ],
      },
      {
        source: "/:path*\\.(js|css|woff|woff2|ttf|otf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*\\.(png|jpg|jpeg|gif|svg|ico|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;

























// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   experimental: {
//     optimizeCss: true,
//     browsersListForSwc: true,
//   },
//   compiler: {
//     removeConsole: process.env.NODE_ENV === "production",
//   },

//   images: {
//     formats: ["image/avif", "image/webp"],
//     minimumCacheTTL: 60,
//     deviceSizes: [640, 750, 828, 1080, 1200, 1920],
//     imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
//   },

//   compress: true,
//   poweredByHeader: false,

//   async rewrites() {
//     return [
//       {
//         source: "/api/converted/:path*",
//         destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/converted/:path*`,
//       },
//       {
//       source: "/converted/:path*",
//       destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/converted/:path*`,
//       },
//       {
//         source: "/convert/:path*",
//         destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/:path*`,
//       },
//       {
//         source: "/api/:path((?!convert).*)",
//         destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
//       },
//     ];
//   },

//   async redirects() {
//     return [
//       // Internal redirects only
//       { source: "/tools/:slug*", destination: "/:slug*", permanent: true },
//       { source: "/excel-to-pdf", destination: "/excel-pdf", permanent: true },
//       { source: "/blog/excel-to-pdf", destination: "/blog/excel-pdf", permanent: true },

//       // ===== Tool Pages migrated to convertlinx.com (same slug) =====
//       { source: "/image-converter", destination: "https://convertlinx.com/image-converter", permanent: true },
//       { source: "/heic-to-jpg", destination: "https://convertlinx.com/heic-to-jpg", permanent: true },
//       { source: "/signature-maker", destination: "https://convertlinx.com/signature-maker", permanent: true },
//       { source: "/image-to-text", destination: "https://convertlinx.com/image-to-text", permanent: true },
//       { source: "/image-compressor", destination: "https://convertlinx.com/image-compressor", permanent: true },
//       { source: "/youtube-thumbnail", destination: "https://convertlinx.com/youtube-thumbnail", permanent: true },
//       { source: "/unit-converter", destination: "https://convertlinx.com/unit-converter", permanent: true },
//       { source: "/password-gen", destination: "https://convertlinx.com/password-gen", permanent: true },
//       { source: "/qr-generator", destination: "https://convertlinx.com/qr-generator", permanent: true },
//       { source: "/image-resizer", destination: "https://convertlinx.com/image-resizer", permanent: true },

//       // ===== Old Blog Pages migrated to convertlinx.com (updated slugs) =====
//       { source: "/blog/heic-to-jpg", destination: "https://convertlinx.com/blog/convert-heic-to-jpg-free-online", permanent: true },
//       { source: "/blog/signature-maker", destination: "https://convertlinx.com/blog/create-digital-signature-online-free", permanent: true },
//       { source: "/blog/image-to-text", destination: "https://convertlinx.com/blog/extract-text-from-image-ocr-free", permanent: true },
//       { source: "/blog/image-compressor", destination: "https://convertlinx.com/blog/compress-images-without-losing-quality", permanent: true },
//       { source: "/blog/youtube-thumbnail", destination: "https://convertlinx.com/blog/download-youtube-thumbnail-hd-free", permanent: true },
//       { source: "/blog/unit-converter", destination: "https://convertlinx.com/blog/free-online-unit-converter-guide", permanent: true },
//       { source: "/blog/password-gen", destination: "https://convertlinx.com/blog/how-to-create-strong-password-online", permanent: true },
//       { source: "/blog/qr-generator", destination: "https://convertlinx.com/blog/how-to-generate-qr-code-online-free", permanent: true },
//     ];
//   },

//   async headers() {
//     return [
//       {
//         source: "/embed/:path*",
//         headers: [
//           { key: "X-Frame-Options", value: "ALLOWALL" },
//           { key: "Content-Security-Policy", value: "frame-ancestors *" },
//         ],
//       },
//       {
//         source: "/:path*\\.(js|css|woff|woff2|ttf|otf|eot)",
//         headers: [
//           {
//             key: "Cache-Control",
//             value: "public, max-age=31536000, immutable",
//           },
//         ],
//       },
//       {
//         source: "/:path*\\.(png|jpg|jpeg|gif|svg|ico|webp|avif)",
//         headers: [
//           {
//             key: "Cache-Control",
//             value: "public, max-age=2592000, stale-while-revalidate=86400",
//           },
//         ],
//       },
//       {
//         source: "/(.*)",
//         headers: [
//           { key: "X-Content-Type-Options", value: "nosniff" },
//           { key: "X-DNS-Prefetch-Control", value: "on" },
//           { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
//         ],
//       },
//     ];
//   },
// };

// export default nextConfig;



























// // /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   experimental: {
// //     optimizeCss: true,
// //     browsersListForSwc: true,
// //   },
// //   compiler: {
// //     removeConsole: process.env.NODE_ENV === "production",
// //   },

// //   images: {
// //     formats: ["image/avif", "image/webp"],
// //     minimumCacheTTL: 60,
// //     deviceSizes: [640, 750, 828, 1080, 1200, 1920],
// //     imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
// //   },

// //   compress: true,
// //   poweredByHeader: false,

// //   async rewrites() {
// //     return [
// //       {
// //         source: "/api/converted/:path*",
// //         destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/converted/:path*`,
// //       },
// //       {
// //       source: "/converted/:path*",
// //       destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/converted/:path*`,
// //       },
// //       {
// //         source: "/convert/:path*",
// //         destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/:path*`,
// //       },
// //       {
// //         source: "/api/:path((?!convert).*)",
// //         destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
// //       },
// //     ];
// //   },

// //   async redirects() {
// //     return [
// //       // Internal redirects only
// //       { source: "/tools/:slug*", destination: "/:slug*", permanent: true },
// //       { source: "/excel-to-pdf", destination: "/excel-pdf", permanent: true },
// //       { source: "/blog/excel-to-pdf", destination: "/blog/excel-pdf", permanent: true },
// //     ];
// //   },

// //   async headers() {
// //     return [
// //       {
// //         source: "/embed/:path*",
// //         headers: [
// //           { key: "X-Frame-Options", value: "ALLOWALL" },
// //           { key: "Content-Security-Policy", value: "frame-ancestors *" },
// //         ],
// //       },
// //       {
// //         source: "/:path*\\.(js|css|woff|woff2|ttf|otf|eot)",
// //         headers: [
// //           {
// //             key: "Cache-Control",
// //             value: "public, max-age=31536000, immutable",
// //           },
// //         ],
// //       },
// //       {
// //         source: "/:path*\\.(png|jpg|jpeg|gif|svg|ico|webp|avif)",
// //         headers: [
// //           {
// //             key: "Cache-Control",
// //             value: "public, max-age=2592000, stale-while-revalidate=86400",
// //           },
// //         ],
// //       },
// //       {
// //         source: "/(.*)",
// //         headers: [
// //           { key: "X-Content-Type-Options", value: "nosniff" },
// //           { key: "X-DNS-Prefetch-Control", value: "on" },
// //           { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
// //         ],
// //       },
// //     ];
// //   },
// // };

// // export default nextConfig;












