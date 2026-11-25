<script setup>
import { ref } from 'vue';
import { useToast } from '../services/toast.js';

const { showToast } = useToast();

const activeTab = ref('profil');

const profilSekolah = ref({
  nama_sekolah: 'SMK Negeri 5 Telkom Banda Aceh',
  npsn: '10111577',
  jenjang: 'SMK (Sekolah Menengah Kejuruan)',
  alamat: 'Jl. Stadion H. Dimurthala No. 1, Lampineung, Banda Aceh 23126',
  email: 'smkn5telkombandaaceh@gmail.com',
  telepon: '(0651) 22345',
  website: 'https://smkn5telkom.sch.id'
});

const akademik = ref({
  tahun_ajaran: '2026/2027',
  semester: 'Ganjil',
  status_pendaftaran: 'Buka',
  max_ekskul_siswa: 2
});

const adminAkun = ref({
  nama_admin: 'Admin Ekstrakurikuler',
  username: 'admin_ekskul',
  email: 'admin@smkn5telkom.sch.id',
  password_baru: '',
  konfirmasi_password: ''
});

const saveSettings = () => {
  showToast('Pengaturan sistem berhasil disimpan!');
};
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#c8cbd3] shadow-xs">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
        <div>
          <h2 class="text-xl font-black text-[#191D23] tracking-tight">Pengaturan Sistem</h2>
          <p class="text-xs text-[#57707A] mt-0.5">Konfigurasi operasional SIM-EKSKUL SMKN 5 Telkom Banda Aceh</p>
        </div>

        <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            @click="activeTab = 'profil'"
            :class="[
              'px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
              activeTab === 'profil' ? 'bg-[#191D23] text-white shadow-xs' : 'text-[#57707A] hover:text-[#191D23]'
            ]"
          >
            Profil Sekolah
          </button>
          <button
            @click="activeTab = 'akademik'"
            :class="[
              'px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
              activeTab === 'akademik' ? 'bg-[#191D23] text-white shadow-xs' : 'text-[#57707A] hover:text-[#191D23]'
            ]"
          >
            Tahun Ajaran
          </button>
          <button
            @click="activeTab = 'akun'"
            :class="[
              'px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer',
              activeTab === 'akun' ? 'bg-[#191D23] text-white shadow-xs' : 'text-[#57707A] hover:text-[#191D23]'
            ]"
          >
            Akun Admin
          </button>
        </div>
      </div>

      <div v-if="showSuccessToast" class="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in duration-300">
        <svg class="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span>Pengaturan berhasil disimpan dan langsung diterapkan ke sistem!</span>
      </div>

      <form @submit.prevent="saveSettings" class="mt-6 space-y-6">
        <div v-if="activeTab === 'profil'" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Nama Institusi / Sekolah</label>
              <input
                v-model="profilSekolah.nama_sekolah"
                type="text"
                required
                class="w-full px-4 py-2.5 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">NPSN Resmi</label>
              <input
                v-model="profilSekolah.npsn"
                type="text"
                required
                class="w-full px-4 py-2.5 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Alamat Lengkap</label>
            <input
              v-model="profilSekolah.alamat"
              type="text"
              required
              class="w-full px-4 py-2.5 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Email Resmi</label>
              <input
                v-model="profilSekolah.email"
                type="email"
                required
                class="w-full px-4 py-2.5 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Telepon Sekolah</label>
              <input
                v-model="profilSekolah.telepon"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Website</label>
              <input
                v-model="profilSekolah.website"
                type="text"
                class="w-full px-4 py-2.5 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
              />
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'akademik'" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Tahun Ajaran Aktif</label>
              <select
                v-model="akademik.tahun_ajaran"
                class="w-full px-4 py-2.5 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
              >
                <option value="2026/2027">2026/2027 (Aktif Sekarang)</option>
                <option value="2025/2026">2025/2026</option>
                <option value="2024/2025">2024/2025</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Semester</label>
              <select
                v-model="akademik.semester"
                class="w-full px-4 py-2.5 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Status Pendaftaran Siswa</label>
              <select
                v-model="akademik.status_pendaftaran"
                class="w-full px-4 py-2.5 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
              >
                <option value="Buka">Dibuka untuk Siswa (Mandiri)</option>
                <option value="Tutup">Ditutup Sementara</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Batas Ekskul per Siswa</label>
              <select
                v-model="akademik.max_ekskul_siswa"
                class="w-full px-4 py-2.5 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
              >
                <option :value="1">Maksimal 1 Ekstrakurikuler</option>
                <option :value="2">Maksimal 2 Ekstrakurikuler (Rekomendasi)</option>
                <option :value="3">Maksimal 3 Ekstrakurikuler</option>
              </select>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'akun'" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Nama Administrator</label>
              <input
                v-model="adminAkun.nama_admin"
                type="text"
                required
                class="w-full px-4 py-2.5 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Username Login</label>
              <input
                v-model="adminAkun.username"
                type="text"
                required
                class="w-full px-4 py-2.5 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Email Akun</label>
            <input
              v-model="adminAkun.email"
              type="email"
              required
              class="w-full px-4 py-2.5 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Password Baru (Opsional)</label>
              <input
                v-model="adminAkun.password_baru"
                type="password"
                placeholder="Kosongkan bila tidak diubah"
                class="w-full px-4 py-2.5 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Konfirmasi Password</label>
              <input
                v-model="adminAkun.konfirmasi_password"
                type="password"
                placeholder="Ulangi password baru"
                class="w-full px-4 py-2.5 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
              />
            </div>
          </div>
        </div>

        <div class="pt-6 border-t border-slate-100 flex items-center justify-between">
          <div class="text-xs text-[#57707A]">
            Koneksi Database: <span class="font-bold text-emerald-600">Aktif (MySQL 8.0)</span>
          </div>
          <button
            type="submit"
            class="px-6 py-2.5 rounded-xl bg-[#191D23] hover:bg-[#57707A] text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer active:scale-95"
          >
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  </div>
</template>