'use client';

import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, AlertTriangle, CheckCircle, Info, 
  Trash2, User, Database, LogOut, Loader, Lock, Shield
} from 'lucide-react';
import { completeAccountReset, softResetAccount, getAccountInfo } from '@/lib/resetUserAccount';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

// 🔐 ADMIN KONFIGURACE
const ADMIN_CONFIG = {
  // Nastavte silné heslo nebo použijte environment proměnnou
  PASSWORD: process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'SuperTajneHeslo2024!@#$',
  
  // Seznam povolených emailů pro reset
  ALLOWED_EMAILS: [
    'ahclitvinov@seznam.cz',
    // Přidejte další testovací emaily
  ],
  
  // Povolit pouze v development módu
  PRODUCTION_ENABLED: false // Změňte na true pouze pokud OPRAVDU víte co děláte
};

export default function SecureTestResetPage() {
  const { user } = useAuth();
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('ahclitvinov@seznam.cz');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);
  const [resetType, setResetType] = useState('soft');

  // Kontrola prostředí
  useEffect(() => {
    // V produkci zkontrolovat, jestli je funkce povolena
    if (process.env.NODE_ENV === 'production' && !ADMIN_CONFIG.PRODUCTION_ENABLED) {
      setResult({
        type: 'error',
        message: 'Tato stránka není dostupná v produkčním prostředí!'
      });
    }
  }, []);

  // Admin autentizace
  const handleAdminAuth = (e) => {
    e.preventDefault();
    
    if (adminPassword === ADMIN_CONFIG.PASSWORD) {
      setIsAuthenticated(true);
      setResult({
        type: 'success',
        message: 'Administrátorský přístup povolen'
      });
      
      // Uložit do sessionStorage (ne localStorage pro bezpečnost)
      sessionStorage.setItem('adminAuth', 'true');
    } else {
      setResult({
        type: 'error',
        message: 'Nesprávné administrátorské heslo!'
      });
    }
  };

  // Kontrola session při načtení
  useEffect(() => {
    const isAdminAuth = sessionStorage.getItem('adminAuth');
    if (isAdminAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Zkontrolovat info o účtu
  const checkAccount = async () => {
    if (!ADMIN_CONFIG.ALLOWED_EMAILS.includes(email)) {
      setResult({
        type: 'error',
        message: 'Tento email není povolen pro reset!'
      });
      return;
    }

    setLoading(true);
    try {
      const info = await getAccountInfo(email);
      setAccountInfo(info);
      setResult({
        type: 'info',
        message: info.exists ? 'Účet nalezen' : 'Účet neexistuje nebo není přihlášen'
      });
    } catch (error) {
      setResult({
        type: 'error',
        message: error.message
      });
    }
    setLoading(false);
  };

  // Kompletní reset
  const handleCompleteReset = async () => {
    if (!ADMIN_CONFIG.ALLOWED_EMAILS.includes(email)) {
      setResult({
        type: 'error',
        message: 'Tento email není povolen pro reset!'
      });
      return;
    }

    if (!password) {
      setResult({
        type: 'error',
        message: 'Zadejte heslo účtu pro ověření'
      });
      return;
    }

    if (!window.confirm(`⚠️ VAROVÁNÍ: Kompletní smazání účtu ${email}!\n\nOpravdu pokračovat?`)) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await completeAccountReset(email, password);
      
      if (response.success) {
        setResult({
          type: 'success',
          message: response.message
        });
        setAccountInfo(null);
        setPassword('');
        
        // Zalogovat akci
        console.log(`[ADMIN RESET] Účet ${email} byl kompletně smazán`);
      } else {
        setResult({
          type: 'error',
          message: response.error || 'Reset selhal'
        });
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: error.message
      });
    }

    setLoading(false);
  };

  // Soft reset
  const handleSoftReset = async () => {
    if (!ADMIN_CONFIG.ALLOWED_EMAILS.includes(email)) {
      setResult({
        type: 'error',
        message: 'Tento email není povolen pro reset!'
      });
      return;
    }

    if (!user || user.email !== email) {
      setResult({
        type: 'error',
        message: 'Musíte být přihlášeni jako ' + email
      });
      return;
    }

    if (!window.confirm(`Resetovat data účtu ${email} na výchozí hodnoty?`)) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await softResetAccount(user.uid);
      
      if (response.success) {
        setResult({
          type: 'success',
          message: 'Data byla resetována na výchozí hodnoty'
        });
        
        // Zalogovat akci
        console.log(`[ADMIN RESET] Data účtu ${email} byla resetována`);
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setResult({
          type: 'error',
          message: response.error || 'Reset selhal'
        });
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: error.message
      });
    }

    setLoading(false);
  };

  // Pokud není v produkci povoleno
  if (process.env.NODE_ENV === 'production' && !ADMIN_CONFIG.PRODUCTION_ENABLED) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <div className="bg-red-600 text-white rounded-xl p-8 max-w-md">
          <AlertTriangle size={48} className="mb-4" />
          <h1 className="text-2xl font-bold mb-2">Přístup odepřen</h1>
          <p>Tato stránka není dostupná v produkčním prostředí.</p>
        </div>
      </div>
    );
  }

  // Admin login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <Shield className="text-white" size={32} />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center mb-2">Administrátorský přístup</h1>
          <p className="text-gray-600 text-center mb-6">
            Pro přístup k reset funkcím zadejte admin heslo
          </p>

          <form onSubmit={handleAdminAuth}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                <Lock size={16} className="inline mr-2" />
                Admin heslo:
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Zadejte administrátorské heslo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                autoFocus
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <Lock size={20} />
              Přihlásit se
            </button>
          </form>

          {result && result.type === 'error' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{result.message}</p>
            </div>
          )}

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-700 text-xs">
              <strong>Poznámka:</strong> Pokud jste zapomněli heslo, zkontrolujte environment proměnnou NEXT_PUBLIC_ADMIN_PASSWORD nebo konfiguraci v kódu.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main reset interface (po přihlášení)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Admin header */}
        <div className="bg-green-600 text-white rounded-t-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={24} />
            <span className="font-bold">ADMIN REŽIM</span>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem('adminAuth');
              setIsAuthenticated(false);
              setAdminPassword('');
            }}
            className="px-3 py-1 bg-red-600 rounded hover:bg-red-700 flex items-center gap-2"
          >
            <LogOut size={16} />
            Odhlásit admin
          </button>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-b-xl shadow-2xl p-8">
          {/* Warning */}
          <div className="bg-red-50 border-2 border-red-400 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-red-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-red-800">ADMINISTRÁTORSKÝ RESET</h3>
                <p className="text-red-700 text-sm mt-1">
                  Všechny akce jsou logovány. Reset je NEVRATNÝ!
                </p>
              </div>
            </div>
          </div>

          {/* Allowed emails info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-blue-800 mb-2">Povolené emaily:</h3>
            <ul className="list-disc list-inside text-blue-700 text-sm">
              {ADMIN_CONFIG.ALLOWED_EMAILS.map(email => (
                <li key={email}>{email}</li>
              ))}
            </ul>
          </div>

          {/* Email selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">
              Email účtu pro reset:
            </label>
            <select
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              {ADMIN_CONFIG.ALLOWED_EMAILS.map(email => (
                <option key={email} value={email}>{email}</option>
              ))}
            </select>
          </div>

          {/* Account info */}
          {user && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">
                Aktuálně přihlášen: <strong>{user.email}</strong>
              </p>
              {user.email !== email && (
                <p className="text-yellow-600 text-sm mt-1">
                  ⚠️ Pro soft reset se musíte přihlásit jako {email}
                </p>
              )}
            </div>
          )}

          {/* Reset type */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Typ resetu:</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setResetType('soft')}
                className={`p-4 border-2 rounded-lg ${
                  resetType === 'soft' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                }`}
              >
                <Database className="text-blue-600 mb-2" size={24} />
                <div className="font-bold">Soft Reset</div>
                <div className="text-xs text-gray-600">Zachová účet</div>
              </button>
              
              <button
                onClick={() => setResetType('complete')}
                className={`p-4 border-2 rounded-lg ${
                  resetType === 'complete' ? 'border-red-600 bg-red-50' : 'border-gray-300'
                }`}
              >
                <Trash2 className="text-red-600 mb-2" size={24} />
                <div className="font-bold">Kompletní</div>
                <div className="text-xs text-gray-600">Smaže účet</div>
              </button>
            </div>
          </div>

          {/* Password for complete reset */}
          {resetType === 'complete' && (
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">
                Heslo účtu (pro ověření):
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Heslo účtu který chcete smazat"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-4">
            <button
              onClick={checkAccount}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
            >
              <Info size={20} className="inline mr-2" />
              Info o účtu
            </button>
            
            {resetType === 'soft' ? (
              <button
                onClick={handleSoftReset}
                disabled={loading || !user || user.email !== email}
                className="flex-1 px-6 py-3 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="animate-spin inline" size={20} />
                ) : (
                  <>
                    <RefreshCw size={20} className="inline mr-2" />
                    Soft Reset
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleCompleteReset}
                disabled={loading || !password}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? (
                  <Loader className="animate-spin inline" size={20} />
                ) : (
                  <>
                    <Trash2 size={20} className="inline mr-2" />
                    Smazat účet
                  </>
                )}
              </button>
            )}
          </div>

          {/* Result */}
          {result && (
            <div className={`mt-6 p-4 rounded-lg ${
              result.type === 'success' ? 'bg-green-50 border border-green-200' :
              result.type === 'error' ? 'bg-red-50 border border-red-200' :
              'bg-blue-50 border border-blue-200'
            }`}>
              <p className={
                result.type === 'success' ? 'text-green-700' :
                result.type === 'error' ? 'text-red-700' :
                'text-blue-700'
              }>
                {result.message}
              </p>
            </div>
          )}

          {/* Account info display */}
          {accountInfo && accountInfo.profile && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold mb-2">Informace o účtu:</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Jméno: {accountInfo.profile.displayName}</div>
                <div>Level: {accountInfo.profile.level}</div>
                <div>XP: {accountInfo.profile.xp}</div>
                <div>Kredity: {accountInfo.profile.credits}</div>
                <div>Karty: {accountInfo.profile.collectedCards?.length || 0}</div>
                <div>Email ověřen: {accountInfo.emailVerified ? 'Ano' : 'Ne'}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}