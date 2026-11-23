'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBookings, cancelBooking, deleteBooking } from '@/lib/booking';
import { getStoredUser } from '@/lib/auth';
import { Booking, User } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { SafeImage } from '@/components/SafeImage';
import { Lock, ArrowRight, CheckCircle2, Trash2, Calendar, Users } from 'lucide-react';

export default function MyBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const loadData = () => {
    const u = getStoredUser();
    setUser(u);
    if (u) {
      setBookings(getBookings());
    } else {
      setBookings([]);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener('aerora_booking_change', handleUpdate);
    window.addEventListener('aerora_auth_change', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('aerora_booking_change', handleUpdate);
      window.removeEventListener('aerora_auth_change', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleCancel = (id: string) => {
    if (confirm('Batalkan pesanan ini?')) {
      cancelBooking(id);
      setNotification('Pesanan berhasil dibatalkan.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus riwayat pesanan ini?')) {
      deleteBooking(id);
      setNotification('Riwayat pesanan dihapus.');
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d1d1f]"></div>
      </div>
    );
  }

  // 1. GATE: If user is not logged in, block access and show Apple Login Gate
  if (!user?.isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-black/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.04)] text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center mx-auto text-[#1d1d1f]">
            <Lock className="w-5 h-5" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
              Akses Dibatasi
            </h1>
            <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
              Halaman ini memuat riwayat reservasi pribadi. Silakan masuk dengan akun Anda untuk melihat pesanan.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/login?redirect=/my-booking"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full text-xs font-medium bg-[#0071e3] text-white hover:bg-[#0077ed] transition-colors"
            >
              <span>Masuk dengan Akun Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. LOGGED-IN: Show user's bookings
  return (
    <div className="min-h-screen py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 animate-apple-fade-up opacity-0">
          <div>
            <p className="text-xs uppercase tracking-wider font-semibold text-[#86868b] mb-1">
              Akun: {user.name}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
              Pesanan Saya
            </h1>
          </div>

          <Link
            href="/rooms"
            className="text-xs font-medium text-[#0071e3] hover:underline self-start sm:self-auto"
          >
            Pesan Kamar Lainnya →
          </Link>
        </div>

        {notification && (
          <div className="mb-6 p-3 rounded-2xl bg-emerald-50 text-emerald-700 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking, idx) => {
              const isCancelled = booking.status === 'Cancelled';

              return (
                <div
                  key={booking.id}
                  className={`bg-white rounded-2xl p-6 border transition-all animate-apple-fade-up ${
                    isCancelled
                      ? 'border-black/[0.04]'
                      : 'border-black/[0.06] hover:border-black/[0.12]'
                  }`}
                  style={{
                    animationDelay: `${100 + idx * 80}ms`,
                    animationFillMode: 'forwards',
                    opacity: 0,
                    ...(isCancelled ? { filter: 'opacity(0.6)' } : {}),
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="w-24 h-18 rounded-xl overflow-hidden bg-[#f5f5f7] shrink-0">
                        <SafeImage
                          src={booking.roomImage}
                          alt={booking.roomName}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-[#86868b]">{booking.id}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                              isCancelled
                                ? 'bg-red-50 text-red-600'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {isCancelled ? 'Dibatalkan' : 'Terkonfirmasi'}
                          </span>
                        </div>

                        <h3 className="text-base font-semibold text-[#1d1d1f]">
                          {booking.roomName}
                        </h3>

                        <div className="text-[#86868b] flex items-center gap-2">
                          <span>{formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}</span>
                          <span>•</span>
                          <span>{booking.nights} Malam</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between pt-3 sm:pt-0 border-t sm:border-t-0 border-black/[0.04] gap-3">
                      <div className="text-sm font-semibold text-[#1d1d1f]">
                        {formatCurrency(booking.totalPrice)}
                      </div>

                      <div className="flex items-center gap-2">
                        {!isCancelled && (
                          <button
                            onClick={() => handleCancel(booking.id)}
                            className="text-xs text-red-600 hover:underline cursor-pointer"
                          >
                            Batalkan
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(booking.id)}
                          title="Hapus riwayat"
                          className="p-1 text-[#86868b] hover:text-[#1d1d1f] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-black/[0.06] max-w-md mx-auto my-12 space-y-4">
            <h3 className="text-base font-semibold text-[#1d1d1f]">
              Belum Ada Reservasi
            </h3>
            <p className="text-xs text-[#86868b]">
              Kamar yang Anda pesan akan muncul di sini setelah konfirmasi.
            </p>
            <Link
              href="/rooms"
              className="inline-block px-5 py-2 rounded-full text-xs font-medium bg-[#1d1d1f] text-white hover:bg-[#333336] transition-colors"
            >
              Lihat Kamar Tersedia
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
