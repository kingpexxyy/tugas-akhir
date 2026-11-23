'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ROOMS } from '@/lib/data';
import { RoomCard } from '@/components/RoomCard';
import { SearchPanel } from '@/components/SearchPanel';
import { SlidersHorizontal } from 'lucide-react';

function RoomsContent() {
  const searchParams = useSearchParams();
  const initialCheckIn = searchParams.get('checkIn') || '';
  const initialCheckOut = searchParams.get('checkOut') || '';
  const initialGuests = Number(searchParams.get('guests')) || 0;

  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [guestFilter, setGuestFilter] = useState<number>(initialGuests);
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [maxPrice, setMaxPrice] = useState<number>(3000000);

  const roomTypes: { label: string; value: string }[] = [
    { label: 'Semua Tipe', value: 'ALL' },
    { label: 'Standard', value: 'Standard' },
    { label: 'Deluxe', value: 'Deluxe' },
    { label: 'Executive', value: 'Executive' },
    { label: 'Suite', value: 'Suite' },
    { label: 'Family', value: 'Family' },
    { label: 'Presidential', value: 'Presidential' },
  ];

  const filteredRooms = useMemo(() => {
    return ROOMS.filter((room) => {
      if (selectedType !== 'ALL' && room.type !== selectedType) return false;
      if (guestFilter > 0 && room.capacity < guestFilter) return false;
      if (room.price > maxPrice) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedType, guestFilter, maxPrice, sortBy]);

  return (
    <div className="min-h-screen py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Apple Style Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2 animate-apple-fade-up">
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-[#86868b]">
            KATALOG AKOMODASI
          </p>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
            Kamar & Suite.
          </h1>
          <p className="text-xs sm:text-sm text-[#86868b]">
            Pilih ruang menginap yang sesuai dengan ritme perjalanan Anda.
          </p>
        </div>

        {/* Search Panel */}
        <div className="max-w-4xl mx-auto mb-10 animate-apple-fade-up delay-100 opacity-0">
          <SearchPanel
            initialCheckIn={initialCheckIn}
            initialCheckOut={initialCheckOut}
            initialGuests={guestFilter || 2}
            onSearch={(criteria) => setGuestFilter(criteria.guests)}
          />
        </div>

        {/* Apple Segmented Controls */}
        <div className="bg-white border border-black/[0.06] rounded-2xl p-4 sm:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-8 space-y-4 animate-apple-fade-up delay-200 opacity-0">
          {/* Type Pills */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 bg-[#f5f5f7] p-1.5 rounded-full max-w-3xl mx-auto">
            {roomTypes.map((type) => {
              const active = selectedType === type.value;
              return (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer ${active
                    ? 'bg-white text-[#1d1d1f] font-medium shadow-sm'
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                    }`}
                >
                  {type.label}
                </button>
              );
            })}
          </div>

          {/* Secondary Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs border-t border-black/[0.04]">
            <div>
              <label className="text-[11px] text-[#86868b] block mb-1">
                Kapasitas Tamu Minimum:
              </label>
              <select
                value={guestFilter}
                onChange={(e) => setGuestFilter(Number(e.target.value))}
                className="w-full bg-[#f5f5f7] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none cursor-pointer"
              >
                <option value={0}>Semua Kapasitas</option>
                <option value={2}>Minimal 2 Tamu</option>
                <option value={3}>Minimal 3 Tamu</option>
                <option value={4}>Minimal 4 Tamu</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1 text-[11px] text-[#86868b]">
                <span>Batas Harga Maksimal:</span>
                <span className="font-medium text-[#1d1d1f]">
                  Rp {(maxPrice / 1000).toLocaleString('id-ID')}.000
                </span>
              </div>
              <input
                type="range"
                min={650000}
                max={3000000}
                step={100000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#1d1d1f] cursor-pointer"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#86868b] block mb-1">
                Urutan:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#f5f5f7] rounded-xl px-3 py-2 text-[#1d1d1f] focus:outline-none cursor-pointer"
              >
                <option value="recommended">Pilihan Terpilih</option>
                <option value="price-low">Harga: Rendah ke Tinggi</option>
                <option value="price-high">Harga: Tinggi ke Rendah</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>
        </div>

        {/* Counter */}
        <div className="flex items-center justify-between text-xs text-[#86868b] mb-6 px-1">
          <span>Menampilkan {filteredRooms.length} tipe kamar</span>
        </div>

        {/* Room Grid */}
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                searchParams={{
                  checkIn: initialCheckIn,
                  checkOut: initialCheckOut,
                  guests: guestFilter,
                }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-black/[0.06] max-w-md mx-auto my-12 space-y-3">
            <SlidersHorizontal className="w-8 h-8 text-[#86868b] mx-auto" />
            <h3 className="text-base font-semibold text-[#1d1d1f]">
              Tidak Ada Kamar yang Sesuai
            </h3>
            <p className="text-xs text-[#86868b]">
              Coba sesuaikan batas harga atau kapasitas tamu pada filter di atas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1d1d1f]"></div>
        </div>
      }
    >
      <RoomsContent />
    </Suspense>
  );
}
