// next.config.js
const withMDX = require('@next/mdx')();
const nextConfig = withMDX({
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  experimental: {
    appDir: true,
  },
  reactStrictMode: true, 
});
module.exports = nextConfig;
