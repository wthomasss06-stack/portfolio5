/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export' retiré → permet les Route Handlers sur Vercel
  images: { unoptimized: true },
}
module.exports = nextConfig
