/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: process.env.NODE_ENV !== 'development', // Disable strict mode in dev for performance
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
  compress: true,
  // // Seemed to fuck with dev server
  // webpack: (config) => {
  //   config.resolve.fallback = { fs: false, net: false, tls: false };

  //   // Handle ES modules in workers
  //   config.module.rules.push({
  //     test: /HeartbeatWorker\.js$/,
  //     type: 'javascript/auto',
  //   });

  //   // Configure optimization to exclude worker files from Terser
  //   config.optimization.minimizer = config.optimization.minimizer.map(
  //     (plugin) => {
  //       if (plugin.constructor.name === 'TerserPlugin') {
  //         plugin.options.exclude = /HeartbeatWorker\.js$/;
  //       }
  //       return plugin;
  //     }
  //   );

  //   // Additional optimizations
  //   config.optimization.splitChunks = {
  //     chunks: 'all',
  //     maxInitialRequests: 25,
  //     maxAsyncRequests: 25,
  //     cacheGroups: {
  //       vendor: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors',
  //         chunks: 'all',
  //       },
  //     },
  //   };

  //   // Tree shaking optimization for production
  //   if (process.env.NODE_ENV === 'production') {
  //     config.optimization.usedExports = true;
  //     config.optimization.sideEffects = false;
  //   }

  //   return config;
  // },
};

module.exports = nextConfig;
