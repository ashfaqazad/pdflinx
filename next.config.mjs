/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Performance: CSS & Console optimization
  experimental: {
    optimizeCss: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ✅ Performance: Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // ✅ Performance: Compression enable
  compress: true,

  // ✅ Performance: Power by header hatao (minor security + perf)
  poweredByHeader: false,

  async rewrites() {
    return [
      {
        source: "/api/converted/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/converted/:path*`,
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
      // Existing redirects
      { source: "/tools/:slug*", destination: "/:slug*", permanent: true },
      { source: "/excel-to-pdf", destination: "/excel-pdf", permanent: true },
      { source: "/blog/excel-to-pdf", destination: "/blog/excel-pdf", permanent: true },

      // Utility Tools -> ConvertLinx
      {
        source: "/qr-generator",
        destination: "https://convertlinx.com/qr-generator",
        permanent: true,
      },
      {
        source: "/password-gen",
        destination: "https://convertlinx.com/password-gen",
        permanent: true,
      },
      {
        source: "/unit-converter",
        destination: "https://convertlinx.com/unit-converter",
        permanent: true,
      },
      {
        source: "/youtube-thumbnail",
        destination: "https://convertlinx.com/youtube-thumbnail",
        permanent: true,
      },
      {
        source: "/image-compressor",
        destination: "https://convertlinx.com/image-compressor",
        permanent: true,
      },
      {
        source: "/image-to-text",
        destination: "https://convertlinx.com/image-to-text",
        permanent: true,
      },
      {
        source: "/signature-maker",
        destination: "https://convertlinx.com/signature-maker",
        permanent: true,
      },

      // {
      //   source: "/text-to-pdf",
      //   destination: "https://convertlinx.com/text-to-pdf",
      //   permanent: true,
      // },
      {
        source: "/heic-to-jpg",
        destination: "https://convertlinx.com/heic-to-jpg",
        permanent: true,
      },
      {
        source: "/image-converter",
        destination: "https://convertlinx.com/image-converter",
        permanent: true,
      },

      // Utility Tool Blogs -> ConvertLinx
      {
        source: "/blog/qr-generator",
        destination: "https://convertlinx.com/blog/qr-generator",
        permanent: true,
      },
      {
        source: "/blog/password-gen",
        destination: "https://convertlinx.com/blog/password-gen",
        permanent: true,
      },
      {
        source: "/blog/unit-converter",
        destination: "https://convertlinx.com/blog/unit-converter",
        permanent: true,
      },
      {
        source: "/blog/youtube-thumbnail",
        destination: "https://convertlinx.com/blog/youtube-thumbnail",
        permanent: true,
      },
      {
        source: "/blog/image-compressor",
        destination: "https://convertlinx.com/blog/image-compressor",
        permanent: true,
      },
      {
        source: "/blog/image-to-text",
        destination: "https://convertlinx.com/blog/image-to-text",
        permanent: true,
      },
      {
        source: "/blog/signature-maker",
        destination: "https://convertlinx.com/blog/signature-maker",
        permanent: true,
      },

      // {
      //   source: "/blog/text-to-pdf",
      //   destination: "https://convertlinx.com/blog/text-to-pdf",
      //   permanent: true,
      // },
      {
        source: "/blog/heic-to-jpg",
        destination: "https://convertlinx.com/blog/heic-to-jpg",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      // Existing: iframe embed support
      {
        source: "/embed/:path*",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors *" },
        ],
      },

      // ✅ Performance: Static assets ko 1 saal ke liye cache karo
      {
        source: "/:path*\\.(js|css|woff|woff2|ttf|otf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // ✅ Performance: Images cache - 30 din
      {
        source: "/:path*\\.(png|jpg|jpeg|gif|svg|ico|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },

      // ✅ Security + Performance: HTML pages ke liye
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
//   async rewrites() {
//     return [
//       {
//         source: "/api/converted/:path*",
//         destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/converted/:path*`,
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
//       // Existing redirects
//       { source: "/tools/:slug*", destination: "/:slug*", permanent: true },
//       { source: "/excel-to-pdf", destination: "/excel-pdf", permanent: true },
//       { source: "/blog/excel-to-pdf", destination: "/blog/excel-pdf", permanent: true },

//       // Utility Tools -> ConvertLinx
//       {
//         source: "/qr-generator",
//         destination: "https://convertlinx.com/qr-generator",
//         permanent: true,
//       },
//       {
//         source: "/password-gen",
//         destination: "https://convertlinx.com/password-gen",
//         permanent: true,
//       },
//       {
//         source: "/unit-converter",
//         destination: "https://convertlinx.com/unit-converter",
//         permanent: true,
//       },
//       {
//         source: "/youtube-thumbnail",
//         destination: "https://convertlinx.com/youtube-thumbnail",
//         permanent: true,
//       },
//       {
//         source: "/image-compressor",
//         destination: "https://convertlinx.com/image-compressor",
//         permanent: true,
//       },
//       {
//         source: "/image-to-text",
//         destination: "https://convertlinx.com/image-to-text",
//         permanent: true,
//       },
//       {
//         source: "/signature-maker",
//         destination: "https://convertlinx.com/signature-maker",
//         permanent: true,
//       },
//       {
//         source: "/text-to-pdf",
//         destination: "https://convertlinx.com/text-to-pdf",
//         permanent: true,
//       },
//       {
//         source: "/heic-to-jpg",
//         destination: "https://convertlinx.com/heic-to-jpg",
//         permanent: true,
//       },
//       {
//         source: "/image-converter",
//         destination: "https://convertlinx.com/image-converter",
//         permanent: true,
//       },

//       // Utility Tool Blogs -> ConvertLinx
//       {
//         source: "/blog/qr-generator",
//         destination: "https://convertlinx.com/blog/qr-generator",
//         permanent: true,
//       },
//       {
//         source: "/blog/password-gen",
//         destination: "https://convertlinx.com/blog/password-gen",
//         permanent: true,
//       },
//       {
//         source: "/blog/unit-converter",
//         destination: "https://convertlinx.com/blog/unit-converter",
//         permanent: true,
//       },
//       {
//         source: "/blog/youtube-thumbnail",
//         destination: "https://convertlinx.com/blog/youtube-thumbnail",
//         permanent: true,
//       },
//       {
//         source: "/blog/image-compressor",
//         destination: "https://convertlinx.com/blog/image-compressor",
//         permanent: true,
//       },
//       {
//         source: "/blog/image-to-text",
//         destination: "https://convertlinx.com/blog/image-to-text",
//         permanent: true,
//       },
//       {
//         source: "/blog/signature-maker",
//         destination: "https://convertlinx.com/blog/signature-maker",
//         permanent: true,
//       },
//       {
//         source: "/blog/text-to-pdf",
//         destination: "https://convertlinx.com/blog/text-to-pdf",
//         permanent: true,
//       },
//       {
//         source: "/blog/heic-to-jpg",
//         destination: "https://convertlinx.com/blog/heic-to-jpg",
//         permanent: true,
//       },
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
//     ];
//   },
// };

// export default nextConfig;

































// // /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   async rewrites() {
// //     return [
// //       {
// //         source: "/api/converted/:path*",
// //         destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/converted/:path*`,
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
// //     ];
// //   },
// // };

// // export default nextConfig;

























// // // /** @type {import('next').NextConfig} */
// // // const nextConfig = {
// // //   async rewrites() {
// // //     return [

// // //       {
// // //       source: "/api/converted/:path*",
// // //       destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/converted/:path*`,
// // //     },
// // //       {
// // //         source: "/convert/:path*",
// // //         destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/:path*`,
// // //       },

// // //       {
// // //         source: "/api/:path((?!convert).*)",
// // //         destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
// // //       },

// // //     ];
// // //   },

// // //   async redirects() {
// // //     return [
// // //       { source: "/tools/:slug*", destination: "/:slug*", permanent: true },
// // //       { source: "/excel-to-pdf", destination: "/excel-pdf", permanent: true },
// // //       { source: "/blog/excel-to-pdf", destination: "/blog/excel-pdf", permanent: true },
// // //     ];
// // //   },
// // // };

// // // export default nextConfig;

