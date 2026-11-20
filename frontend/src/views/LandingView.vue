<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api.js';

const emit = defineEmits(['enter-dashboard', 'register-ekskul']);

const ekskulList = ref([]);
const isLoading = ref(false);
const mobileMenuOpen = ref(false);

const quickRegisterModal = ref(false);
const selectedEkskulForReg = ref(null);
const siswaList = ref([]);
const tahunAjaranList = ref([]);
const regForm = ref({
  nisn: '',
  id_ekskul: '',
  id_tahun_ajaran: '',
  jabatan: 'Anggota'
});

const loadLandingData = async () => {
  isLoading.value = true;
  try {
    const [resEkskul, resSiswa, resTahun] = await Promise.all([
      api.get('/ekskul'),
      api.get('/master/siswa'),
      api.get('/master/tahun-ajaran')
    ]);
    ekskulList.value = resEkskul.data.data;
    siswaList.value = resSiswa.data.data;
    tahunAjaranList.value = resTahun.data.data;

    if (siswaList.value.length > 0) regForm.value.nisn = siswaList.value[0].nisn;
    if (tahunAjaranList.value.length > 0) regForm.value.id_tahun_ajaran = tahunAjaranList.value[0].id_tahun_ajaran;
  } catch (error) {
    console.error('Error fetching landing data:', error);
  } finally {
    isLoading.value = false;
  }
};

const openQuickRegister = (ekskul) => {
  selectedEkskulForReg.value = ekskul;
  regForm.value.id_ekskul = ekskul.id_ekskul;
  quickRegisterModal.value = true;
};

const submitQuickRegister = async () => {
  try {
    await api.post('/anggota', regForm.value);
    alert('Pendaftaran berhasil! Selamat bergabung di ' + selectedEkskulForReg.value.nama_ekskul);
    quickRegisterModal.value = false;
    await loadLandingData();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal mendaftar.');
  }
};

const scrollToSection = (id) => {
  mobileMenuOpen.value = false;
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};

const ekskulIconSvg = (kategori) => {
  switch (kategori) {
    case 'Teknologi':
      return 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4';
    case 'Olahraga':
      return 'M13 10V3L4 14h7v7l9-11h-7z';
    case 'Seni':
      return 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01';
    case 'Kepemimpinan':
      return 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z';
    default:
      return 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253';
  }
};

onMounted(() => {
  loadLandingData();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
    <header class="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <div class="font-extrabold text-slate-900 tracking-tight text-sm sm:text-base leading-none">
              SIM-EKSKUL
            </div>
            <div class="text-[11px] text-slate-500 font-medium">SMKN 5 Telkom Banda Aceh</div>
          </div>
        </div>

        <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <button @click="scrollToSection('beranda')" class="hover:text-blue-600 transition cursor-pointer">Beranda</button>
          <button @click="scrollToSection('ekskul')" class="hover:text-blue-600 transition cursor-pointer">Ekstrakurikuler</button>
          <button @click="scrollToSection('dokumentasi')" class="hover:text-blue-600 transition cursor-pointer">Dokumentasi</button>
          <button @click="scrollToSection('tentang')" class="hover:text-blue-600 transition cursor-pointer">Tentang</button>
          <button @click="scrollToSection('kontak')" class="hover:text-blue-600 transition cursor-pointer">Kontak</button>
        </nav>

        <div class="hidden sm:flex items-center gap-3">
          <button
            @click="emit('enter-dashboard')"
            class="inline-flex items-center gap-2 bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-sm hover:shadow active:scale-95 cursor-pointer"
          >
            <span>Masuk Panel</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Toggle Menu"
          class="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
        >
          <span
            :class="[
              'w-5 h-0.5 bg-slate-800 rounded-full transition-transform duration-300',
              mobileMenuOpen ? 'translate-y-2 rotate-45' : ''
            ]"
          ></span>
          <span
            :class="[
              'w-5 h-0.5 bg-slate-800 rounded-full transition-opacity duration-200',
              mobileMenuOpen ? 'opacity-0' : 'opacity-100'
            ]"
          ></span>
          <span
            :class="[
              'w-5 h-0.5 bg-slate-800 rounded-full transition-transform duration-300',
              mobileMenuOpen ? '-translate-y-2 -rotate-45' : ''
            ]"
          ></span>
        </button>
      </div>

      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200"
      >
        <button
          @click="scrollToSection('beranda')"
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Beranda
        </button>
        <button
          @click="scrollToSection('ekskul')"
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Ekstrakurikuler
        </button>
        <button
          @click="scrollToSection('dokumentasi')"
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Dokumentasi
        </button>
        <button
          @click="scrollToSection('tentang')"
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Tentang
        </button>
        <button
          @click="scrollToSection('kontak')"
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Kontak
        </button>
        <div class="pt-2 border-t border-slate-100">
          <button
            @click="emit('enter-dashboard')"
            class="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-2.5 rounded-xl text-sm shadow-md"
          >
            <span>Masuk Panel Pengelola</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <section id="beranda" class="relative overflow-hidden bg-slate-900 text-white py-16 sm:py-24 lg:py-28">
      <div class="absolute inset-0 z-0 opacity-25 mix-blend-luminosity">
        <img
          src="/images/gedung-smkn5.jpg"
          alt="Gedung SMKN 5 Telkom Banda Aceh"
          class="w-full h-full object-cover object-center"
        />
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-blue-950/80 z-0"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-600/30 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-xs">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Ekstrakurikuler SMKN 5 Telkom Banda Aceh</span>
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
            Temukan Minat,<br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Kembangkan Potensi
            </span>
          </h1>

          <p class="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            SIM-EKSKUL menghubungkan siswa dengan berbagai kegiatan ekstrakurikuler unggulan untuk mendukung pengembangan kompetensi, kreativitas, dan prestasi juara.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              @click="scrollToSection('ekskul')"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition cursor-pointer"
            >
              <span>Lihat Ekstrakurikuler</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              @click="emit('enter-dashboard')"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-semibold text-sm px-6 py-3.5 rounded-xl transition cursor-pointer"
            >
              <span>Panel Pengelola</span>
            </button>
          </div>
        </div>

        <div class="lg:col-span-5 space-y-4">
          <div class="p-5 rounded-2xl bg-slate-800/70 backdrop-blur-md border border-slate-700/80 shadow-xl flex items-start gap-4">
            <div class="w-11 h-11 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-white text-sm">Beragam Pilihan Kegiatan</h3>
              <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                Pilihan divisi terpadu dari bidang Teknologi, Olahraga, Seni, Kepemimpinan, hingga Keagamaan.
              </p>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-slate-800/70 backdrop-blur-md border border-slate-700/80 shadow-xl flex items-start gap-4">
            <div class="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-white text-sm">Mudah Dikelola & Transparan</h3>
              <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                Pendaftaran siswa, riwayat keanggotaan, serta pencatatan presensi terpusat dan terdata rapi.
              </p>
            </div>
          </div>

          <div class="p-5 rounded-2xl bg-slate-800/70 backdrop-blur-md border border-slate-700/80 shadow-xl flex items-start gap-4">
            <div class="w-11 h-11 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-white text-sm">Dokumentasi & Prestasi Juara</h3>
              <p class="text-xs text-slate-300 mt-1 leading-relaxed">
                Merekam rekam jejak sertifikasi, perlombaan LKS, dan kejuaraan tingkat regional hingga nasional.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="ekskul" class="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <div class="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Pilihan Unit Kegiatan</div>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Beragam Pilihan Kegiatan</h2>
        <p class="text-xs sm:text-sm text-slate-500 mt-2">
          Pilih ekstrakurikuler yang sesuai dengan minat, bakat, dan cita-cita masa depanmu.
        </p>
      </div>

      <div v-if="isLoading" class="text-center py-12 text-slate-400 text-sm">
        Memuat daftar kegiatan ekstrakurikuler...
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in ekskulList"
          :key="item.id_ekskul"
          class="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col justify-between group"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-4">
              <span class="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {{ item.kategori }}
              </span>
              <span class="text-xs text-slate-400 font-semibold">
                {{ item.total_anggota || 0 }} Peserta
              </span>
            </div>

            <div class="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-4 group-hover:bg-blue-600 transition">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="ekskulIconSvg(item.kategori)" />
              </svg>
            </div>

            <h3 class="text-base sm:text-lg font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition">
              {{ item.nama_ekskul }}
            </h3>

            <p class="text-xs text-slate-500 leading-relaxed">
              Program pelatihan intensif di bawah pembinaan guru ahli untuk mengasah kemampuan teknis dan soft skill.
            </p>
          </div>

          <div class="pt-5 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
            <div class="text-left">
              <div class="text-[11px] text-slate-400 font-medium">Pembina:</div>
              <div class="text-xs font-bold text-slate-800 truncate max-w-[150px]">{{ item.nama_pembina }}</div>
            </div>

            <button
              @click="openQuickRegister(item)"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition cursor-pointer"
            >
              <span>Daftar</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <section id="dokumentasi" class="py-16 bg-slate-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <div class="text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">Galeri Kegiatan</div>
          <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight">Dokumentasi Kegiatan</h2>
          <p class="text-xs sm:text-sm text-slate-400 mt-2">
            Rekam momen berharga para siswa dalam berbagai kegiatan latihan, workshop, dan kompetisi.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 group">
            <div class="h-48 overflow-hidden">
              <img
                src="/images/gedung-smkn5.jpg"
                alt="Lingkungan Kampus SMKN 5 Telkom"
                class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
            <div class="p-5">
              <span class="text-[10px] font-bold uppercase tracking-wider text-blue-400">Lingkungan Kampus</span>
              <h3 class="font-bold text-base text-white mt-1">Fasilitas Ekstrakurikuler Modern</h3>
              <p class="text-xs text-slate-400 mt-1.5">
                Ruang terbuka hijau dan laboratorium pendukung kegiatan siswa di SMKN 5 Telkom Banda Aceh.
              </p>
            </div>
          </div>

          <div class="rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 p-6 flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-blue-400">Bootcamp Teknologi</span>
              <h3 class="font-bold text-base text-white mt-1">Telkom Coding Club Workshop</h3>
              <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Pelatihan intensif pengembangan aplikasi web berbasis Full-Stack JavaScript (Vue.js dan Express.js).
              </p>
            </div>
            <div class="pt-4 border-t border-slate-700/80 text-xs text-slate-300 font-semibold">
              Lab Komputer RPL • 21 Nov 2026
            </div>
          </div>

          <div class="rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 p-6 flex flex-col justify-between">
            <div>
              <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400">Prestasi Gemilang</span>
              <h3 class="font-bold text-base text-white mt-1">Juara 1 LKS Web Technologies</h3>
              <p class="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Siswa perwakilan ekskul sukses meraih medali emas pada Lomba Kompetensi Siswa Tingkat Provinsi Aceh.
              </p>
            </div>
            <div class="pt-4 border-t border-slate-700/80 text-xs text-slate-300 font-semibold">
              Tingkat Provinsi • Banda Aceh
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="tentang" class="py-16 bg-white border-y border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-2xl mx-auto mb-12">
          <div class="text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">Misi & Nilai</div>
          <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Mendukung Pengembangan Potensi Siswa
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div class="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 mx-auto sm:mx-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 class="font-bold text-base text-slate-900 mb-2">Prestasi Berkelanjutan</h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              Mendorong siswa mencapai predikat terbaik dalam berbagai ajang perlombaan akademik dan non-akademik.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 mx-auto sm:mx-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <h3 class="font-bold text-base text-slate-900 mb-2">Pendidikan Karakter</h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              Menumbuhkan kedisiplinan, kepemimpinan, integritas, dan sportivitas dalam kehidupan berorganisasi.
            </p>
          </div>

          <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4 mx-auto sm:mx-0">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 class="font-bold text-base text-slate-900 mb-2">Semangat Kolaborasi</h3>
            <p class="text-xs text-slate-500 leading-relaxed">
              Membangun sinergi antar jurusan (RPL, TKJ, DKV, TEL) untuk menciptakan inovasi dan karya bersama.
            </p>
          </div>
        </div>
      </div>
    </section>

    <footer id="kontak" class="bg-slate-950 text-slate-300 py-12 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="md:col-span-2 space-y-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              5
            </div>
            <span class="font-bold text-white text-base">SIM-EKSKUL SMKN 5 TELKOM</span>
          </div>
          <p class="text-xs text-slate-400 max-w-sm leading-relaxed">
            Sistem Informasi Manajemen Ekstrakurikuler Sekolah Menengah Kejuruan Negeri 5 Telkom Banda Aceh.
          </p>
          <div class="text-xs text-slate-500">
            © 2026 SMKN 5 Telkom Banda Aceh. Hak cipta dilindungi undang-undang.
          </div>
        </div>

        <div>
          <div class="text-xs font-bold uppercase tracking-wider text-white mb-3">Tautan Cepat</div>
          <ul class="space-y-2 text-xs text-slate-400">
            <li><button @click="scrollToSection('beranda')" class="hover:text-white transition cursor-pointer">Beranda</button></li>
            <li><button @click="scrollToSection('ekskul')" class="hover:text-white transition cursor-pointer">Ekstrakurikuler</button></li>
            <li><button @click="scrollToSection('dokumentasi')" class="hover:text-white transition cursor-pointer">Dokumentasi</button></li>
            <li><button @click="emit('enter-dashboard')" class="hover:text-white transition cursor-pointer">Panel Pengelola</button></li>
          </ul>
        </div>

        <div>
          <div class="text-xs font-bold uppercase tracking-wider text-white mb-3">Kontak Sekolah</div>
          <div class="text-xs text-slate-400 space-y-1.5 leading-relaxed">
            <div>Jl. Stadion H. Dimurthala No. 1, Lampineung</div>
            <div>Banda Aceh, Aceh 23126</div>
            <div class="pt-1 text-slate-300 font-semibold">lms.smkn5telkom.sch.id</div>
          </div>
        </div>
      </div>
    </footer>

    <div
      v-if="quickRegisterModal"
      class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 class="text-base font-bold text-slate-900">Form Pendaftaran Anggota</h3>
            <p class="text-xs text-blue-600 font-semibold">{{ selectedEkskulForReg?.nama_ekskul }}</p>
          </div>
          <button
            @click="quickRegisterModal = false"
            class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitQuickRegister" class="space-y-4 mt-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Pilih Data Siswa *</label>
            <select
              v-model="regForm.nisn"
              required
              class="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white"
            >
              <option v-for="s in siswaList" :key="s.nisn" :value="s.nisn">
                {{ s.nama_lengkap }} ({{ s.kelas }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Tahun Ajaran *</label>
            <select
              v-model="regForm.id_tahun_ajaran"
              required
              class="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white"
            >
              <option v-for="t in tahunAjaranList" :key="t.id_tahun_ajaran" :value="t.id_tahun_ajaran">
                {{ t.nama_tahun }} - {{ t.semester }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Jabatan *</label>
            <select
              v-model="regForm.jabatan"
              required
              class="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white"
            >
              <option value="Anggota">Anggota</option>
              <option value="Ketua">Ketua</option>
              <option value="Wakil Ketua">Wakil Ketua</option>
              <option value="Sekretaris">Sekretaris</option>
              <option value="Bendahara">Bendahara</option>
            </select>
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              @click="quickRegisterModal = false"
              class="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              Konfirmasi Daftar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
