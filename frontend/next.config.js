/** @type {import('next').NextConfig} */
const nextConfig = {
  // 关闭 webpack 持久化缓存，规避某些受限文件系统的并发 mkdir 竞态
  webpack: (config) => {
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
