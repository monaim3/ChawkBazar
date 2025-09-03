import nextPWA from 'next-pwa';
import runtimeCache from 'next-pwa/cache';
import { i18n } from './next-i18next.config';

const withPWA = nextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV !== 'production',
  runtimeCaching: runtimeCache,
});

export default withPWA({
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "app.cirqlsync.com",
        pathname: "/**",
      },
    ],
    // If you're on an older Next.js version, you can just use:
    // domains: ["static.bitcommerz.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
});
