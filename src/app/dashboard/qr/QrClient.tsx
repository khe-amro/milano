'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import { ArrowLeft, Download, Printer, Globe, ExternalLink, QrCode } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
}

interface QrClientProps {
  restaurant: Restaurant;
}

// Helper function to get local IP address for local network QR codes
function getLocalIp(): string {
  // Try to detect local IP from WebSocket or fetch attempt
  // Fallback to detecting from available network interfaces
  const getIpFromConnection = async () => {
    try {
      const response = await fetch('http://localhost:3000', { mode: 'no-cors' });
      return window.location.hostname;
    } catch {
      return window.location.hostname;
    }
  };

  // For now, use a simple approach: try to get from window.location
  // In production, the server could provide this via an API
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If it's localhost, we'll attempt to use the actual IP
    // This is a limitation - the browser can't directly access local IP
    // Best practice: make the server provide the IP address
    return hostname;
  }
  return 'localhost';
}

export default function QrClient({ restaurant }: QrClientProps) {
  const router = useRouter();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [menuUrl, setMenuUrl] = useState<string>('');

  useEffect(() => {
    // Generate URL: use IP address for local network, origin for production
    let url: string;
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      // Get local IP and use it instead of localhost so phones can scan
      const ip = window.location.hostname === 'localhost' ? getLocalIp() : window.location.hostname;
      url = `http://${ip}:${window.location.port || 3000}/menu/${restaurant.slug}`;
    } else {
      // Production: use full origin
      url = `${window.location.origin}/menu/${restaurant.slug}`;
    }
    setMenuUrl(url);

    // Generate QR code as Data URL
    QRCode.toDataURL(
      url,
      {
        width: 600,
        margin: 2,
        color: {
          dark: '#111111', // Black/dark charcoal for clear scanning contrast
          light: '#FFFFFF', // Clean white background
        },
      },
      (err, dataUrl) => {
        if (err) {
          console.error('Failed to generate QR code:', err);
          return;
        }
        setQrDataUrl(dataUrl);
      }
    );
  }, [restaurant]);

  // Handle high-resolution PNG download
  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${restaurant.slug}-menu-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger print-dialogue
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#E8E8E8] flex flex-col font-sans">
      {/* 1. Dashboard Navigation Header (Hidden on Print) */}
      <header className="print:hidden bg-[#1A1A1A] border-b border-[#2d2d2d] py-4 px-4 md:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au Tableau de Bord
          </button>
          
          <h1 className="text-sm font-black text-white tracking-widest uppercase">Générateur QR Code</h1>
        </div>
      </header>

      {/* 2. Main Content Grid (Hidden on Print, except the card itself) */}
      <div className="flex-grow max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8 items-start justify-center print:p-0 print:m-0 print:bg-white">
        
        {/* Control Panel (Hidden on Print) */}
        <div className="print:hidden w-full lg:w-96 bg-[#1A1A1A] border border-[#2d2d2d] rounded-2xl p-6 space-y-6 flex-shrink-0 shadow-lg">
          <div>
            <h2 className="text-base font-bold text-white mb-2">QR Code de votre restaurant</h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Ce code QR redirige les clients directement vers le menu digital de votre restaurant.
            </p>
          </div>

          {/* Target URL Info */}
          <div className="p-3.5 bg-[#111111] border border-[#2d2d2d] rounded-xl space-y-2">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Lien de destination</span>
            <div className="flex items-center justify-between gap-2">
              <a
                href={menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#C0392B] hover:text-[#a3281a] font-semibold break-all underline flex items-center gap-1"
              >
                {menuUrl}
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              </a>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5">
            <button
              onClick={handlePrint}
              className="w-full py-2.5 bg-[#C0392B] hover:bg-[#a3281a] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 active:scale-98 transition-all duration-200"
            >
              <Printer className="w-4 h-4" />
              Imprimer la carte de table
            </button>
            
            <button
              onClick={handleDownload}
              className="w-full py-2.5 bg-[#111111] hover:bg-[#202020] text-gray-300 hover:text-white border border-[#2d2d2d] text-xs font-bold rounded-lg flex items-center justify-center gap-2 active:scale-98 transition-all duration-200"
            >
              <Download className="w-4 h-4 text-[#C0392B]" />
              Télécharger le PNG
            </button>
          </div>

          <div className="border-t border-[#2d2d2d] pt-4 text-[11px] text-gray-500 leading-normal">
            <span className="font-bold text-gray-400">Astuce d&apos;impression :</span> Vous pouvez imprimer cette page directement. Le système masque automatiquement le panneau de contrôle et configure le format pour une impression sur papier A5 standard ou A4.
          </div>
        </div>

        {/* 3. Printable Table Card Frame */}
        <div className="w-full flex justify-center flex-grow print:w-full print:p-0 print:m-0">
          
          {/* Card Container (Styled white for printable ink saving) */}
          <div 
            id="printable-card" 
            className="w-[14.8cm] h-[21cm] bg-white text-black p-8 flex flex-col justify-between items-center text-center shadow-2xl relative select-none border-4 border-double border-[#C0392B] print:shadow-none print:border-[#C0392B] print:m-0 print:w-[14.8cm] print:h-[21cm]"
          >
            {/* Elegant corner flourishes */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#C0392B]"></div>
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#C0392B]"></div>
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#C0392B]"></div>
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#C0392B]"></div>

            {/* Header Content */}
            <div className="w-full flex flex-col items-center mt-3">
              {/* Circular Logo */}
              <div className="relative w-24 h-24 rounded-full border-2 border-[#C0392B] bg-white overflow-hidden shadow-md mb-2">
                <Image
                  src="/images/logo.png"
                  alt="Milano Bellaka Logo"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Red/Black Stripe Bar */}
              <div className="w-2/3 h-1 flex items-center justify-between mb-2">
                <div className="w-1/2 h-full bg-[#C0392B]"></div>
                <div className="w-1/2 h-full bg-black"></div>
              </div>

              {/* Calligraphy Header */}
              <div className="relative w-28 h-8 flex justify-center items-center opacity-90 my-1">
                <Image
                  src="/images/calligraphy_red.png"
                  alt="ميلانو"
                  width={110}
                  height={32}
                  className="object-contain"
                />
              </div>

              {/* Restaurant Name */}
              <h2 className="text-xl font-extrabold tracking-wider text-black mt-1">
                MILANO BELLAKA
              </h2>
              <p className="text-[9px] uppercase tracking-widest text-[#C0392B] font-bold mt-0.5">
                Pizzeria & Fast Food • Depuis 2005
              </p>
            </div>

            {/* QR Code Container */}
            <div className="relative my-4 flex flex-col items-center">
              <div className="p-3 bg-white border-2 border-[#C0392B] rounded-2xl shadow-sm">
                {qrDataUrl ? (
                  <div className="relative w-44 h-44">
                    <Image
                      src={qrDataUrl}
                      alt="QR Code"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-44 h-44 flex items-center justify-center bg-gray-100 rounded-lg">
                    <QrCode className="w-8 h-8 text-gray-400 animate-pulse" />
                  </div>
                )}
              </div>
              
              {/* Subtle visual guide scan frame */}
              <div className="absolute -inset-1.5 border border-[#C0392B]/20 rounded-3xl pointer-events-none"></div>
            </div>

            {/* Instruction Footer */}
            <div className="w-full mb-3">
              <h3 className="text-sm font-black text-[#C0392B] tracking-wide mb-1">
                SCANNEZ POUR VOIR LE MENU
              </h3>
              <p className="text-base font-black text-black font-sans leading-none tracking-normal" dir="rtl">
                امسح الرمز لعرض قائمة الطعام
              </p>
              
              <div className="w-24 h-[1px] bg-gray-200 mx-auto my-3"></div>
              
              <p className="text-[8px] text-gray-500 uppercase tracking-widest leading-none">
                Bilingual Digital Menu • Sans Contact
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
