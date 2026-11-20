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

onMounted(() => {
  loadLandingData();
});
</script>

<template>
  <div class="min-h-screen bg-[#DEDCDC] text-[#191D23] flex flex-col font-sans selection:bg-[#57707A] selection:text-white">
    <header class="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-[#c8cbd3] shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#191D23] flex items-center justify-center text-white shadow-md">
            <svg class="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm0 4.5l1.55 3.14 3.47.5-2.51 2.45.59 3.46L12 14.42l-3.1 1.63.59-3.46-2.51-2.45 3.47-.5L12 6.5z"/>
            </svg>
          </div>
          <div>
            <div class="font-extrabold text-[#191D23] tracking-tight text-sm sm:text-base leading-none">
              SIM-EKSKUL
            </div>
            <div class="text-[11px] text-[#57707A] font-medium mt-0.5">Sistem Informasi Ekstrakurikuler Sekolah</div>
          </div>
        </div>

        <nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-[#191D23]">
          <button @click="scrollToSection('beranda')" class="hover:text-[#57707A] transition cursor-pointer">Beranda</button>
          <button @click="scrollToSection('ekskul')" class="hover:text-[#57707A] transition cursor-pointer">Ekstrakurikuler</button>
          <button @click="scrollToSection('dokumentasi')" class="hover:text-[#57707A] transition cursor-pointer">Dokumentasi</button>
          <button @click="scrollToSection('tentang')" class="hover:text-[#57707A] transition cursor-pointer">Tentang</button>
          <button @click="scrollToSection('kontak')" class="hover:text-[#57707A] transition cursor-pointer">Kontak</button>
        </nav>

        <div class="hidden sm:flex items-center gap-3">
          <button
            @click="emit('enter-dashboard')"
            class="inline-flex items-center gap-2 bg-[#191D23] hover:bg-[#57707A] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full transition shadow-md active:scale-95 cursor-pointer"
          >
            <span>Masuk</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          aria-label="Toggle Menu"
          class="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[#989DAA]/40 bg-white text-[#191D23]"
        >
          <span
            :class="[
              'w-5 h-0.5 bg-[#191D23] rounded-full transition-transform duration-300',
              mobileMenuOpen ? 'translate-y-2 rotate-45' : ''
            ]"
          ></span>
          <span
            :class="[
              'w-5 h-0.5 bg-[#191D23] rounded-full transition-opacity duration-200',
              mobileMenuOpen ? 'opacity-0' : 'opacity-100'
            ]"
          ></span>
          <span
            :class="[
              'w-5 h-0.5 bg-[#191D23] rounded-full transition-transform duration-300',
              mobileMenuOpen ? '-translate-y-2 -rotate-45' : ''
            ]"
          ></span>
        </button>
      </div>

      <div
        v-if="mobileMenuOpen"
        class="md:hidden border-t border-[#c8cbd3] bg-white px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200"
      >
        <button
          @click="scrollToSection('beranda')"
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#191D23] hover:bg-[#DEDCDC]"
        >
          Beranda
        </button>
        <button
          @click="scrollToSection('ekskul')"
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#191D23] hover:bg-[#DEDCDC]"
        >
          Ekstrakurikuler
        </button>
        <button
          @click="scrollToSection('dokumentasi')"
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#191D23] hover:bg-[#DEDCDC]"
        >
          Dokumentasi
        </button>
        <button
          @click="scrollToSection('tentang')"
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#191D23] hover:bg-[#DEDCDC]"
        >
          Tentang
        </button>
        <button
          @click="scrollToSection('kontak')"
          class="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#191D23] hover:bg-[#DEDCDC]"
        >
          Kontak
        </button>
        <div class="pt-2 border-t border-[#c8cbd3]">
          <button
            @click="emit('enter-dashboard')"
            class="w-full flex items-center justify-center gap-2 bg-[#191D23] text-white font-semibold py-2.5 rounded-full text-sm shadow-md"
          >
            <span>Masuk Panel Pengelola</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <section id="beranda" class="relative overflow-hidden bg-[#191D23] text-white py-16 sm:py-24 lg:py-28">
      <div class="absolute inset-0 z-0 opacity-20">
        <img
          src="/images/gedung-smkn5.jpg"
          alt="Gedung SMKN 5 Telkom Banda Aceh"
          class="w-full h-full object-cover object-center grayscale contrast-125"
        />
      </div>
      <div class="absolute inset-0 bg-gradient-to-r from-[#191D23] via-[#191D23]/95 to-[#191D23]/80 z-0"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-slate-200 text-xs font-semibold backdrop-blur-xs">
            <span>Ekstrakurikuler</span>
          </div>

          <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            Temukan Minat,<br />
            Kembangkan Potensi
          </h1>

          <p class="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
            SIM-EKSKUL menghubungkan siswa dengan berbagai kegiatan ekstrakurikuler untuk mendukung pengembangan diri dan prestasi.
          </p>

          <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              @click="scrollToSection('ekskul')"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#57707A] hover:bg-[#7B919C] text-white font-semibold text-sm px-6 py-3 rounded-full shadow-lg transition cursor-pointer"
            >
              <span>Lihat Ekstrakurikuler</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button
              @click="scrollToSection('tentang')"
              class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent hover:bg-white/10 text-white border border-white/30 font-semibold text-sm px-6 py-3 rounded-full transition cursor-pointer"
            >
              <span>Pelajari Lebih Lanjut</span>
            </button>
          </div>
        </div>

        <div class="lg:col-span-5 space-y-3.5">
          <div
            @click="scrollToSection('ekskul')"
            class="p-4 rounded-2xl bg-[#21262f]/80 hover:bg-[#282f38] border border-white/10 shadow-xl flex items-center justify-between gap-4 transition duration-200 cursor-pointer group"
          >
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-white text-sm">Beragam Pilihan</h3>
                <p class="text-[11px] text-slate-300 mt-0.5">Pilihan kegiatan untuk berbagai minat dan bakat.</p>
              </div>
            </div>
            <svg class="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div
            @click="scrollToSection('tentang')"
            class="p-4 rounded-2xl bg-[#21262f]/80 hover:bg-[#282f38] border border-white/10 shadow-xl flex items-center justify-between gap-4 transition duration-200 cursor-pointer group"
          >
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-white text-sm">Mudah Dikelola</h3>
                <p class="text-[11px] text-slate-300 mt-0.5">Pendaftaran dan pengelolaan kegiatan yang efisien.</p>
              </div>
            </div>
            <svg class="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>

          <div
            @click="scrollToSection('dokumentasi')"
            class="p-4 rounded-2xl bg-[#21262f]/80 hover:bg-[#282f38] border border-white/10 shadow-xl flex items-center justify-between gap-4 transition duration-200 cursor-pointer group"
          >
            <div class="flex items-center gap-3.5">
              <div class="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0">
                <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-white text-sm">Dokumentasi Kegiatan</h3>
                <p class="text-[11px] text-slate-300 mt-0.5">Rekam momen kegiatan secara terstruktur dan mudah diakses.</p>
              </div>
            </div>
            <svg class="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <section id="ekskul" class="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div class="mb-10 text-left">
        <div class="text-xs font-bold uppercase tracking-wider text-[#57707A] mb-1">EKSTRAKURIKULER</div>
        <h2 class="text-2xl sm:text-3xl font-black text-[#191D23] tracking-tight">Beragam Pilihan Kegiatan</h2>
        <p class="text-xs sm:text-sm text-[#57707A] mt-1.5">
          Pilih kegiatan yang sesuai dengan minat, bakat, dan tujuanmu.
        </p>
      </div>

      <div v-if="isLoading" class="text-center py-12 text-[#989DAA] text-sm">
        Memuat daftar kegiatan ekstrakurikuler...
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in ekskulList"
          :key="item.id_ekskul"
          class="bg-white rounded-2xl border border-[#c8cbd3] overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
        >
          <div>
            <div class="h-44 bg-[#57707A] relative overflow-hidden flex items-center justify-center">
              <img
                src="/images/gedung-smkn5.jpg"
                :alt="item.nama_ekskul"
                class="w-full h-full object-cover opacity-85 hover:scale-105 transition duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <span class="absolute top-3 left-3 bg-[#191D23]/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                {{ item.kategori }}
              </span>
            </div>

            <div class="p-5">
              <h3 class="text-base sm:text-lg font-bold text-[#191D23] mb-1.5">
                {{ item.nama_ekskul }}
              </h3>
              <p class="text-xs text-[#57707A] leading-relaxed line-clamp-2">
                Program pembinaan ekstrakurikuler untuk mengasah bakat dan keterampilan siswa berprestasi.
              </p>

              <div class="flex items-center gap-3 text-xs text-[#7B919C] mt-3 font-medium">
                <span class="flex items-center gap-1">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{{ item.total_anggota || 0 }} Peserta</span>
                </span>
                <span>•</span>
                <span class="truncate">Pembina: {{ item.nama_pembina }}</span>
              </div>
            </div>
          </div>

          <div class="px-5 pb-5 pt-0">
            <button
              @click="openQuickRegister(item)"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#191D23] hover:bg-[#57707A] text-white text-xs font-semibold transition cursor-pointer"
            >
              <span>Daftar</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div class="text-center mt-10">
        <button
          @click="emit('enter-dashboard')"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#191D23] text-[#191D23] font-bold text-xs sm:text-sm hover:bg-[#191D23] hover:text-white transition cursor-pointer"
        >
          <span>Lihat Semua Ekstrakurikuler</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </section>

    <section id="dokumentasi" class="py-16 sm:py-20 bg-[#DEDCDC]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div class="lg:col-span-5 bg-[#191D23] text-white rounded-3xl p-8 sm:p-10 flex flex-col justify-between shadow-xl">
            <div>
              <div class="text-xs font-bold uppercase tracking-wider text-[#989DAA] mb-2">DOKUMENTASI</div>
              <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-4">
                Dokumentasi Kegiatan
              </h2>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Rekam momen berharga dari kegiatan ekstrakurikuler yang penuh makna.
              </p>
            </div>

            <div class="pt-10 mt-10 border-t border-white/10">
              <div class="text-lg font-bold text-white">Olimpiade Sains & Bootcamp</div>
              <div class="text-xs text-[#989DAA] mt-1">SMKN 5 Telkom Banda Aceh</div>
            </div>
          </div>

          <div class="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="rounded-2xl overflow-hidden bg-white shadow-sm border border-[#c8cbd3] h-48 sm:h-52">
                <img
                  src="/images/gedung-smkn5.jpg"
                  alt="Kegiatan 1"
                  class="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div class="rounded-2xl overflow-hidden bg-white shadow-sm border border-[#c8cbd3] h-48 sm:h-52">
                <img
                  src="/images/gedung-smkn5.jpg"
                  alt="Kegiatan 2"
                  class="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
            </div>

            <div class="rounded-2xl overflow-hidden bg-white shadow-sm border border-[#c8cbd3] h-48 sm:h-56">
              <img
                src="/images/gedung-smkn5.jpg"
                alt="Kegiatan Bersama"
                class="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>

            <div class="pt-2 text-center sm:text-left">
              <button
                @click="emit('enter-dashboard')"
                class="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-[#191D23] text-[#191D23] font-bold text-xs sm:text-sm hover:bg-[#191D23] hover:text-white transition cursor-pointer"
              >
                <span>Lihat Semua Dokumentasi</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="tentang" class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div class="bg-[#191D23] text-white rounded-3xl p-8 sm:p-12 shadow-2xl">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-5 space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white mb-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
              Mendukung Pengembangan Potensi Setiap Siswa
            </h2>
          </div>

          <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 lg:pt-0">
            <div class="space-y-2">
              <div class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white mb-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 class="font-bold text-sm text-white">Prestasi</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Dukung siswa meraih prestasi terbaik di setiap ajang kompetisi.
              </p>
            </div>

            <div class="space-y-2">
              <div class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white mb-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 class="font-bold text-sm text-white">Karakter</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Bangun karakter yang tangguh, disiplin, dan berintegritas tinggi.
              </p>
            </div>

            <div class="space-y-2">
              <div class="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white mb-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 class="font-bold text-sm text-white">Kebersamaan</h3>
              <p class="text-xs text-slate-300 leading-relaxed">
                Tumbuh bersama dalam lingkungan ekstrakurikuler yang positif.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer id="kontak" class="bg-[#191D23] text-slate-300 py-14 mt-auto border-t border-[#2a303a]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div class="space-y-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <svg class="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm0 4.5l1.55 3.14 3.47.5-2.51 2.45.59 3.46L12 14.42l-3.1 1.63.59-3.46-2.51-2.45 3.47-.5L12 6.5z"/>
              </svg>
            </div>
            <span class="font-bold text-white text-base tracking-wide">SIM-EKSKUL</span>
          </div>
          <div class="text-xs text-[#989DAA] font-semibold">Sistem Informasi Ekstrakurikuler Sekolah</div>
          <p class="text-xs text-slate-400 leading-relaxed">
            SIM-EKSKUL membantu sekolah mengelola kegiatan ekstrakurikuler secara efisien dan menyeluruh.
          </p>
          <div class="text-xs text-slate-400 pt-2">
            © 2026 SMKN 5 Telkom Banda Aceh.
          </div>
        </div>

        <div>
          <div class="text-xs font-bold uppercase tracking-wider text-white mb-3">Tujuan Cepat</div>
          <ul class="space-y-2 text-xs text-slate-400">
            <li><button @click="scrollToSection('beranda')" class="hover:text-white transition cursor-pointer">Beranda</button></li>
            <li><button @click="scrollToSection('ekskul')" class="hover:text-white transition cursor-pointer">Ekstrakurikuler</button></li>
            <li><button @click="scrollToSection('dokumentasi')" class="hover:text-white transition cursor-pointer">Dokumentasi</button></li>
            <li><button @click="scrollToSection('tentang')" class="hover:text-white transition cursor-pointer">Tentang</button></li>
            <li><button @click="scrollToSection('kontak')" class="hover:text-white transition cursor-pointer">Kontak</button></li>
          </ul>
        </div>

        <div>
          <div class="text-xs font-bold uppercase tracking-wider text-white mb-3">Dukungan</div>
          <ul class="space-y-2 text-xs text-slate-400">
            <li><span class="hover:text-white transition cursor-pointer">Bantuan</span></li>
            <li><span class="hover:text-white transition cursor-pointer">FAQ</span></li>
            <li><span class="hover:text-white transition cursor-pointer">Panduan Pengguna</span></li>
            <li><span class="hover:text-white transition cursor-pointer">Syarat & Ketentuan</span></li>
            <li><span class="hover:text-white transition cursor-pointer">Kebijakan Privasi</span></li>
          </ul>
        </div>

        <div class="space-y-3">
          <div class="text-xs font-bold uppercase tracking-wider text-white mb-3">Kontak & Sosmed Resmi</div>
          <div class="text-xs text-slate-400 space-y-1.5 leading-relaxed">
            <div class="font-semibold text-slate-200">SMK Negeri 5 Telkom Banda Aceh</div>
            <div>Jl. Stadion H. Dimurthala No. 1, Lampineung, Banda Aceh 23126</div>
            <div class="text-slate-300">Email: smkn5telkombandaaceh@gmail.com</div>
          </div>

          <div class="pt-2">
            <div class="text-[11px] font-bold text-slate-300 mb-2">Media Sosial:</div>
            <div class="flex flex-wrap gap-2 text-xs">
              <a
                href="https://www.instagram.com/smkn5telkomaceh/"
                target="_blank"
                rel="noopener noreferrer"
                class="px-2.5 py-1 rounded-md bg-white/10 hover:bg-[#57707A] text-slate-200 transition"
              >
                Instagram: @smkn5telkomaceh
              </a>
              <a
                href="https://www.facebook.com/smkn.5.telkom.banda.aceh/?locale=id_ID"
                target="_blank"
                rel="noopener noreferrer"
                class="px-2.5 py-1 rounded-md bg-white/10 hover:bg-[#57707A] text-slate-200 transition"
              >
                Facebook
              </a>
              <a
                href="https://www.linkedin.com/company/smkn-5-telkom-banda-aceh"
                target="_blank"
                rel="noopener noreferrer"
                class="px-2.5 py-1 rounded-md bg-white/10 hover:bg-[#57707A] text-slate-200 transition"
              >
                LinkedIn
              </a>
              <span class="px-2.5 py-1 rounded-md bg-white/10 text-slate-200">
                TikTok: @smkn5telkomaceh
              </span>
              <span class="px-2.5 py-1 rounded-md bg-white/10 text-slate-200">
                X / Twitter: @humas_smkn5_bna
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <div
      v-if="quickRegisterModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
    >
      <div class="bg-white rounded-3xl shadow-2xl border border-[#c8cbd3] w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between pb-4 border-b border-[#DEDCDC]">
          <div>
            <h3 class="text-base font-bold text-[#191D23]">Form Pendaftaran Anggota</h3>
            <p class="text-xs text-[#57707A] font-semibold">{{ selectedEkskulForReg?.nama_ekskul }}</p>
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
            <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Pilih Data Siswa *</label>
            <select
              v-model="regForm.nisn"
              required
              class="w-full border border-[#989DAA]/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white"
            >
              <option v-for="s in siswaList" :key="s.nisn" :value="s.nisn">
                {{ s.nama_lengkap }} ({{ s.kelas }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Tahun Ajaran *</label>
            <select
              v-model="regForm.id_tahun_ajaran"
              required
              class="w-full border border-[#989DAA]/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white"
            >
              <option v-for="t in tahunAjaranList" :key="t.id_tahun_ajaran" :value="t.id_tahun_ajaran">
                {{ t.nama_tahun }} - {{ t.semester }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Jabatan *</label>
            <select
              v-model="regForm.jabatan"
              required
              class="w-full border border-[#989DAA]/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white"
            >
              <option value="Anggota">Anggota</option>
              <option value="Ketua">Ketua</option>
              <option value="Wakil Ketua">Wakil Ketua</option>
              <option value="Sekretaris">Sekretaris</option>
              <option value="Bendahara">Bendahara</option>
            </select>
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t border-[#DEDCDC]">
            <button
              type="button"
              @click="quickRegisterModal = false"
              class="px-5 py-2.5 rounded-full border border-[#989DAA] text-[#191D23] text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-6 py-2.5 rounded-full bg-[#191D23] text-white text-xs font-semibold hover:bg-[#57707A] transition cursor-pointer"
            >
              Konfirmasi Daftar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
