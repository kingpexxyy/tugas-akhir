'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getStoredUser, logoutUser } from '@/lib/auth';
import { User } from '@/lib/types';
import { Menu, X, Lock, LogOut, User as UserIcon } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUser(getStoredUser());

    const handleAuthChange = () => {
      setUser(getStoredUser());
    };

    window.addEventListener('aerora_auth_change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('aerora_auth_change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setMobileMenuOpen(false);
    router.push('/login');
  };

  const navLinks = [
    { label: 'Beranda', href: '/', requiresAuth: false },
    { label: 'Kamar', href: '/rooms', requiresAuth: false },
    { label: 'Fasilitas', href: '/facilities', requiresAuth: false },
    { label: 'Reservasi', href: '/booking', requiresAuth: true },
    { label: 'Pesanan Saya', href: '/my-booking', requiresAuth: true },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full apple-glass border-b border-black/[0.06] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Brand Logo - Apple Clean Style */}
          <Link
            href="/"
            className="text-base font-semibold tracking-tight text-[#1d1d1f] hover:opacity-70 transition-opacity"
          >
            AERORA
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const isLocked = link.requiresAuth && mounted && !user;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs tracking-normal font-normal transition-colors flex items-center gap-1.5 ${
                    active
                      ? 'text-[#0071e3] font-medium'
                      : 'text-[#1d1d1f]/80 hover:text-[#1d1d1f]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isLocked && (
                    <Lock
                      className="w-3 h-3 text-[#86868b]"
                      strokeWidth={1.8}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {mounted && user ? (
              <div className="flex items-center gap-3">
                <span className="text-xs text-[#1d1d1f] font-normal">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  title="Keluar"
                  className="apple-btn text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors cursor-pointer"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="apple-btn text-xs font-normal text-[#0071e3] hover:text-[#0077ed] transition-colors"
              >
                Masuk
              </Link>
            )}

            <Link
              href={user ? '/booking' : '/login?redirect=/booking'}
              className="apple-btn text-xs font-normal px-3.5 py-1.5 rounded-full bg-[#1d1d1f] text-white hover:bg-[#333336] transition-colors shadow-sm"
            >
              Pesan Kamar
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#1d1d1f] hover:opacity-70 transition-opacity focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/[0.06] bg-white/95 backdrop-blur-xl px-6 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              const isLocked = link.requiresAuth && mounted && !user;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm py-1.5 flex items-center justify-between ${
                    active ? 'text-[#0071e3] font-medium' : 'text-[#1d1d1f]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isLocked && <Lock className="w-3.5 h-3.5 text-[#86868b]" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
            {mounted && user ? (
              <>
                <span className="text-xs text-[#86868b]">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-red-600 font-medium cursor-pointer"
                >
                  Keluar
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-medium rounded-full bg-[#1d1d1f] text-white"
              >
                Masuk ke Akun Demo
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
