'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Room } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { getStoredUser } from '@/lib/auth';
import { SafeImage } from './SafeImage';
import { ArrowRight, Lock } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  searchParams?: {
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  };
}

export function RoomCard({ room, searchParams }: RoomCardProps) {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(getStoredUser() !== null);
    const handleAuth = () => setIsAuth(getStoredUser() !== null);
    window.addEventListener('aerora_auth_change', handleAuth);
    return () => window.removeEventListener('aerora_auth_change', handleAuth);
  }, []);

  const bookingQuery = new URLSearchParams();
  bookingQuery.set('roomId', room.id);
  if (searchParams?.checkIn) bookingQuery.set('checkIn', searchParams.checkIn);
  if (searchParams?.checkOut) bookingQuery.set('checkOut', searchParams.checkOut);
  if (searchParams?.guests) bookingQuery.set('guests', searchParams.guests.toString());

  const bookingPath = `/booking?${bookingQuery.toString()}`;
  const targetHref = isAuth
    ? bookingPath
    : `/login?redirect=${encodeURIComponent(bookingPath)}`;

  return (
    <div className="group apple-card rounded-2xl overflow-hidden flex flex-col bg-white">
      {/* Room Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#f5f5f7]">
        <SafeImage
          src={room.image}
          alt={room.name}
          fallbackText={room.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute top-3.5 left-3.5 bg-black/45 backdrop-blur-md text-white text-[11px] font-medium tracking-wide px-2.5 py-0.5 rounded-full">
          {room.type}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-lg font-semibold text-[#1d1d1f] tracking-tight group-hover:text-[#0071e3] transition-colors">
              {room.name}
            </h3>
            <span className="text-xs text-[#86868b] whitespace-nowrap">
              {room.size}
            </span>
          </div>

          <p className="mt-2 text-xs leading-relaxed text-[#86868b] line-clamp-2">
            {room.description}
          </p>

          <div className="mt-4 flex items-center gap-2.5 text-xs text-[#86868b]">
            <span>{room.capacity} Tamu</span>
            <span>•</span>
            <span>{room.bed}</span>
            <span>•</span>
            <span>Nilai {room.rating}</span>
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
          <div>
            <div className="text-[11px] text-[#86868b]">Mulai dari</div>
            <div className="text-base font-semibold text-[#1d1d1f]">
              {formatCurrency(room.price)}
              <span className="text-xs font-normal text-[#86868b]"> /malam</span>
            </div>
          </div>

          <Link
            href={targetHref}
            className={`apple-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium ${
              isAuth
                ? 'bg-[#0071e3] text-white hover:bg-[#0077ed]'
                : 'bg-[#1d1d1f] text-white hover:bg-[#333336]'
            }`}
          >
            {!isAuth && <Lock className="w-3 h-3 text-white/80" />}
            <span>{isAuth ? 'Pilih Kamar' : 'Masuk & Pesan'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
