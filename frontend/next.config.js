/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/QuantumQuery-AI-Agent',
  assetPrefix: '/QuantumQuery-AI-Agent/',
};

module.exports = nextConfig;
