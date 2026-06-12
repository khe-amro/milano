'use client';

import React, { useState, useEffect, startTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Mail, Lock, LogIn, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Get path to redirect after successful authentication
  const nextPath = searchParams.get('next') || '/dashboard';

  // Check if user is already logged in
  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push(nextPath);
      }
    }
    checkAuth();
  }, [supabase, router, nextPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isSignUp) {
        // Sign Up Flow
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          // Claim the restaurant ownership if it is currently unowned
          await claimRestaurantIfUnowned(data.user.id);
          setSuccessMsg('Inscription réussie ! Vous allez être redirigé vers le tableau de bord.');
          setTimeout(() => {
            startTransition(() => {
              router.push(nextPath);
              router.refresh();
            });
          }, 1500);
        }
      } else {
        // Sign In Flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          // Claim the restaurant ownership if it is currently unowned
          await claimRestaurantIfUnowned(data.user.id);
          setSuccessMsg('Connexion réussie !');
          setTimeout(() => {
            startTransition(() => {
              router.push(nextPath);
              router.refresh();
            });
          }, 1000);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue.');
      setLoading(false);
    }
  };

  const claimRestaurantIfUnowned = async (userId: string) => {
    try {
      // Find the seeded restaurant
      const { data: restaurant } = await supabase
        .from('restaurants')
        .select('id, owner_id')
        .eq('slug', 'milano-bellaka')
        .single();

      if (restaurant && !restaurant.owner_id) {
        // Associate this user as the owner
        await supabase
          .from('restaurants')
          .update({ owner_id: userId })
          .eq('id', restaurant.id);
        console.log('Successfully associated user with restaurant owner_id');
      }
    } catch (e) {
      console.error('Error claiming restaurant ownership:', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Centered Restaurant Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-24 h-24 rounded-full border-4 border-[#C0392B] bg-[#1A1A1A] overflow-hidden shadow-lg shadow-[#C0392B]/10 mb-3">
            <Image
              src="/images/logo.png"
              alt="Milano Bellaka Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <h1 className="text-xl font-black text-white tracking-wider">
            MILANO BELLAKA 2005
          </h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            Espace Propriétaire / Dashboard
          </p>
        </div>

        {/* Login/Signup Card */}
        <div className="bg-[#1A1A1A] rounded-2xl border border-[#2d2d2d] shadow-xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-white mb-6">
            {isSignUp ? "Créer un compte administrateur" : "Se connecter"}
          </h2>

          {/* Success / Error Messages */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/40 border border-red-900/50 rounded-lg text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Adresse Email
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 text-gray-500 w-4 h-4" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@milano.com"
                  className="w-full py-2.5 pl-10 pr-4 bg-[#111111] text-white border border-[#2d2d2d] rounded-lg text-sm focus:outline-none focus:border-[#C0392B] placeholder-gray-600 transition-all duration-300"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                Mot de Passe
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 text-gray-500 w-4 h-4" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-2.5 pl-10 pr-4 bg-[#111111] text-white border border-[#2d2d2d] rounded-lg text-sm focus:outline-none focus:border-[#C0392B] placeholder-gray-600 transition-all duration-300"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 mt-2 bg-[#C0392B] text-white font-bold rounded-lg text-sm hover:bg-[#a3281a] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  Créer le compte
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          {/* Toggle login mode */}
          <div className="mt-6 pt-4 border-t border-[#2d2d2d] text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-xs text-[#C0392B] hover:text-[#a3281a] transition-colors duration-200"
            >
              {isSignUp
                ? "Vous avez déjà un compte ? Connectez-vous"
                : "Première visite ? Créez un compte administrateur"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-[#C0392B] border-t-transparent rounded-full animate-spin"></span>
      </div>
    }>
      <LoginForm />
    </React.Suspense>
  );
}
