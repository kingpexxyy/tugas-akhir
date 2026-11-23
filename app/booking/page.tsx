'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ROOMS } from '@/lib/data';
import { Room, Booking, User } from '@/lib/types';
import { getStoredUser } from '@/lib/auth';
import { saveBooking } from '@/lib/booking';
import {
  formatCurrency,
  calculateNights,
  isValidDateRange,
  generateBookingId,
  formatDate,
  getTodayDateString,
  getTomorrowDateString,
} from '@/lib/utils';
import { SafeImage } from '@/components/SafeImage';
import { Lock, ArrowRight, CheckCircle2, ChevronLeft, Building } from 'lucide-react';

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryRoomId = searchParams.get('roomId') || '';
  const queryCheckIn = searchParams.get('checkIn') || getTodayDateString();
  const queryCheckOut = searchParams.get('checkOut') || getTomorrowDateString();
  const queryGuests = Number(searchParams.get('guests')) || 2;

  const [mounted, setMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Selected room
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(() => {
    return ROOMS.find((r) => r.id === queryRoomId) || ROOMS[0] || null;
  });

  // Form State
  const [checkIn, setCheckIn] = useState<string>(queryCheckIn);
  const [checkOut, setCheckOut] = useState<string>(queryCheckOut);
  const [guests, setGuests] = useState<number>(queryGuests);
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('+62 812-3456-7890');
  const [specialRequests, setSpecialRequests] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(true);

  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<Booking | null>(null);

  useEffect(() => {
    setMounted(true);
    const user = getStoredUser();
    setCurrentUser(user);
    if (user?.isAuthenticated) {
      setGuestName(user.name);
      setGuestEmail(user.email);
    }

    const handleAuthChange = () => {
      const u = getStoredUser();
      setCurrentUser(u);
      if (u?.isAuthenticated) {
        setGuestName(u.name);
        setGuestEmail(u.email);
      }
    };

    window.addEventListener('aerora_auth_change', handleAuthChange);
    return () => window.removeEventListener('aerora_auth_change', handleAuthChange);
  }, []);

  useEffect(() => {
    if (queryRoomId) {
      const found = ROOMS.find((r) => r.id === queryRoomId);
      if (found) setSelectedRoom(found);
    }
  }, [queryRoomId]);

  const nights = calculateNights(checkIn, checkOut);
  const nightlyRate = selectedRoom ? selectedRoom.price : 0;
  const subtotal = nightlyRate * nights;
  const taxesAndFees = Math.round(subtotal * 0.1);
  const totalPrice = subtotal + taxesAndFees;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Strict Auth Check: Must be logged in
    if (!currentUser?.isAuthenticated) {
      setFormError('Anda harus masuk terlebih dahulu untuk menyelesaikan reservasi.');
      return;
    }

    if (!selectedRoom) {
      setFormError('Silakan pilih kamar terlebih dahulu.');
      return;
    }

    if (!checkIn || !checkOut) {
      setFormError('Silakan tentukan tanggal menginap.');
      return;
    }

    if (!isValidDateRange(checkIn, checkOut)) {
      setFormError('Tanggal check-out harus setelah tanggal check-in.');
      return;
    }

    if (!guestName.trim()) {
      setFormError('Nama lengkap tamu wajib diisi.');
      return;
    }

    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      setFormError('Format alamat email tidak valid.');
      return;
    }

    if (!termsAccepted) {
      setFormError('Harap setujui syarat dan ketentuan reservasi.');
      return;
    }

    setIsSubmitting(true);

    const newBooking: Booking = {
      id: generateBookingId(),
      roomId: selectedRoom.id,
      roomName: selectedRoom.name,
      roomType: selectedRoom.type,
      roomImage: selectedRoom.image,
      roomPrice: selectedRoom.price,
      checkIn,
      checkOut,
      nights,
      guests,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim(),
      guestPhone: guestPhone.trim(),
      specialRequests: specialRequests.trim() || undefined,
      totalPrice,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };

    saveBooking(newBooking);

    setTimeout(() => {
      setIsSubmitting(false);
      setBookingSuccess(newBooking);
    }, 500);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d1d1f]"></div>
      </div>
    );
  }

  // 1. GATE: If user is not logged in, block booking and show Apple-style login gate
  if (!currentUser?.isAuthenticated) {
    const returnUrl = `/booking?roomId=${selectedRoom?.id || ''}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`;
    const loginLink = `/login?redirect=${encodeURIComponent(returnUrl)}`;

    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-black/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.04)] text-center space-y-6 animate-apple-fade-up">
          <div className="w-12 h-12 rounded-full bg-[#f5f5f7] flex items-center justify-center mx-auto text-[#1d1d1f]">
            <Lock className="w-5 h-5" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
              Masuk untuk Reservasi
            </h1>
            <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
              Untuk melakukan pemesanan kamar di AERORA, Anda perlu masuk ke akun terlebih dahulu.
            </p>
          </div>

          {selectedRoom && (
            <div className="bg-[#f5f5f7] rounded-2xl p-4 text-left flex items-center gap-3.5">
              <div className="w-16 h-12 rounded-xl overflow-hidden bg-white shrink-0">
                <SafeImage
                  src={selectedRoom.image}
                  alt={selectedRoom.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-[#86868b]">{selectedRoom.type}</div>
                <div className="text-sm font-medium text-[#1d1d1f] truncate">
                  {selectedRoom.name}
                </div>
                <div className="text-xs font-semibold text-[#0071e3]">
                  {formatCurrency(selectedRoom.price)} /malam
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Link
              href={loginLink}
              className="apple-btn w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-full text-xs font-medium bg-[#0071e3] text-white hover:bg-[#0077ed] transition-colors"
            >
              <span>Masuk dengan Akun Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/rooms"
              className="w-full inline-flex items-center justify-center text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors"
            >
              Kembali ke Katalog Kamar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. SUCCESS STATE
  if (bookingSuccess) {
    return (
      <div className="min-h-screen py-16 px-4 max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-black/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.04)] text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
              Reservasi Terkonfirmasi
            </h1>
            <p className="text-xs text-[#86868b]">
              Nomor Referensi: <strong className="font-mono text-[#1d1d1f]">{bookingSuccess.id}</strong>
            </p>
          </div>

          {/* Receipt card */}
          <div className="bg-[#f5f5f7] rounded-2xl p-5 text-left text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
              <div>
                <span className="font-semibold text-[#1d1d1f] text-sm block">{bookingSuccess.roomName}</span>
                <span className="text-[#86868b]">{bookingSuccess.nights} Malam • {bookingSuccess.guests} Tamu</span>
              </div>
              <span className="font-semibold text-sm text-[#1d1d1f]">{formatCurrency(bookingSuccess.totalPrice)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[#86868b] pt-1">
              <div>
                <span>Check-In: </span>
                <strong className="text-[#1d1d1f] block mt-0.5">{formatDate(bookingSuccess.checkIn)}</strong>
              </div>
              <div>
                <span>Check-Out: </span>
                <strong className="text-[#1d1d1f] block mt-0.5">{formatDate(bookingSuccess.checkOut)}</strong>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => router.push('/my-booking')}
              className="flex-1 py-2.5 px-6 rounded-full text-xs font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] transition-colors cursor-pointer"
            >
              Lihat di Pesanan Saya
            </button>
            <Link
              href="/rooms"
              className="flex-1 py-2.5 px-6 rounded-full text-xs font-medium text-[#1d1d1f] bg-[#f5f5f7] hover:bg-[#e5e5ea] text-center transition-colors"
            >
              Kembali ke Kamar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. LOGGED-IN: Render Booking Form
  return (
    <div className="min-h-screen py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-8">
        <Link
          href="/rooms"
          className="inline-flex items-center gap-1 text-xs text-[#86868b] hover:text-[#1d1d1f] mb-8 transition-colors animate-apple-fade-in opacity-0"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Kamar</span>
        </Link>

        <div className="mb-8 animate-apple-fade-up delay-100 opacity-0">
          <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            Reservasi Kamar
          </h1>
          <p className="text-xs text-[#86868b] mt-1">
            Lengkapi detail menginap Anda untuk mengonfirmasi pesanan.
          </p>
        </div>

        <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form */}
          <div className="lg:col-span-7 space-y-6 animate-apple-fade-up delay-200 opacity-0">
            {formError && (
              <div className="p-3 text-xs text-red-600 bg-red-50 rounded-xl border border-red-100">
                {formError}
              </div>
            )}

            {/* Date & Guests */}
            <div className="bg-white rounded-2xl p-6 border border-black/[0.06] space-y-4">
              <h2 className="text-sm font-semibold text-[#1d1d1f]">
                Jadwal Menginap
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#f5f5f7] rounded-xl p-3">
                  <label className="text-[10px] uppercase font-semibold text-[#86868b] block mb-1">
                    Check-In
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={getTodayDateString()}
                    onChange={(e) => setCheckIn(e.target.value)}
                    required
                    className="w-full bg-transparent text-xs text-[#1d1d1f] focus:outline-none cursor-pointer"
                  />
                </div>

                <div className="bg-[#f5f5f7] rounded-xl p-3">
                  <label className="text-[10px] uppercase font-semibold text-[#86868b] block mb-1">
                    Check-Out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || getTodayDateString()}
                    onChange={(e) => setCheckOut(e.target.value)}
                    required
                    className="w-full bg-transparent text-xs text-[#1d1d1f] focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="bg-[#f5f5f7] rounded-xl p-3">
                <label className="text-[10px] uppercase font-semibold text-[#86868b] block mb-1">
                  Jumlah Tamu
                </label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-transparent text-xs text-[#1d1d1f] focus:outline-none cursor-pointer"
                >
                  {selectedRoom &&
                    Array.from({ length: selectedRoom.capacity }, (_, i) => i + 1).map((num) => (
                      <option key={num} value={num}>
                        {num} Tamu
                      </option>
                    ))}
                </select>
              </div>

              <div className="text-[11px] text-[#86868b] pt-1 flex justify-between">
                <span>Durasi:</span>
                <span className="font-medium text-[#1d1d1f]">{nights} Malam</span>
              </div>
            </div>

            {/* Guest Details */}
            <div className="bg-white rounded-2xl p-6 border border-black/[0.06] space-y-4">
              <h2 className="text-sm font-semibold text-[#1d1d1f]">
                Informasi Tamu
              </h2>

              <div className="space-y-3">
                <div className="bg-[#f5f5f7] rounded-xl p-3">
                  <label className="text-[10px] uppercase font-semibold text-[#86868b] block mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    className="w-full bg-transparent text-xs text-[#1d1d1f] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#f5f5f7] rounded-xl p-3">
                    <label className="text-[10px] uppercase font-semibold text-[#86868b] block mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                      className="w-full bg-transparent text-xs text-[#1d1d1f] focus:outline-none"
                    />
                  </div>

                  <div className="bg-[#f5f5f7] rounded-xl p-3">
                    <label className="text-[10px] uppercase font-semibold text-[#86868b] block mb-1">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full bg-transparent text-xs text-[#1d1d1f] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="bg-[#f5f5f7] rounded-xl p-3">
                  <label className="text-[10px] uppercase font-semibold text-[#86868b] block mb-1">
                    Permintaan Khusus (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Contoh: check-in sore, kamar lantai atas..."
                    className="w-full bg-transparent text-xs text-[#1d1d1f] focus:outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-[#86868b] px-1 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded text-[#1d1d1f] focus:ring-0 cursor-pointer"
              />
              <span>Saya menyetujui kebijakan reservasi dan pembatalan AERORA Hotel.</span>
            </label>
          </div>

          {/* Right Summary */}
          <div className="lg:col-span-5 sticky top-20 animate-apple-fade-up delay-300 opacity-0">
            {selectedRoom && (
              <div className="bg-white rounded-2xl p-6 border border-black/[0.06] space-y-5">
                <h3 className="text-sm font-semibold text-[#1d1d1f]">
                  Ringkasan Pesanan
                </h3>

                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#f5f5f7]">
                  <SafeImage
                    src={selectedRoom.image}
                    alt={selectedRoom.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="text-xs text-[#86868b]">{selectedRoom.type}</div>
                  <h4 className="text-base font-semibold text-[#1d1d1f]">{selectedRoom.name}</h4>
                  <div className="text-xs text-[#86868b] mt-1">{selectedRoom.size} • {selectedRoom.bed}</div>
                </div>

                <div className="border-t border-black/[0.06] pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-[#86868b]">
                    <span>Tarif per malam:</span>
                    <span className="text-[#1d1d1f]">{formatCurrency(nightlyRate)}</span>
                  </div>
                  <div className="flex justify-between text-[#86868b]">
                    <span>{nights} Malam:</span>
                    <span className="text-[#1d1d1f]">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-[#86868b]">
                    <span>Pajak & Layanan (10%):</span>
                    <span className="text-[#1d1d1f]">{formatCurrency(taxesAndFees)}</span>
                  </div>
                  <div className="border-t border-black/[0.06] pt-3 flex justify-between text-sm font-semibold text-[#1d1d1f]">
                    <span>Total Pembayaran:</span>
                    <span>{formatCurrency(totalPrice)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-full text-xs font-medium text-white bg-[#0071e3] hover:bg-[#0077ed] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Memproses...' : 'Konfirmasi Reservasi'}
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d1d1f]"></div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
