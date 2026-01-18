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
};

export default nextConfig;
















// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async rewrites() {
//     return [
//       // ← Sab Node.js wale tools ke liye (Word to PDF, Image to PDF, etc.)
//       {
//         source: "/api/:path*",
//         destination: "http://72.60.78.58:4000/:path*",
//       },
//       // ← PDF to Word ke liye (Python wala)
//       {
//         source: "/convert/:path*",
//         destination: "http://72.60.78.58:4000/convert/:path*",
//       },
//     ];
//   },
// };

// export default nextConfig;

