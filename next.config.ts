import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    domains: ['placeholder.co', 'picsum.photos', 'osbzqkqixubvuqvlppfb.supabase.co'],
  },
  webpack: (config, { dev, isServer }) => {
    // 개발 환경에서만 적용
    if (dev && !isServer) {
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000, // 폴링 간격 설정
        aggregateTimeout: 300, // 변경 감지 후 재컴파일까지의 대기 시간
      };
    }
    return config;
  },
};

export default config;
