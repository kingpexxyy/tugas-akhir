import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#f5f5f7] text-[#86868b] border-t border-black/[0.06] text-xs py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-[#1d1d1f] font-medium mb-3">Navigasi</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-[#1d1d1f] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/rooms" className="hover:text-[#1d1d1f] transition-colors">
                  Koleksi Kamar
                </Link>
              </li>
              <li>
                <Link href="/facilities" className="hover:text-[#1d1d1f] transition-colors">
                  Fasilitas & Spa
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#1d1d1f] font-medium mb-3">Layanan Tamu</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/booking" className="hover:text-[#1d1d1f] transition-colors">
                  Reservasi Kamar
                </Link>
              </li>
              <li>
                <Link href="/my-booking" className="hover:text-[#1d1d1f] transition-colors">
                  Pesanan Saya
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#1d1d1f] transition-colors">
                  Masuk Akun Demo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#1d1d1f] font-medium mb-3">Tipe Kamar</h4>
            <ul className="space-y-2">
              <li>Skyline Deluxe</li>
              <li>Azure Executive</li>
              <li>Cloud Suite</li>
              <li>Aero Presidential</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#1d1d1f] font-medium mb-3">Kontak & Lokasi</h4>
            <p className="leading-relaxed">
              SCBD Lot 28, Jl. Jend. Sudirman, Jakarta Selatan 12190
            </p>
            <p className="mt-2 text-[#1d1d1f] font-medium">+62 (21) 8088-2376</p>
          </div>
        </div>

        <div className="pt-8 border-t border-black/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            Copyright © {new Date().getFullYear()} AERORA Smart Hotel. Seluruh hak cipta dilindungi.
          </div>
          <div>Proyek Frontend Akademik • Simulasi Pemesanan Kamar Hotel</div>
        </div>
      </div>
    </footer>
  );
}
