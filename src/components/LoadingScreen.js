'use client';
import { Flame } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-red-600 flex items-center justify-center">
      <div className="text-center text-white">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Flame size={32} />
        </div>
        <h2 className="text-2xl font-bold">HC Litvínov Cards</h2>
        <p className="text-blue-200 mt-2">Načítám...</p>
      </div>
    </div>
  );
}