'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FACILITIES } from '@/lib/data';
import { SafeImage } from '@/components/SafeImage';
import { Clock, MapPin, ArrowRight } from 'lucide-react';

export default function FacilitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = [
    { label: 'Semua', value: 'ALL' },
    { label: 'Leisure & Wellness', value: 'Leisure & Wellness' },
    { label: 'Dining', value: 'Dining' },
    { label: 'Fitness', value: 'Fitness' },
    { label: 'Layanan Lainnya', value: 'Connectivity' },
  ];

  const filteredFacilities = FACILITIES.filter((fac) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'Connectivity') {
      return (
        fac.category === 'Connectivity' ||
        fac.category === 'Transportation' ||
        fac.category === 'Guest Service' ||
        fac.category === 'Convenience'
      );
    }
    return fac.category === selectedCategory;
  });

  return (
    <div className="min-h-screen py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        {/* Apple Style Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2 animate-apple-fade-up opacity-0">
          <p className="text-xs uppercase tracking-[0.2em] font-medium text-[#86868b]">
            FASILITAS HOTEL
          </p>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
            Kenyamanan Tanpa Batas.
          </h1>
          <p className="text-xs sm:text-sm text-[#86868b]">
            Fasilitas relaksasi, kebugaran, dan kuliner terpadu untuk menyempurnakan hari Anda.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 bg-[#f5f5f7] p-1.5 rounded-full max-w-xl mx-auto mb-12 animate-apple-fade-up delay-100 opacity-0">
          {categories.map((cat) => {
            const active = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-1.5 rounded-full text-xs transition-all cursor-pointer ${
                  active
                    ? 'bg-white text-[#1d1d1f] font-medium shadow-sm'
                    : 'text-[#86868b] hover:text-[#1d1d1f]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredFacilities.map((fac, idx) => (
            <div
              key={fac.id}
              className="apple-card rounded-2xl overflow-hidden bg-white flex flex-col animate-apple-fade-up opacity-0"
              style={{ animationDelay: `${200 + idx * 100}ms` }}
            >
              <div className="aspect-[16/10] overflow-hidden bg-[#f5f5f7]">
                <SafeImage
                  src={fac.image}
                  alt={fac.name}
                  fallbackText={fac.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#86868b]">
                    {fac.category}
                  </span>
                  <h3 className="text-lg font-semibold text-[#1d1d1f] mt-1">
                    {fac.name}
                  </h3>
                  <p className="text-xs text-[#86868b] mt-2.5 leading-relaxed">
                    {fac.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-black/[0.06] flex items-center justify-between text-[11px] text-[#86868b]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{fac.hours}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{fac.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Simple End Banner */}
        <div className="mt-16 text-center">
          <Link
            href="/rooms"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0071e3] hover:underline"
          >
            <span>Reservasi Kamar Sekarang</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
