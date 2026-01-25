/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
      },
      {
        source: "/convert/:path*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/:path*`,
      },
    ];
  },

  async redirects() {
    return [
      // ✅ redirect any old /tools/... link to root
      {
        source: "/tools/:slug*",
        destination: "/:slug*",
        permanent: true,
      },

      // ✅ optional: old wrong excel URL (since you had it in blog)
      {
        source: "/excel-to-pdf",
        destination: "/excel-pdf",
        permanent: true,
      },
      {
        source: "/blog/excel-to-pdf",
        destination: "/blog/excel-pdf",
        permanent: true,
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
//         source: "/api/:path*",
//         destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/:path*`,
//       },
//       {
//         source: "/convert/:path*",
//         destination: `${process.env.NEXT_PUBLIC_BACKEND_URL}/convert/:path*`,
//       },
//     ];
//   },
// };

// export default nextConfig;


