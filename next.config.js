/** @type {import('next').NextConfig} */
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const nextConfig = {
  images: {
    domains: ['api.dicebear.com', 'xsgames.co'],
  },
  reactStrictMode: true,

  webpack: (config, { isServer }) => {
    // Copy pdf.worker.min.js to public/workers
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname, './node_modules/pdfjs-dist/build/pdf.worker.min.js'),
            to: path.join(__dirname, 'public', 'workers'),
          },
        ],
      })
    );

    // Only modify entry on client side
    if (!isServer) {
      const originalEntry = config.entry; // ✅ Store original
      config.entry = async () => {
        const entries = await originalEntry(); // ✅ Call original
        entries['pdf.worker'] = path.resolve(__dirname, './node_modules/pdfjs-dist/build/pdf.worker.min.js');
        return entries;
      };
    }

    return config;
  },
};

module.exports = nextConfig;
