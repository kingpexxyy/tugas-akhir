'use client';

import { User } from './types';

const AUTH_STORAGE_KEY = 'aerora_auth_user';

export const DEMO_CREDENTIALS = {
  email: 'guest@aerora.demo',
  password: 'aerora123',
  name: 'Aero Guest',
};

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as User;
    return parsed?.isAuthenticated ? parsed : null;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return getStoredUser() !== null;
}

export function loginUser(email: string, pass: string): { success: boolean; message: string; user?: User } {
  if (typeof window === 'undefined') {
    return { success: false, message: 'Lingkungan browser dibutuhkan.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  if (!cleanEmail || !cleanPass) {
    return { success: false, message: 'Silakan isi email dan kata sandi.' };
  }

  if (cleanEmail === DEMO_CREDENTIALS.email.toLowerCase() && cleanPass === DEMO_CREDENTIALS.password) {
    const user: User = {
      email: DEMO_CREDENTIALS.email,
      name: DEMO_CREDENTIALS.name,
      isAuthenticated: true,
    };
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      window.dispatchEvent(new Event('aerora_auth_change'));
    } catch {
      // ignore
    }
    return { success: true, message: 'Berhasil masuk.', user };
  }

  return {
    success: false,
    message: 'Kredensial tidak cocok. Gunakan akun demo yang tersedia.',
  };
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    window.dispatchEvent(new Event('aerora_auth_change'));
  } catch {
    // ignore
  }
}
