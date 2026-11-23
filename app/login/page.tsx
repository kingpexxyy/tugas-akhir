'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { loginUser, getStoredUser, logoutUser, DEMO_CREDENTIALS } from '@/lib/auth';
import { User } from '@/lib/types';
import { ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (user?.isAuthenticated) {
      setCurrentUser(user);
    }
  }, []);

  const handleFillDemo = () => {
    setEmail(DEMO_CREDENTIALS.email);
    setPassword(DEMO_CREDENTIALS.password);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const res = loginUser(email, password);
    if (res.success && res.user) {
      setSuccess('Berhasil masuk.');
      setCurrentUser(res.user);
      setTimeout(() => {
        router.push(redirectUrl);
      }, 400);
    } else {
      setError(res.message);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setSuccess(null);
    setError(null);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 bg-[#fbfbfd]">
      <div className="w-full max-w-sm space-y-6 animate-apple-fade-up opacity-0">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
            {currentUser?.isAuthenticated ? 'Sesi Aktif' : 'Masuk ke AERORA'}
          </h1>
          <p className="text-xs text-[#86868b]">
            {currentUser?.isAuthenticated
              ? 'Anda saat ini telah terotentikasi.'
              : 'Gunakan akun demo untuk mengakses seluruh fitur reservasi.'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.03)] space-y-5">
          {currentUser?.isAuthenticated ? (
            <div className="space-y-5 text-center">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>

              <div>
                <div className="text-sm font-semibold text-[#1d1d1f]">{currentUser.name}</div>
                <div className="text-xs text-[#86868b]">{currentUser.email}</div>
              </div>

              <div className="space-y-2 pt-2">
                <Link
                  href={redirectUrl !== '/login' ? redirectUrl : '/rooms'}
                  className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-full text-xs font-medium bg-[#0071e3] text-white hover:bg-[#0077ed] transition-colors"
                >
                  Lanjutkan ke Halaman
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 rounded-full text-xs font-medium text-[#86868b] hover:text-red-600 transition-colors cursor-pointer"
                >
                  Keluar dari Akun
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs">
                  {success}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-medium text-[#86868b] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="guest@aerora.demo"
                  required
                  className="w-full bg-[#f5f5f7] border border-black/[0.04] focus:bg-white text-xs text-[#1d1d1f] px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#0071e3] transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#86868b] mb-1">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="aerora123"
                  required
                  className="w-full bg-[#f5f5f7] border border-black/[0.04] focus:bg-white text-xs text-[#1d1d1f] px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-[#0071e3] transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-full text-xs font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] transition-colors cursor-pointer"
              >
                Masuk
              </button>

              {/* Minimalist Demo Account Pill */}
              <div className="pt-3 border-t border-black/[0.06] text-center">
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="text-xs text-[#0071e3] hover:underline cursor-pointer"
                >
                  Gunakan Akun Demo Otomatis
                </button>
                <div className="text-[11px] text-[#86868b] mt-1 font-mono">
                  guest@aerora.demo / aerora123
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d1d1f]"></div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
