/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // ← Sab Node.js wale tools ke liye (Word to PDF, Image to PDF, etc.)
      {
        source: "/api/:path*",
        destination: "http://72.60.78.58:4000/:path*",
      },
      // ← PDF to Word ke liye (Python wala)
      {
        source: "/convert/:path*",
        destination: "http://72.60.78.58:4000/convert/:path*",
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
//         source: "/convert/:path*",                          // ← YEHI CHANGE KI HAI
//         destination: "http://72.60.78.58:4000/convert/:path*", // ← YEHI DESTINATION
//       },
//     ];
//   },
// };

// export default nextConfig;













// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async rewrites() {
//     return [
//       {
        // source: "/api/:path*",
//         destination: "http://72.60.78.58:4000/:path*", // Proxy to VPS backend
//       },
//     ];
//   },
// };

// export default nextConfig;
















// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   env: {
//     ILOVEPDF_PUBLIC_KEY: process.env.ILOVEPDF_PUBLIC_KEY,
//     ILOVEPDF_SECRET_KEY: process.env.ILOVEPDF_SECRET_KEY,
//   },
// };

// export default nextConfig;





// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
