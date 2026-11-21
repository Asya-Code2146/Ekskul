# SIM-EKSKUL - SMK Negeri 5 Telkom Banda Aceh

Sistem Informasi Manajemen Ekstrakurikuler (SIM-EKSKUL) berbasis web full-stack untuk SMK Negeri 5 Telkom Banda Aceh. Aplikasi ini memfasilitasi pendaftaran anggota, monitoring kegiatan, pengelolaan jadwal, presensi, serta pencatatan prestasi ekstrakurikuler secara terpusat, transparan, dan terintegrasi.

---

## Tautan Deploy & Akses Langsung

- Aplikasi Frontend (Vercel): [https://ekskul-nu.vercel.app](https://ekskul-nu.vercel.app)
- API Backend (Railway): [https://ekskul-production.up.railway.app](https://ekskul-production.up.railway.app)
- Repositori GitHub: [https://github.com/Asya-Code2146/Ekskul.git](https://github.com/Asya-Code2146/Ekskul.git)

---

## Palet Warna Desain (Charcoal + Muted Blue Grey)

Desain antarmuka dirancang konsisten dan modern sesuai panduan identitas visual:

| Komponen UI | Kode HEX | Peruntukan |
|---|---|---|
| Primary (Charcoal) | `#191D23` | Sidebar, header utama, footer, teks dominan |
| Accent (Muted Blue Grey) | `#57707A` | Tombol aksi utama, menu aktif, highlight |
| Secondary | `#7B919C` | Elemen sekunder, badge kategori, ikon pendukung |
| Surface | `#989DAA` | Garis batas, border card, teks sekunder |
| Muted | `#C5BAC4` | Elemen penunjang kontras lembut |
| Background | `#DEDCDC` | Background canvas aplikasi |

---

## Fitur Utama Aplikasi

1. Landing Page Responsif
   - Profil interaktif ekstrakurikuler SMKN 5 Telkom Banda Aceh
   - Showcase kegiatan, fasilitas, dan dokumentasi foto asli sekolah
   - Quick modal form pendaftaran mandiri bagi calon anggota

2. Dashboard Statistik Pengelola
   - Ringkasan total ekstrakurikuler aktif
   - Total seluruh siswa terdaftar dan anggota aktif
   - Total jadwal kegiatan dan perolehan prestasi juara
   - Diagram visual distribusi anggota dan metrik performa

3. Modul Manajemen Ekstrakurikuler
   - CRUD data ekstrakurikuler lengkap dengan pembina dan kategori
   - Filter cepat berdasarkan kategori (Teknologi, Olahraga, Kepemimpinan, Seni, Bahasa)

4. Modul Keanggotaan Siswa
   - Pendaftaran anggota per tahun ajaran
   - Penetapan struktur jabatan (Ketua, Wakil, Sekretaris, Bendahara, Anggota)
   - Status keanggotaan aktif dan filter jurusan

5. Modul Jadwal & Presensi Kegiatan
   - Penjadwalan latihan, agenda rutin, dan latihan tanding
   - Pencatatan kehadiran digital per sesi (Hadir, Izin, Sakit, Alpa)

6. Modul Rekam Prestasi
   - Dokumentasi piala dan sertifikat kompetisi (LKS, O2SN, FLS2N, dsb)
   - Pendataan tingkatan juara (Kota, Provinsi, Nasional)

---

## Arsitektur & Teknologi

### Frontend
- Vue.js 3 (Composition API dengan script setup)
- Vite
- Tailwind CSS
- Axios untuk komunikasi HTTP REST API

### Backend
- Express.js (Node.js runtime)
- mysql2/promise dengan Connection Pool
- CORS & dotenv untuk konfigurasi lingkungan

### Database
- MySQL 8.0 dengan 10 tabel relasional saling terhubung (Primary Key, Foreign Key, Cascading):
  - `ekskul`
  - `anggota_ekskul`
  - `siswa`
  - `jurusan`
  - `pembina`
  - `tahun_ajaran`
  - `jadwal_kegiatan`
  - `presensi`
  - `prestasi`
  - `users`

---

## Struktur Folder Proyek

```
sim-ekskul/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── ekskulController.js
│   │   ├── anggotaController.js
│   │   ├── jadwalController.js
│   │   ├── presensiController.js
│   │   ├── prestasiController.js
│   │   ├── dashboardController.js
│   │   └── masterController.js
│   ├── routes/
│   │   ├── ekskulRoutes.js
│   │   ├── anggotaRoutes.js
│   │   ├── jadwalRoutes.js
│   │   ├── presensiRoutes.js
│   │   ├── prestasiRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── masterRoutes.js
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   │   └── images/
│   │       └── gedung-smkn5.jpg
│   ├── src/
│   │   ├── assets/
│   │   │   └── main.css
│   │   ├── components/
│   │   │   ├── NavbarApp.vue
│   │   │   └── SidebarNav.vue
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── views/
│   │   │   ├── LandingView.vue
│   │   │   ├── DashboardView.vue
│   │   │   ├── EkskulView.vue
│   │   │   ├── AnggotaView.vue
│   │   │   ├── JadwalView.vue
│   │   │   └── PrestasiView.vue
│   │   ├── App.vue
│   │   └── main.js
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
├── .gitignore
└── README.md
```

---

## Panduan Instalasi Lokal

### 1. Prasyarat
- Node.js versi 18 atau lebih baru
- Laragon atau XAMPP (MySQL Service aktif di port 3306)
- Git

### 2. Kloning Repositori
```bash
git clone https://github.com/Asya-Code2146/Ekskul.git
cd Ekskul
```

### 3. Konfigurasi Database Lokal
- Buka HeidiSQL / phpMyAdmin pada Laragon.
- Buat database baru bernama `sim_ekskul`.
- Sesuaikan konfigurasi pada file `backend/.env`.

Contoh file `backend/.env`:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sim_ekskul
DB_PORT=3306
```

### 4. Menjalankan Backend
```bash
cd backend
npm install
npm run dev
```
Backend berjalan pada: `http://localhost:3000`

### 5. Menjalankan Frontend
Buka terminal baru:
```bash
cd frontend
npm install
npm run dev
```
Frontend berjalan pada: `http://localhost:5173`

---

## Daftar Endpoint REST API

| Method | Endpoint | Deskripsi |
|---|---|---|
| GET | `/api/dashboard/stats` | Statistik kartu ringkasan dan grafik |
| GET | `/api/ekskul` | Mengambil seluruh data ekstrakurikuler |
| POST | `/api/ekskul` | Menambahkan data ekstrakurikuler baru |
| PUT | `/api/ekskul/:id` | Memperbarui data ekstrakurikuler |
| DELETE | `/api/ekskul/:id` | Menghapus ekstrakurikuler |
| GET | `/api/anggota` | Mengambil daftar seluruh anggota ekskul |
| POST | `/api/anggota` | Mendaftarkan siswa ke ekstrakurikuler |
| DELETE | `/api/anggota/:id` | Menghapus keanggotaan siswa |
| GET | `/api/jadwal` | Mengambil daftar jadwal latihan kegiatan |
| POST | `/api/jadwal` | Membuat agenda jadwal latihan baru |
| GET | `/api/presensi` | Mengambil data presensi kegiatan |
| POST | `/api/presensi` | Mencatat status kehadiran anggota |
| GET | `/api/prestasi` | Mengambil daftar perolehan prestasi |
| POST | `/api/prestasi` | Menambahkan rekor juara prestasi baru |
| GET | `/api/master/siswa` | Mengambil data master siswa |
| GET | `/api/master/pembina` | Mengambil data master pembina |
| GET | `/api/master/tahun-ajaran` | Mengambil data master tahun ajaran |
| GET | `/api/master/jurusan` | Mengambil data master program keahlian |

---

## Kontak dan Media Sosial Resmi

SMK Negeri 5 Telkom Banda Aceh
- Alamat: Jl. Stadion H. Dimurthala No. 1, Lampineung, Banda Aceh 23126
- Email Resmi: smkn5telkombandaaceh@gmail.com
- Instagram: https://www.instagram.com/smkn5telkomaceh/ (@smkn5telkomaceh)
- Facebook: https://www.facebook.com/smkn.5.telkom.banda.aceh/?locale=id_ID
- X / Twitter: https://twitter.com/humas_smkn5_bna (@humas_smkn5_bna)
- TikTok: https://www.tiktok.com/@smkn5telkomaceh (@smkn5telkomaceh)
- LinkedIn: https://www.linkedin.com/company/smkn-5-telkom-banda-aceh
