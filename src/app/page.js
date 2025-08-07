'use client';
import { useAuth } from '@/hooks/useAuth';
import AuthScreen from '@/components/AuthScreen';
import GameHomeScreen from '@/components/GameHomeScreen';
import LoadingScreen from '@/components/LoadingScreen';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <GameHomeScreen user={user} />;
}