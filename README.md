# AERORA — Smart Hotel Booking Experience

Website frontend aplikasi pemesanan kamar hotel pintar (smart hotel) **AERORA** yang dibangun menggunakan **Next.js (App Router)**, **TypeScript**, dan **Tailwind CSS**.

---

## 🚀 Fitur Utama & Halaman

1. **Home (`/`)**
   - Hero section dengan visual futuristik bertema *sky-blue* dan headline modern.
   - Quick search panel (tanggal check-in, check-out, dan jumlah tamu).
   - Koleksi kamar unggulan (*Featured Rooms*).
   - Preview fasilitas eksklusif hotel.
   - Testimoni tamu dan pilar keunggulan teknologi smart hotel (*Keyless access*, Wi-Fi 6, SCBD location, 24/7 concierge).

2. **Rooms (`/rooms`)**
   - Katalog 6 tipe kamar hotel (Skyline Deluxe, Azure Executive, Cloud Suite, Horizon Family Room, Aero Presidential Suite, Blue Haven Standard).
   - Filter interaktif berdasarkan tipe kamar, kapasitas minimum tamu, dan slider rentang harga.
   - Fitur sorting (rekomendasi, harga terendah, harga tertinggi, rating).
   - Meneruskan kriteria pencarian dari beranda ke halaman booking.

3. **Booking (`/booking`)**
   - Formulir reservasi interaktif dengan validasi tanggal menginap (mencegah check-out mendahului check-in).
   - Kalkulasi otomatis durasi malam dan total biaya dalam Rupiah (`Intl.NumberFormat('id-ID')`).
   - Prefill data otomatis jika pengguna sudah login.
   - Menghasilkan kode booking unik (misal: `AER-2026-XXXX`) dan langsung tersimpan ke `localStorage`.

4. **Facilities (`/facilities`)**
   - Showcase fasilitas hotel (Infinity Sky Pool, The Azure Gourmet Lounge, AeroFit 24/7 Wellness, Cloud Nine Spa, Wi-Fi 6, Airport Shuttle, dll).
   - Filter kategori (Leisure & Wellness, Dining, Fitness, Connectivity).
   - Informasi detail jam operasional dan lokasi tiap fasilitas.

5. **My Booking (`/my-booking`)**
   - Dasbor riwayat pemesanan yang tersimpan secara persisten di `localStorage`.
   - Ringkasan status reservasi (*Confirmed* / *Cancelled*).
   - Tombol pembatalan (*Cancel Booking*) dan hapus riwayat secara reaktif tanpa perlu reload halaman.

6. **Demo Authentication (`/login`)**
   - Formulir login khusus demo akun dengan validasi kredensial.
   - Tombol satu klik "Isi Otomatis" untuk kemudahan pengujian.
   - Mendukung pengalihan otomatis (*redirect*) setelah login berhasil.

---

## 🔑 Kredensial Akun Demo

| Field | Nilai Demo |
|---|---|
| **Email** | `guest@aerora.demo` |
| **Password** | `aerora123` |
| **Nama Tamu** | `Aero Guest` |

---

## 🛠️ Cara Menjalankan Proyek

Masuk ke direktori proyek:
```bash
cd usestate-xir6
```

Jalankan server pengembangan (*Development Server*):
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

Untuk menguji build produksi:
```bash
npm run build
npm run start
```

---

## 📋 Catatan Proyek
* Proyek ini merupakan tugas akademik frontend simulasi. Seluruh transaksi dan otentikasi disimulasikan menggunakan `localStorage` peramban (tanpa backend database atau payment gateway nyata).
