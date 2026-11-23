'use client';

import { Booking } from './types';
import { getStoredUser } from './auth';

const BOOKINGS_STORAGE_KEY = 'aerora_bookings';

const SAMPLE_DEMO_BOOKING: Booking = {
  id: 'AER-2026-SKY88',
  roomId: 'room-1',
  roomName: 'Skyline Deluxe',
  roomType: 'Deluxe',
  roomImage: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80',
  roomPrice: 850000,
  checkIn: '2026-11-20',
  checkOut: '2026-11-22',
  nights: 2,
  guests: 2,
  guestName: 'Aero Guest',
  guestEmail: 'guest@aerora.demo',
  guestPhone: '+62 812-3456-7890',
  specialRequests: 'Kamar lantai tinggi dengan pemandangan kota',
  totalPrice: 1700000,
  status: 'Confirmed',
  createdAt: '2026-11-05T10:30:00.000Z',
};

export function getBookings(): Booking[] {
  if (typeof window === 'undefined') return [];
  const user = getStoredUser();
  if (!user) return [];

  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) {
      const initial = [SAMPLE_DEMO_BOOKING];
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveBooking(booking: Booking): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    const current: Booking[] = raw ? JSON.parse(raw) : [];
    const updated = [booking, ...current.filter((b) => b.id !== booking.id)];
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('aerora_booking_change'));
  } catch {
    // ignore
  }
}

export function cancelBooking(id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    const current: Booking[] = raw ? JSON.parse(raw) : [];
    const updated = current.map((b) => (b.id === id ? { ...b, status: 'Cancelled' as const } : b));
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('aerora_booking_change'));
    return true;
  } catch {
    return false;
  }
}

export function deleteBooking(id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    const current: Booking[] = raw ? JSON.parse(raw) : [];
    const updated = current.filter((b) => b.id !== id);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('aerora_booking_change'));
    return true;
  } catch {
    return false;
  }
}
