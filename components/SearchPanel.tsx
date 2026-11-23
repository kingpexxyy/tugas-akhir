'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getTodayDateString, getTomorrowDateString } from '@/lib/utils';
import { Calendar, Users, ArrowRight } from 'lucide-react';

interface SearchPanelProps {
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  className?: string;
  onSearch?: (criteria: { checkIn: string; checkOut: string; guests: number }) => void;
}

export function SearchPanel({
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
  className = '',
  onSearch,
}: SearchPanelProps) {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState(initialCheckIn || getTodayDateString());
  const [checkOut, setCheckOut] = useState(initialCheckOut || getTomorrowDateString());
  const [guests, setGuests] = useState(initialGuests || 2);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!checkIn || !checkOut) {
      setError('Silakan pilih tanggal check-in dan check-out.');
      return;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (end <= start) {
      setError('Tanggal check-out harus setelah check-in.');
      return;
    }

    if (onSearch) {
      onSearch({ checkIn, checkOut, guests });
    } else {
      router.push(
        `/rooms?checkIn=${encodeURIComponent(checkIn)}&checkOut=${encodeURIComponent(checkOut)}&guests=${guests}`
      );
    }
  };

  return (
    <div className={`w-full bg-white rounded-3xl p-4 sm:p-5 border border-black/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${className}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {error && (
          <div className="text-xs text-red-600 bg-red-50/80 px-3.5 py-2 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Check-In */}
          <div className="bg-[#f5f5f7] rounded-2xl p-3 flex flex-col justify-center">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-[#86868b] mb-1 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-[#86868b]" />
              Check-In
            </label>
            <input
              type="date"
              value={checkIn}
              min={getTodayDateString()}
              onChange={(e) => {
                setCheckIn(e.target.value);
                setError(null);
              }}
              required
              className="bg-transparent text-xs font-medium text-[#1d1d1f] focus:outline-none cursor-pointer"
            />
          </div>

          {/* Check-Out */}
          <div className="bg-[#f5f5f7] rounded-2xl p-3 flex flex-col justify-center">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-[#86868b] mb-1 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-[#86868b]" />
              Check-Out
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || getTodayDateString()}
              onChange={(e) => {
                setCheckOut(e.target.value);
                setError(null);
              }}
              required
              className="bg-transparent text-xs font-medium text-[#1d1d1f] focus:outline-none cursor-pointer"
            />
          </div>

          {/* Guests */}
          <div className="bg-[#f5f5f7] rounded-2xl p-3 flex flex-col justify-center">
            <label className="text-[10px] uppercase tracking-wider font-semibold text-[#86868b] mb-1 flex items-center gap-1.5">
              <Users className="w-3 h-3 text-[#86868b]" />
              Tamu
            </label>
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="bg-transparent text-xs font-medium text-[#1d1d1f] focus:outline-none cursor-pointer"
            >
              <option value={1}>1 Tamu</option>
              <option value={2}>2 Tamu</option>
              <option value={3}>3 Tamu</option>
              <option value={4}>4 Tamu</option>
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            className="apple-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-xs font-medium text-white bg-[#1d1d1f] hover:bg-[#333336] cursor-pointer"
          >
            <span>Cari Kamar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
