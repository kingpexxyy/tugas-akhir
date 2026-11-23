'use client';

import React from 'react';
import Link from 'next/link';
import { ROOMS, FACILITIES } from '@/lib/data';
import { RoomCard } from '@/components/RoomCard';
import { SearchPanel } from '@/components/SearchPanel';
import { SafeImage } from '@/components/SafeImage';
import { ArrowRight, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const featuredRooms = ROOMS.filter((r) => r.featured).slice(0, 3);
  const previewFacilities = FACILITIES.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Apple-Style Hero Section with Staggered Entrance Animations */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 text-center px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4">
          <p className="text-xs uppercase tracking-[0.25em] font-medium text-[#86868b] animate-apple-fade-up opacity-0">
            AERORA HOTEL & RESIDENCES
          </p>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-[#1d1d1f] leading-[1.06] animate-apple-fade-up delay-100 opacity-0">
            Ketenangan dalam <br className="hidden sm:inline" />
            kesederhanaan.
          </h1>

          <p className="text-base sm:text-lg text-[#86868b] max-w-xl mx-auto font-normal leading-relaxed pt-1 animate-apple-fade-up delay-200 opacity-0">
            Arsitektur lapang, panorama cakrawala metropolitan, dan layanan perhotelan yang mengalir alami.
          </p>

          {/* Apple Action Pills with tactile active scale */}
          <div className="flex items-center justify-center gap-4 pt-4 animate-apple-fade-up delay-300 opacity-0">
            <Link
              href="/rooms"
              className="apple-btn px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-[#0071e3] text-white transition-all shadow-sm"
            >
              Jelajahi Kamar
            </Link>
            <Link
              href="/facilities"
              className="apple-btn inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#0071e3] hover:underline"
            >
              <span>Lihat Fasilitas</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Hero Showcase Visual with Apple Scale-In */}
        <div className="max-w-5xl mx-auto mt-12 px-2 sm:px-4 animate-apple-scale-in delay-400 opacity-0">
          <div className="relative rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9] bg-[#f5f5f7] border border-black/[0.06] shadow-[0_24px_60px_rgba(0,0,0,0.06)] group">
            <SafeImage
              src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1600&q=80"
              alt="AERORA Architecture"
              fallbackText="AERORA Hotel"
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.02]"
            />
          </div>
        </div>

        {/* Search Panel with Apple Fade-Up */}
        <div className="max-w-4xl mx-auto mt-10 px-2 sm:px-4 animate-apple-fade-up delay-500 opacity-0">
          <SearchPanel />
        </div>
      </section>

      {/* Featured Rooms — Apple Grid Style */}
      <section className="py-20 border-t border-black/[0.06] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#86868b] mb-1">
                Koleksi Kamar
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
                Ruang istirahat yang dirancang presisi.
              </h2>
            </div>
            <Link
              href="/rooms"
              className="apple-btn inline-flex items-center gap-1 text-xs font-medium text-[#0071e3] hover:underline"
            >
              <span>Semua Kamar ({ROOMS.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Highlight */}
      <section className="py-20 border-t border-black/[0.06] bg-[#fbfbfd]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <p className="text-xs uppercase tracking-wider font-semibold text-[#86868b]">
              Fasilitas Terpilih
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
              Penyegaran jiwa di setiap sudut.
            </h2>
            <p className="text-xs sm:text-sm text-[#86868b]">
              Dari kolam renang tanpa batas di lantai 28 hingga spa organik yang menenangkan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {previewFacilities.map((fac) => (
              <div
                key={fac.id}
                className="apple-card rounded-2xl overflow-hidden bg-white flex flex-col group"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#f5f5f7]">
                  <SafeImage
                    src={fac.image}
                    alt={fac.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] text-[#86868b] uppercase tracking-wider font-medium">
                      {fac.category}
                    </span>
                    <h3 className="text-base font-semibold text-[#1d1d1f] mt-1">
                      {fac.name}
                    </h3>
                    <p className="text-xs text-[#86868b] mt-2 leading-relaxed line-clamp-2">
                      {fac.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-black/[0.06] text-[11px] text-[#86868b] flex items-center justify-between">
                    <span>{fac.location}</span>
                    <span>{fac.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/facilities"
              className="apple-btn inline-flex items-center gap-1.5 text-xs font-medium text-[#0071e3] hover:underline"
            >
              <span>Eksplorasi Seluruh Fasilitas Hotel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Understated Minimalist Banner */}
      <section className="py-20 bg-[#1d1d1f] text-white text-center px-4">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Mulai pengalaman Anda.
          </h2>
          <p className="text-sm text-[#86868b] font-normal max-w-md mx-auto leading-relaxed">
            Masuk dengan akun demo untuk merasakan kemudahan pemesanan kamar pintar AERORA.
          </p>
          <div className="pt-2">
            <Link
              href="/rooms"
              className="apple-btn px-6 py-2.5 rounded-full text-xs font-medium bg-white text-[#1d1d1f] hover:bg-white/90 transition-all inline-block shadow-md"
            >
              Pesan Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
