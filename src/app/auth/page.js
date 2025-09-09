// app/auth/page.js
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AuthScreen from '@/components/AuthScreen';

export default function AuthPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Pokud je uživatel již přihlášen, přesměrovat na hlavní stránku
  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleLoginSuccess = (user) => {
    // Po úspěšném přihlášení přesměrovat na hlavní stránku
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  // Pokud se načítá stav autentizace, zobrazit loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-red-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // Pokud uživatel není přihlášen, zobrazit AuthScreen
  if (!user) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />;
  }

  // Pokud je uživatel přihlášen (nemělo by nastat díky redirect výše)
  return null;
}