import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

// Here we use the @cloudflare/next-on-pages next-dev module to allow us to use bindings during local development
// (when running the application with `next dev`), for more information see:
// https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md
if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'media.wired.com',
      'cdn.vox-cdn.com', // Existing domain
      'gizmodo.com', // Add this line for gizmodo.com
      // Add any other domains you need
    ],
  },
  reactStrictMode: true,
  // Other Next.js configurations can go here
};

export default nextConfig;
