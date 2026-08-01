import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  // Hosted at https://study.nkdr.me/docs
  basePath: '/docs',
};

export default withMDX(config);
