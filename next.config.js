// next.config.js
const withMDX = require('@next/mdx')(); // enables MDX

module.exports = withMDX({
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  reactStrictMode: true,
  // no experimental.appDir needed on Next 14+
});
