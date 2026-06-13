'use client';

import React from 'react';
import Image from 'next/image';
import { WifiOff, RefreshCw } from 'lucide-react';

export default function OfflinePage() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#E8E8E8] flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full space-y-8 bg-[#1A1A1A] border border-[#2d2d2d] rounded-2xl p-8 shadow-xl">
        {/* Brand Logo */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 rounded-full border-4 border-[#C0392B] bg-[#111111] overflow-hidden shadow-lg shadow-[#C0392B]/10 mb-4">
            <Image
              src="/images/logo.png"
              alt="Milano Bellaka Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-xl font-black text-white tracking-widest uppercase">
            MILANO BELLAKA
          </h1>
        </div>

        {/* Offline Status */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-900/40 flex items-center justify-center text-[#C0392B] animate-pulse">
            <WifiOff className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">
              Vous êtes hors ligne
            </h2>
            <h2 className="text-lg font-bold text-gray-300 font-sans tracking-wide leading-none" dir="rtl">
              أنت غير متصل بالإنترنت
            </h2>
          </div>

          <div className="space-y-3 pt-2 text-xs md:text-sm text-gray-400 leading-relaxed">
            <p>
              Veuillez vérifier votre connexion internet. La carte se chargera automatiquement dès que vous serez reconnecté.
            </p>
            <p className="font-sans leading-relaxed text-right sm:text-center" dir="rtl">
              يرجى التحقق من اتصالك بالإنترنت. ستظهر القائمة عند استعادة الاتصال.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            onClick={handleRetry}
            className="w-full py-3 bg-[#C0392B] hover:bg-[#a3281a] text-white font-bold rounded-lg text-sm flex items-center justify-center gap-2 active:scale-98 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Réessayer / إعادة المحاولة
          </button>
        </div>
      </div>
    </div>
  );
}
