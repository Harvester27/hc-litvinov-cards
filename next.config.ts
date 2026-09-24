import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/games/cards', destination: '/games', permanent: false },
      { source: '/games/lancers-dynasty', destination: '/games', permanent: false },
      { source: '/profil/odmeny', destination: '/profil', permanent: false },
      { source: '/sbirka-karet', destination: '/games', permanent: false },
      { source: '/uspechy', destination: '/games', permanent: false },
      { source: '/zebricek', destination: '/games', permanent: false },
    ];
  },
};

export default nextConfig;
