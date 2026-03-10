import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.scdn.co' },         // Spotify images
      { protocol: 'https', hostname: 'mosaic.scdn.co' },    // Spotify mosaic
      { protocol: 'https', hostname: 'upload.wikimedia.org' }, // Wikipedia
      { protocol: 'https', hostname: 'raw.githubusercontent.com' }, // GitHub raw
      { protocol: 'https', hostname: '**.ytimg.com' },      // YouTube thumbnails
    ],
  },
};

export default nextConfig;
