// 🔐 ENHANCED AUTH SCREEN - Autentizace přes emailové kódy (bez telefonu)
// Tento soubor implementuje bezpečné přihlašování s email verifikací a magic link
'use client';
import React, { useState, useEffect } from 'react';
import { 
  Mail, Lock, LogIn, UserPlus, Flame, Shield, 
  CheckCircle, AlertCircle, Loader, Key, Send,
  ArrowLeft, HelpCircle, Sparkles
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function EnhancedAuthScreen() {
  // Základní state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI state
  const [mode, setMode] = useState('login'); // login | register | magicLink | forgotPassword
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Magic link state
  const [emailForSignIn, setEmailForSignIn] = useState('');
  const [waitingForLink, setWaitingForLink] = useState(false);
  
  const router = useRouter();

  // Kontrola magic linku při načtení
  useEffect(() => {
    // Zkontrolovat, jestli uživatel přišel přes magic link
    if (isSignInWithEmailLink(auth, window.location.href)) {
      handleMagicLinkSignIn();
    }
    
    // Načíst uložený email pro magic link
    const savedEmail = window.localStorage.getItem('emailForSignIn');
    if (savedEmail) {
      setEmailForSignIn(savedEmail);
      setWaitingForLink(true);
    }
  }, []);

  // Validace formuláře
  const validateForm = () => {
    if (!email) {
      setError('Vyplňte email');
      return false;
    }

    // Validace emailu
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Neplatný formát emailu');
      return false;
    }

    if (mode === 'register') {
      if (!password) {
        setError('Vyplňte heslo');
        return false;
      }

      if (password.length < 8) {
        setError('Heslo musí mít alespoň 8 znaků');
        return false;
      }
      
      if (password !== confirmPassword) {
        setError('Hesla se neshodují');
        return false;
      }

      // Kontrola síly hesla
      const hasNumber = /\d/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);

      if (!hasNumber || !hasUpperCase || !hasLowerCase) {
        setError('Heslo musí obsahovat velká i malá písmena a čísla');
        return false;
      }
    }

    if (mode === 'login' && !password) {
      setError('Vyplňte heslo');
      return false;
    }

    return true;
  };

  // Klasické přihlášení/registrace
  const handleEmailPasswordAuth = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        // Přihlášení
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Kontrola email verifikace
        if (!userCredential.user.emailVerified) {
          setError('Prosím nejdřív potvrďte svůj email (zkontrolujte schránku včetně spamu)');
          
          // Znovu poslat verifikační email
          await sendEmailVerification(userCredential.user);
          setSuccess('Poslali jsme vám nový potvrzovací email');
          setLoading(false);
          return;
        }
        
        // Úspěšné přihlášení
        setSuccess('✅ Úspěšně přihlášeno!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
        
      } else if (mode === 'register') {
        // Registrace
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Poslat verifikační email
        await sendEmailVerification(userCredential.user, {
          url: window.location.origin,
          handleCodeInApp: false
        });
        
        setSuccess('✅ Účet vytvořen! Zkontrolujte email pro potvrzení (může být ve spamu).');
        setMode('login');
        
        // Vyčistit formulář
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
      
    } catch (err) {
      console.error('Auth error:', err);
      handleAuthError(err);
    }

    setLoading(false);
  };

  // Přihlášení přes magic link (bez hesla)
  const handleMagicLinkRequest = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Vyplňte email');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Zkontrolovat, jestli email existuje
      const methods = await fetchSignInMethodsForEmail(auth, email);
      
      if (methods.length === 0) {
        setError('Tento email není registrovaný. Nejdřív se zaregistrujte.');
        setLoading(false);
        return;
      }

      const actionCodeSettings = {
        url: window.location.origin,
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      // Uložit email pro pozdější použití
      window.localStorage.setItem('emailForSignIn', email);
      
      setWaitingForLink(true);
      setEmailForSignIn(email);
      setSuccess(`✅ Přihlašovací odkaz odeslán na ${email}! Zkontrolujte email (i spam).`);
      
    } catch (err) {
      console.error('Magic link error:', err);
      handleAuthError(err);
    }

    setLoading(false);
  };

  // Zpracování magic linku
  const handleMagicLinkSignIn = async () => {
    let emailToUse = emailForSignIn || window.localStorage.getItem('emailForSignIn');
    
    if (!emailToUse) {
      // Pokud nemáme email, zeptat se uživatele
      emailToUse = window.prompt('Prosím zadejte email pro dokončení přihlášení:');
    }

    if (!emailToUse) {
      setError('Email je potřeba pro dokončení přihlášení');
      return;
    }

    setLoading(true);

    try {
      const result = await signInWithEmailLink(auth, emailToUse, window.location.href);
      
      // Vyčistit localStorage
      window.localStorage.removeItem('emailForSignIn');
      
      setSuccess('✅ Úspěšně přihlášeno přes odkaz!');
      
      // Vyčistit URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
      
    } catch (err) {
      console.error('Magic link sign in error:', err);
      handleAuthError(err);
    }

    setLoading(false);
  };

  // Reset hesla
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Vyplňte email pro reset hesla');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin,
        handleCodeInApp: false
      });
      
      setSuccess('✅ Odkaz pro reset hesla odeslán! Zkontrolujte email (i spam).');
      setMode('login');
      
    } catch (err) {
      console.error('Password reset error:', err);
      handleAuthError(err);
    }

    setLoading(false);
  };

  // Google přihlášení
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      await signInWithPopup(auth, googleProvider);
      setSuccess('✅ Úspěšně přihlášeno přes Google!');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err) {
      console.error('Google sign in error:', err);
      handleAuthError(err);
    }
    
    setLoading(false);
  };

  // Centrální error handling
  const handleAuthError = (err) => {
    let errorMessage = 'Nastala chyba';
    
    switch (err.code) {
      case 'auth/user-not-found':
        errorMessage = 'Uživatel s tímto emailem neexistuje';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Nesprávné heslo';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'Email už je registrovaný';
        break;
      case 'auth/weak-password':
        errorMessage = 'Heslo je příliš slabé';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Neplatný email';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Příliš mnoho pokusů, zkuste to za chvíli';
        break;
      case 'auth/expired-action-code':
        errorMessage = 'Odkaz vypršel, požádejte o nový';
        break;
      case 'auth/invalid-action-code':
        errorMessage = 'Neplatný odkaz, požádejte o nový';
        break;
      case 'auth/user-disabled':
        errorMessage = 'Tento účet byl deaktivován';
        break;
      default:
        errorMessage = err.message;
    }
    
    setError(errorMessage);
  };

  // Zobrazit sílu hesla
  const getPasswordStrength = () => {
    if (!password) return null;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    const strengthLevels = [
      { level: 0, text: 'Velmi slabé', color: 'bg-red-500' },
      { level: 1, text: 'Slabé', color: 'bg-orange-500' },
      { level: 2, text: 'Střední', color: 'bg-yellow-500' },
      { level: 3, text: 'Dobré', color: 'bg-green-500' },
      { level: 4, text: 'Silné', color: 'bg-green-600' },
      { level: 5, text: 'Velmi silné', color: 'bg-green-700' },
    ];
    
    return strengthLevels[strength] || strengthLevels[0];
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-red-600 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md border border-blue-200 animate-fadeIn">
        
        {/* Logo a nadpis */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
            <Flame className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">HC Litvínov</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-1">Hokejové Kartičky</h2>
          <div className="flex items-center justify-center gap-1 text-green-600 text-sm mt-2">
            <Shield size={16} />
            <span>Zabezpečené přihlášení</span>
          </div>
        </div>

        {/* Success alert */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-green-600" size={20} />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* Error alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 animate-shake">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Čekání na magic link */}
        {waitingForLink && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2">
              <Mail className="text-blue-600 animate-pulse" size={20} />
              <div>
                <p className="text-blue-700 text-sm font-semibold">Čekáme na potvrzení...</p>
                <p className="text-blue-600 text-xs mt-1">
                  Zkontrolujte email {emailForSignIn} a klikněte na přihlašovací odkaz
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setWaitingForLink(false);
                window.localStorage.removeItem('emailForSignIn');
                setEmailForSignIn('');
              }}
              className="text-blue-600 hover:text-blue-700 text-xs underline mt-2"
            >
              Zrušit čekání
            </button>
          </div>
        )}

        {/* Navigation tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-2xl p-1">
          <button
            onClick={() => {
              setMode('login');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
              mode === 'login'
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Přihlášení
          </button>
          <button
            onClick={() => {
              setMode('register');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
              mode === 'register'
                ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Registrace
          </button>
          <button
            onClick={() => {
              setMode('magicLink');
              setError('');
              setSuccess('');
            }}
            className={`flex-1 py-2 px-3 rounded-xl font-semibold transition-all duration-300 text-sm ${
              mode === 'magicLink'
                ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              <Sparkles size={14} />
              <span>Bez hesla</span>
            </div>
          </button>
        </div>

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleEmailPasswordAuth} className="space-y-4 mb-6">
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Heslo"
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              type="button"
              onClick={() => setMode('forgotPassword')}
              className="text-blue-600 hover:text-blue-700 text-sm underline"
            >
              Zapomněli jste heslo?
            </button>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-2xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <>
                  <LogIn size={20} />
                  Přihlásit se
                </>
              )}
            </button>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleEmailPasswordAuth} className="space-y-4 mb-6">
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Heslo (min. 8 znaků)"
                required
                minLength={8}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Síla hesla */}
            {password && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.level / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 min-w-[80px]">
                    {passwordStrength.text}
                  </span>
                </div>
              </div>
            )}

            {/* Potvrzení hesla */}
            <div className="relative group">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Potvrďte heslo"
                required
                minLength={8}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-500 text-xs mt-1 ml-3">Hesla se neshodují</p>
              )}
              {confirmPassword && password === confirmPassword && confirmPassword.length >= 8 && (
                <p className="text-green-500 text-xs mt-1 ml-3">✓ Hesla se shodují</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password || password !== confirmPassword}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-2xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <>
                  <UserPlus size={20} />
                  Registrovat se
                </>
              )}
            </button>
          </form>
        )}

        {/* MAGIC LINK FORM */}
        {mode === 'magicLink' && (
          <form onSubmit={handleMagicLinkRequest} className="space-y-4 mb-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                Přihlášení bez hesla
              </h3>
              <p className="text-sm text-gray-600">
                Pošleme vám přihlašovací odkaz na email
              </p>
            </div>

            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Váš email"
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <>
                  <Send size={20} />
                  Poslat přihlašovací odkaz
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-gray-500 hover:text-gray-700 text-sm underline flex items-center justify-center gap-1"
            >
              <ArrowLeft size={14} />
              Zpět na klasické přihlášení
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgotPassword' && (
          <form onSubmit={handlePasswordReset} className="space-y-4 mb-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <HelpCircle className="text-white" size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                Zapomenuté heslo
              </h3>
              <p className="text-sm text-gray-600">
                Pošleme vám odkaz pro reset hesla
              </p>
            </div>

            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Váš email"
                required
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-2xl font-semibold hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <Loader className="animate-spin" size={20} />
              ) : (
                <>
                  <Send size={20} />
                  Obnovit heslo
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-gray-500 hover:text-gray-700 text-sm underline flex items-center justify-center gap-1"
            >
              <ArrowLeft size={14} />
              Zpět na přihlášení
            </button>
          </form>
        )}

        {/* Divider (pouze pro login a register) */}
        {(mode === 'login' || mode === 'register') && (
          <>
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">nebo</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-2xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Připojuji...' : 'Přihlásit se přes Google'}
            </button>
          </>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Vytvořeno s ❤️ pro fanoušky HC Litvínov
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Next.js 15 + Firebase + Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}