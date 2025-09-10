'use client';

import React, { useState } from 'react';
import { 
  RefreshCw, AlertTriangle, CheckCircle, Info, 
  Trash2, User, Database, LogOut, Loader
} from 'lucide-react';
import { completeAccountReset, softResetAccount, getAccountInfo } from '@/lib/resetUserAccount';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function TestResetPage() {
  const { user } = useAuth();
  const [email, setEmail] = useState('ahclitvinov@seznam.cz');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);
  const [resetType, setResetType] = useState('complete');

  // Zkontrolovat info o účtu
  const checkAccount = async () => {
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

  // Kompletní reset (smaže účet úplně)
  const handleCompleteReset = async () => {
    if (!password) {
      setResult({
        type: 'error',
        message: 'Zadejte heslo pro ověření'
      });
      return;
    }

    if (!window.confirm('⚠️ VAROVÁNÍ: Tato akce SMAŽE CELÝ ÚČET!\n\nÚčet bude kompletně odstraněn a budete se muset znovu zaregistrovat.\n\nOpravdu chcete pokračovat?')) {
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
        
        // Po 3 sekundách přesměrovat na registraci
        setTimeout(() => {
          window.location.href = '/auth';
        }, 3000);
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

  // Soft reset (zachová účet, resetuje data)
  const handleSoftReset = async () => {
    if (!user || user.email !== email) {
      setResult({
        type: 'error',
        message: 'Musíte být přihlášeni jako ' + email
      });
      return;
    }

    if (!window.confirm('Tato akce resetuje všechna herní data na výchozí hodnoty.\n\nÚčet zůstane zachován.\n\nPokračovat?')) {
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
        
        // Reload stránky pro načtení nových dat
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-red-600 text-white rounded-t-xl p-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <AlertTriangle size={32} />
            Testovací Reset Účtu
          </h1>
          <p className="mt-2 opacity-90">
            Pouze pro vývojové testování - NEPOUŽÍVAT v produkci!
          </p>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-b-xl shadow-2xl p-8">
          {/* Warning */}
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 flex-shrink-0" size={24} />
              <div>
                <h3 className="font-bold text-yellow-800">POZOR!</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  Tato stránka je určena pouze pro testování. Reset účtu je NEVRATNÁ operace!
                </p>
              </div>
            </div>
          </div>

          {/* Account info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User size={20} />
              Informace o účtu
            </h2>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-mono font-bold">{email}</span>
              </div>
              
              {user && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Aktuálně přihlášen:</span>
                    <span className="font-mono">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">UID:</span>
                    <span className="font-mono text-xs">{user.uid}</span>
                  </div>
                </>
              )}
              
              {accountInfo && accountInfo.profile && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Jméno:</span>
                    <span>{accountInfo.profile.displayName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Level:</span>
                    <span>{accountInfo.profile.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Kredity:</span>
                    <span>{accountInfo.profile.credits}</span>
                  </div>
                </>
              )}
            </div>
            
            <button
              onClick={checkAccount}
              disabled={loading}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Info size={16} />
              Zkontrolovat účet
            </button>
          </div>

          {/* Reset type selection */}
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Typ resetu:</h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                     style={{ borderColor: resetType === 'complete' ? '#dc2626' : '#e5e7eb' }}>
                <input
                  type="radio"
                  value="complete"
                  checked={resetType === 'complete'}
                  onChange={(e) => setResetType(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-bold text-red-600 flex items-center gap-2">
                    <Trash2 size={18} />
                    Kompletní reset (smaže účet)
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Úplně smaže účet z Firebase Authentication. Budete se muset znovu zaregistrovat.
                  </p>
                </div>
              </label>
              
              <label className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                     style={{ borderColor: resetType === 'soft' ? '#3b82f6' : '#e5e7eb' }}>
                <input
                  type="radio"
                  value="soft"
                  checked={resetType === 'soft'}
                  onChange={(e) => setResetType(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-bold text-blue-600 flex items-center gap-2">
                    <Database size={18} />
                    Soft reset (zachová účet)
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Zachová účet ale resetuje všechna data (level, kredity, karty) na výchozí hodnoty.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Password input for complete reset */}
          {resetType === 'complete' && (
            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">
                Heslo (pro ověření):
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Zadejte heslo účtu"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-4">
            {resetType === 'complete' ? (
              <button
                onClick={handleCompleteReset}
                disabled={loading || !password}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <>
                    <Trash2 size={20} />
                    Kompletně smazat účet
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleSoftReset}
                disabled={loading || !user || user.email !== email}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader className="animate-spin" size={20} />
                ) : (
                  <>
                    <RefreshCw size={20} />
                    Resetovat data
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={() => signOut(auth)}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 flex items-center gap-2"
            >
              <LogOut size={20} />
              Odhlásit
            </button>
          </div>

          {/* Result message */}
          {result && (
            <div className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${
              result.type === 'success' ? 'bg-green-50 border border-green-200' :
              result.type === 'error' ? 'bg-red-50 border border-red-200' :
              'bg-blue-50 border border-blue-200'
            }`}>
              {result.type === 'success' && <CheckCircle className="text-green-600 flex-shrink-0" size={20} />}
              {result.type === 'error' && <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />}
              {result.type === 'info' && <Info className="text-blue-600 flex-shrink-0" size={20} />}
              <p className={`${
                result.type === 'success' ? 'text-green-700' :
                result.type === 'error' ? 'text-red-700' :
                'text-blue-700'
              }`}>
                {result.message}
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-bold text-gray-800 mb-3">📝 Návod:</h3>
            <ol className="space-y-2 text-sm text-gray-600">
              <li>1. Přihlaste se jako <strong>ahclitvinov@seznam.cz</strong></li>
              <li>2. Vyberte typ resetu (doporučuji začít soft resetem)</li>
              <li>3. Klikněte na tlačítko resetu</li>
              <li>4. Pro kompletní reset zadejte heslo účtu</li>
              <li>5. Po resetu se můžete znovu přihlásit/zaregistrovat</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}