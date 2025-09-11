'use client';

import dynamic from 'next/dynamic';

// Dynamicky importujeme komponentu bez SSR
const Bowling3D = dynamic(() => import('@/components/Bowling3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-yellow-400 mx-auto mb-4"></div>
        <p className="text-white text-xl">Načítám bowling...</p>
      </div>
    </div>
  )
});

export default function LancersBowlingPage() {
  return <Bowling3D />;
}