'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { 
  getUserProfile, 
  updateUserProfile, 
  uploadAvatar, 
  deleteOldAvatar,
  changePassword,
  validateDisplayName,
  getXPForLevel
} from '@/lib/firebaseProfile';
import { syncToLeaderboard } from '@/lib/firebaseLeaderboardSync';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  User, Camera, Save, Lock, Loader, AlertCircle, 
  CheckCircle, Edit2, X, Shield, Zap, Coins,
  TrendingUp, Award, Star
} from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef(null);
  
  // State pro profil
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State pro editaci
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState('');
  const [nameError, setNameError] = useState('');
  
  // State pro změnu hesla
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // State pro avatar
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  
  // Načíst profil při mountu
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/games/cards');
      return;
    }
    
    if (user) {
      loadProfile();
    }
  }, [user, authLoading, router]);
  
  const loadProfile = async () => {
    try {
      const profileData = await getUserProfile(user.uid);
      setProfile(profileData);
      setNewDisplayName(profileData?.displayName || '');
      
      // Po načtení profilu synchronizovat žebříček (pokud ještě není)
      if (profileData) {
        await syncProfileToLeaderboard(profileData);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Pomocná funkce pro synchronizaci s kompletními daty
  const syncProfileToLeaderboard = async (profileData) => {
    try {
      // Načíst počet karet
      const cardsRef = collection(db, 'users', user.uid, 'cardCollection');
      const cardsSnap = await getDocs(cardsRef);
      const totalCards = cardsSnap.size;
      
      // Načíst počet kvízů
      const quizzesRef = collection(db, 'users', user.uid, 'completedQuizzes');
      const quizzesSnap = await getDocs(quizzesRef);
      const totalQuizzes = quizzesSnap.size;
      
      // Synchronizovat s žebříčkem
      await syncToLeaderboard(user.uid, {
        displayName: profileData.displayName || 'Anonymní hráč',
        avatarUrl: profileData.avatar || null,
        level: profileData.level || 1,
        xp: profileData.xp || 0,
        credits: profileData.credits || 0,
        totalCards: totalCards,
        totalQuizzes: totalQuizzes
      });
      
      console.log('✅ Profile synchronized to leaderboard');
    } catch (error) {
      console.error('Error syncing to leaderboard:', error);
    }
  };
  
  // Změna avataru
  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setUploadingAvatar(true);
    setAvatarError('');
    
    try {
      // Smazat starý avatar
      if (profile?.avatar) {
        await deleteOldAvatar(profile.avatar);
      }
      
      // Nahrát nový
      const newAvatarUrl = await uploadAvatar(user.uid, file);
      
      // Aktualizovat lokální state
      const updatedProfile = { ...profile, avatar: newAvatarUrl };
      setProfile(updatedProfile);
      
      // Synchronizovat s žebříčkem s novým avatarem
      await syncProfileToLeaderboard(updatedProfile);
      
      // Reload aby se avatar zobrazil i v navigaci
      window.location.reload();
    } catch (error) {
      setAvatarError(error.message || 'Chyba při nahrávání avataru');
    } finally {
      setUploadingAvatar(false);
    }
  };
  
  // Změna jména
  const handleSaveName = async () => {
    const error = validateDisplayName(newDisplayName);
    if (error) {
      setNameError(error);
      return;
    }
    
    setNameError('');
    
    try {
      await updateUserProfile(user.uid, { displayName: newDisplayName });
      
      // Aktualizovat lokální state
      const updatedProfile = { ...profile, displayName: newDisplayName };
      setProfile(updatedProfile);
      setIsEditingName(false);
      
      // Synchronizovat s žebříčkem s novým jménem
      await syncProfileToLeaderboard(updatedProfile);
      
      // Reload aby se jméno zobrazilo i v navigaci
      window.location.reload();
    } catch (error) {
      setNameError('Chyba při ukládání jména');
    }
  };
  
  // Změna hesla
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    // Validace
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Vyplňte všechna pole');
      return;
    }
    
    if (newPassword.length < 8) {
      setPasswordError('Nové heslo musí mít alespoň 8 znaků');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setPasswordError('Hesla se neshodují');
      return;
    }
    
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess('Heslo bylo úspěšně změněno!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordForm(false);
        setPasswordSuccess('');
      }, 3000);
    } catch (error) {
      setPasswordError(error.message || 'Chyba při změně hesla');
    }
  };
  
  // Vypočítat progress do dalšího levelu
  const calculateProgress = () => {
    if (!profile) return { percentage: 0, current: 0, needed: 0 };
    
    const currentLevelXP = getXPForLevel(profile.level);
    const nextLevelXP = getXPForLevel(profile.level + 1);
    const xpInCurrentLevel = profile.xp - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    const percentage = (xpInCurrentLevel / xpNeededForLevel) * 100;
    
    return {
      percentage: Math.min(100, Math.max(0, percentage)),
      current: xpInCurrentLevel,
      needed: xpNeededForLevel
    };
  };
  
  const progress = calculateProgress();
  
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <Loader className="animate-spin text-red-600" size={48} />
      </div>
    );
  }
  
  if (!user || !profile) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navigation />
      
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black text-gray-900 mb-4">
              Můj profil
            </h1>
            <p className="text-xl text-gray-600">
              Správa účtu a herního profilu
            </p>
          </div>
          
          {/* Profilová karta */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-r from-red-600 to-red-700 relative">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-4 right-4 bg-white/20 backdrop-blur rounded-full px-4 py-2">
                <span className="text-white font-bold">ID: {user.uid.slice(-6).toUpperCase()}</span>
              </div>
            </div>
            
            {/* Avatar a základní info */}
            <div className="relative px-8 pb-8">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-white p-1 shadow-xl">
                    {profile.avatar ? (
                      <Image
                        src={profile.avatar}
                        alt="Avatar"
                        width={128}
                        height={128}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center">
                        <User className="text-white" size={48} />
                      </div>
                    )}
                  </div>
                  
                  {/* Tlačítko pro změnu avataru */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute bottom-0 right-0 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-all group-hover:scale-110 shadow-lg"
                  >
                    {uploadingAvatar ? (
                      <Loader className="animate-spin" size={18} />
                    ) : (
                      <Camera size={18} />
                    )}
                  </button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                
                {/* Jméno a email */}
                <div className="flex-1 text-center md:text-left">
                  {isEditingName ? (
                    <div className="flex items-center gap-2 max-w-sm">
                      <input
                        type="text"
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        placeholder="Nové jméno"
                        maxLength={20}
                      />
                      <button
                        onClick={handleSaveName}
                        className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                      >
                        <Save size={20} />
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingName(false);
                          setNewDisplayName(profile.displayName);
                          setNameError('');
                        }}
                        className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <h2 className="text-3xl font-bold text-gray-900">
                        {profile.displayName}
                      </h2>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1.5 text-gray-500 hover:text-red-600 transition-all"
                      >
                        <Edit2 size={20} />
                      </button>
                    </div>
                  )}
                  
                  {nameError && (
                    <p className="text-red-600 text-sm mt-1">{nameError}</p>
                  )}
                  
                  <p className="text-gray-600 mt-1">{user.email}</p>
                </div>
                
                {/* Stats cards */}
                <div className="flex gap-4">
                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Zap className="text-yellow-500" size={24} />
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                      {profile.level}
                    </div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider">
                      Level
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Coins className="text-green-600" size={24} />
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                      {profile.credits.toLocaleString('cs-CZ')}
                    </div>
                    <div className="text-xs text-gray-600 uppercase tracking-wider">
                      Kreditů
                    </div>
                  </div>
                </div>
              </div>
              
              {avatarError && (
                <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {avatarError}
                  </p>
                </div>
              )}
            </div>
            
            {/* XP Progress */}
            <div className="px-8 pb-8">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Progress do Level {profile.level + 1}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {progress.current} / {progress.needed} XP
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-red-600">
                      {Math.floor(progress.percentage)}%
                    </div>
                  </div>
                </div>
                
                <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-700 transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${progress.percentage}%` }}
                  >
                    {progress.percentage > 10 && (
                      <Star className="text-white animate-pulse" size={12} />
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Změna hesla */}
            <div className="px-8 pb-8">
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Shield className="text-red-600" size={24} />
                  Zabezpečení účtu
                </h3>
                
                {!showPasswordForm ? (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2"
                  >
                    <Lock size={20} />
                    Změnit heslo
                  </button>
                ) : (
                  <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Aktuální heslo
                      </label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nové heslo
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        required
                        minLength={8}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Potvrdit nové heslo
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                        required
                        minLength={8}
                      />
                    </div>
                    
                    {passwordError && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-600 text-sm flex items-center gap-2">
                          <AlertCircle size={16} />
                          {passwordError}
                        </p>
                      </div>
                    )}
                    
                    {passwordSuccess && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-green-600 text-sm flex items-center gap-2">
                          <CheckCircle size={16} />
                          {passwordSuccess}
                        </p>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                      >
                        Uložit heslo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowPasswordForm(false);
                          setCurrentPassword('');
                          setNewPassword('');
                          setConfirmPassword('');
                          setPasswordError('');
                          setPasswordSuccess('');
                        }}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                      >
                        Zrušit
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
            
            {/* Account info */}
            <div className="bg-gray-50 px-8 py-6">
              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">Účet vytvořen:</span>{' '}
                  {profile.createdAt && new Date(profile.createdAt.seconds * 1000).toLocaleDateString('cs-CZ')}
                </div>
                <div>
                  <span className="font-semibold">Poslední přihlášení:</span>{' '}
                  {profile.lastLogin && new Date(profile.lastLogin.seconds * 1000).toLocaleDateString('cs-CZ')}
                </div>
                <div>
                  <span className="font-semibold">Celkem XP:</span>{' '}
                  {profile.xp.toLocaleString('cs-CZ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}