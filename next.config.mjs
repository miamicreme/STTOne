/** @type {import('next').NextConfig} */
const nextConfig = {
  // Emit a fully static site to ./out — deploys to Render as a Static Site.
  output: 'export',
  // Static export can't use the on-demand image optimizer.
  images: { unoptimized: true },
  // Each route exports as a folder with index.html (plays well with static hosts).
  trailingSlash: true,
  reactStrictMode: true,
}

export default nextConfig
