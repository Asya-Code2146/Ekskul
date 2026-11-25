<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api.js';
import { useToast } from '../services/toast.js';

const { showToast } = useToast();

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

const showAllEkskulModal = ref(false);
const catalogCategoryFilter = ref('Semua');
const catalogSearch = ref('');

const showAllDokumentasiModal = ref(false);
const selectedDokumentasiCategory = ref('Semua');

const getEkskulImage = (item) => {
  if (!item) return '/images/gedung-smkn5.jpg';
  const name = (item.nama_ekskul || '').toLowerCase();
  const cat = (item.kategori || '').toLowerCase();

  if (name.includes('robot') || name.includes('iot')) {
    return 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('futsal') || name.includes('sepak') || name.includes('bola')) {
    return 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('paskibra') || name.includes('paskib')) {
    return 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('coding') || name.includes('web') || name.includes('program') || name.includes('rpl')) {
    return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('basket')) {
    return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('pramuka')) {
    return 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('rohis') || name.includes('islam') || name.includes('agama')) {
    return 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('desain') || name.includes('dkv') || name.includes('foto') || name.includes('seni')) {
    return 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('pmr') || name.includes('palang merah') || name.includes('sehat')) {
    return 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('badminton') || name.includes('tangkis')) {
    return 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80';
  }
  if (name.includes('musik') || name.includes('band')) {
    return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80';
  }

  if (cat.includes('tekno')) {
    return 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('olahraga')) {
    return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('seni')) {
    return 'https://images.unsplash.com/photo-1460661419200-fd4358377982?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('pimpin')) {
    return 'https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=800&q=80';
  }
  if (cat.includes('agama')) {
    return 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80';
  }

  return '/images/gedung-smkn5.jpg';
};

const dokumentasiList = ref([
  {
    id: 1,
    judul: 'Juara 1 LKS Web Technologies Tingkat Provinsi',
    kategori: 'Prestasi',
    tanggal: '12 Oktober 2026',
    deskripsi: 'Siswa SMKN 5 Telkom meraih medali emas pada ajang Lomba Kompetensi Siswa (LKS) bidang Web Technologies.',
    gambar: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    judul: 'Bootcamp & Workshop Full-Stack Vue.js & Express API',
    kategori: 'Workshop',
    tanggal: '21 November 2026',
    deskripsi: 'Pelatihan intensif rekayasa perangkat lunak dan pemrograman modern untuk anggota Telkom Coding Club.',
    gambar: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    judul: 'Latihan Taktik & Uji Coba Tim Futsal Telkom FC',
    kategori: 'Olahraga',
    tanggal: '15 November 2026',
    deskripsi: 'Persiapan kejuaraan futsal antar pelajar tingkat kota di Lapangan Futsal Kick-Off Lampineung.',
    gambar: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    judul: 'Upacara Pengibaran Bendera Pasukan Paskibra SMKN 5',
    kategori: 'Kepemimpinan',
    tanggal: '17 Agustus 2026',
    deskripsi: 'Kedisiplinan dan kekompakan pleton Paskibraka SMKN 5 Telkom saat upacara peringatan kemerdekaan.',
    gambar: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    judul: 'Kontes Robotika Cerdas & Internet of Things (IoT)',
    kategori: 'Prestasi',
    tanggal: '28 Oktober 2026',
    deskripsi: 'Inovasi robot pemilah sampah otomatis karya siswa Lab Robotika & IoT SMKN 5 Telkom.',
    gambar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    judul: 'Pelatihan Jurnalistik, Fotografi & Desain Publikasi',
    kategori: 'Workshop',
    tanggal: '05 November 2026',
    deskripsi: 'Mengasah kemampuan penulisan berita, peliputan acara, dan fotografi jurnalistik sekolah.',
    gambar: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 7,
    judul: 'Kajian Rohis & Tadarus Bersama Masjid Al-Kautsar',
    kategori: 'Keagamaan',
    tanggal: '08 November 2026',
    deskripsi: 'Pembinaan karakter spiritual, akhlak mulia, dan kebersamaan remaja masjid sekolah.',
    gambar: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 8,
    judul: 'Latihan Gabungan Pramuka Penegak Bantara',
    kategori: 'Kepemimpinan',
    tanggal: '01 November 2026',
    deskripsi: 'Pengembaraan dan uji kecakapan umum (SKU) anggota pramuka gugus depan SMKN 5 Telkom.',
    gambar: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80'
  }
]);

const filteredCatalogEkskul = computed(() => {
  return ekskulList.value.filter((item) => {
    const matchCat =
      catalogCategoryFilter.value === 'Semua' ||
      item.kategori.toLowerCase() === catalogCategoryFilter.value.toLowerCase();
    const matchSearch =
      catalogSearch.value.trim() === '' ||
      item.nama_ekskul.toLowerCase().includes(catalogSearch.value.toLowerCase()) ||
      (item.nama_pembina && item.nama_pembina.toLowerCase().includes(catalogSearch.value.toLowerCase()));
    return matchCat && matchSearch;
  });
});

const filteredDokumentasi = computed(() => {
  if (selectedDokumentasiCategory.value === 'Semua') {
    return dokumentasiList.value;
  }
  return dokumentasiList.value.filter(
    (d) => d.kategori.toLowerCase() === selectedDokumentasiCategory.value.toLowerCase()
  );
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
    showToast('Pendaftaran berhasil! Selamat bergabung di ' + selectedEkskulForReg.value.nama_ekskul);
    quickRegisterModal.value = false;
    await loadLandingData();
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal mendaftar.', 'error');
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

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 w-full">
      <section id="beranda" class="relative rounded-3xl overflow-hidden shadow-xl min-h-[440px] sm:min-h-[480px] lg:min-h-[500px] flex items-center border border-[#c8cbd3]/60">
        <img
          src="/images/gedung-smkn5.jpg"
          alt="Gedung SMKN 5 Telkom Banda Aceh"
          class="absolute inset-0 w-full h-full object-cover object-center filter saturate-[0.55] brightness-[0.88] contrast-[0.95]"
        />
        <div class="absolute inset-0 bg-[#35464f]/45 mix-blend-multiply"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#191D23]/85 via-[#233138]/60 to-[#191D23]/35"></div>

        <div class="relative z-10 w-full p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-7 space-y-5 text-left">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-xs font-semibold backdrop-blur-md">
              <span>Ekstrakurikuler</span>
            </div>

            <h1 class="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
              Temukan Minat,<br />
              Kembangkan Potensi
            </h1>

            <p class="text-slate-100 text-sm sm:text-base max-w-xl leading-relaxed font-normal drop-shadow-xs">
              SIM-EKSKUL menghubungkan siswa dengan berbagai kegiatan ekstrakurikuler untuk mendukung pengembangan diri dan prestasi.
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-start gap-3 pt-2">
              <button
                @click="scrollToSection('ekskul')"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#57707A] hover:bg-[#7B919C] text-white font-semibold text-sm px-6 py-3 rounded-full shadow-lg transition cursor-pointer active:scale-95"
              >
                <span>Lihat Ekstrakurikuler</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              <button
                @click="scrollToSection('tentang')"
                class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black/20 hover:bg-black/35 text-white border border-white/35 backdrop-blur-xs font-semibold text-sm px-6 py-3 rounded-full transition cursor-pointer active:scale-95"
              >
                <span class="w-4 h-4 rounded-full border border-white/80 flex items-center justify-center">
                  <svg class="w-2 h-2 fill-white ml-0.5" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </span>
                <span>Pelajari Lebih Lanjut</span>
              </button>
            </div>
          </div>

          <div class="lg:col-span-5 space-y-3">
            <div
              @click="scrollToSection('ekskul')"
              class="p-4 rounded-2xl bg-[#191D23]/60 hover:bg-[#191D23]/75 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-between gap-4 transition duration-200 cursor-pointer group"
            >
              <div class="flex items-center gap-3.5">
                <div class="w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-white flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-slate-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-white text-sm">Beragam Pilihan</h3>
                  <p class="text-[11px] text-slate-200 mt-0.5">Pilihan kegiatan untuk berbagai minat dan bakat.</p>
                </div>
              </div>
              <svg class="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div
              @click="scrollToSection('tentang')"
              class="p-4 rounded-2xl bg-[#191D23]/60 hover:bg-[#191D23]/75 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-between gap-4 transition duration-200 cursor-pointer group"
            >
              <div class="flex items-center gap-3.5">
                <div class="w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-white flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-slate-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-white text-sm">Mudah Dikelola</h3>
                  <p class="text-[11px] text-slate-200 mt-0.5">Pendaftaran dan pengelolaan kegiatan yang efisien.</p>
                </div>
              </div>
              <svg class="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div
              @click="scrollToSection('dokumentasi')"
              class="p-4 rounded-2xl bg-[#191D23]/60 hover:bg-[#191D23]/75 backdrop-blur-md border border-white/20 shadow-xl flex items-center justify-between gap-4 transition duration-200 cursor-pointer group"
            >
              <div class="flex items-center gap-3.5">
                <div class="w-10 h-10 rounded-xl bg-white/10 border border-white/15 text-white flex items-center justify-center shrink-0">
                  <svg class="w-5 h-5 text-slate-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-bold text-white text-sm">Dokumentasi Kegiatan</h3>
                  <p class="text-[11px] text-slate-200 mt-0.5">Rekam momen kegiatan secara terstruktur dan mudah diakses.</p>
                </div>
              </div>
              <svg class="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>

    <section id="ekskul" class="py-14 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
      <div class="mb-8 text-left">
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
                :src="getEkskulImage(item)"
                :alt="item.nama_ekskul"
                class="w-full h-full object-cover opacity-90 hover:scale-105 transition duration-500"
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
          @click="showAllEkskulModal = true"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#191D23] text-[#191D23] font-bold text-xs sm:text-sm hover:bg-[#191D23] hover:text-white transition cursor-pointer"
        >
          <span>Lihat Semua Ekstrakurikuler</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </section>

    <section id="dokumentasi" class="py-14 sm:py-18 bg-[#DEDCDC]">
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
              <div class="text-xs text-[#989DAA] mt-1">SMK Negeri 5 Telkom Banda Aceh</div>
            </div>
          </div>

          <div class="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="rounded-2xl overflow-hidden bg-white shadow-sm border border-[#c8cbd3] h-48 sm:h-52">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                  alt="Bootcamp & Coding Siswa SMKN 5"
                  class="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
              <div class="rounded-2xl overflow-hidden bg-white shadow-sm border border-[#c8cbd3] h-48 sm:h-52">
                <img
                  src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80"
                  alt="Kompetisi Futsal Telkom FC"
                  class="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
              </div>
            </div>

            <div class="rounded-2xl overflow-hidden bg-white shadow-sm border border-[#c8cbd3] h-48 sm:h-56">
              <img
                src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80"
                alt="Inovasi Robotika & IoT Lab"
                class="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>

            <div class="pt-2 text-center sm:text-left">
              <button
                @click="showAllDokumentasiModal = true"
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

    <section id="tentang" class="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
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
            <div class="text-[11px] font-bold text-slate-300 mb-2.5">Media Sosial:</div>
            <div class="flex items-center gap-2.5">
              <a
                href="https://www.instagram.com/smkn5telkomaceh/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                title="Instagram @smkn5telkomaceh"
                class="w-10 h-10 rounded-full bg-[#222834] text-white flex items-center justify-center border border-white/20 transition-all duration-300 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent hover:scale-110 hover:shadow-lg shadow-sm"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>

              <a
                href="https://www.facebook.com/smkn.5.telkom.banda.aceh/?locale=id_ID"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Facebook SMK Negeri 5 Telkom Banda Aceh"
                class="w-10 h-10 rounded-full bg-[#222834] text-white flex items-center justify-center border border-white/20 transition-all duration-300 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] hover:scale-110 hover:shadow-lg shadow-sm"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>

              <a
                href="https://twitter.com/humas_smkn5_bna"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                title="X @humas_smkn5_bna"
                class="w-10 h-10 rounded-full bg-[#222834] text-white flex items-center justify-center border border-white/20 transition-all duration-300 hover:bg-white hover:text-black hover:border-white hover:scale-110 hover:shadow-lg shadow-sm"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>

              <a
                href="https://www.tiktok.com/@smkn5telkomaceh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                title="TikTok @smkn5telkomaceh"
                class="w-10 h-10 rounded-full bg-[#222834] text-white flex items-center justify-center border border-white/20 transition-all duration-300 hover:bg-black hover:text-[#00f2fe] hover:border-[#fe2c55] hover:scale-110 hover:shadow-lg shadow-sm"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/company/smkn-5-telkom-banda-aceh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn SMK Negeri 5 Telkom Banda Aceh"
                class="w-10 h-10 rounded-full bg-[#222834] text-white flex items-center justify-center border border-white/20 transition-all duration-300 hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] hover:scale-110 hover:shadow-lg shadow-sm"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

              <a
                href="mailto:smkn5telkombandaaceh@gmail.com"
                aria-label="Email"
                title="Email smkn5telkombandaaceh@gmail.com"
                class="w-10 h-10 rounded-full bg-[#222834] text-white flex items-center justify-center border border-white/20 transition-all duration-300 hover:bg-[#EA4335] hover:text-white hover:border-[#EA4335] hover:scale-110 hover:shadow-lg shadow-sm"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
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

    <div
      v-if="showAllEkskulModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
    >
      <div class="bg-white rounded-3xl shadow-2xl border border-[#c8cbd3] w-full max-w-4xl max-h-[90vh] flex flex-col p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between pb-4 border-b border-[#DEDCDC]">
          <div>
            <div class="text-xs font-bold uppercase tracking-wider text-[#57707A]">KATALOG RESMI</div>
            <h3 class="text-lg sm:text-xl font-black text-[#191D23]">Seluruh Ekstrakurikuler SMKN 5 Telkom</h3>
          </div>
          <button
            @click="showAllEkskulModal = false"
            class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="py-4 space-y-3">
          <input
            v-model="catalogSearch"
            type="text"
            placeholder="Cari ekstrakurikuler atau nama pembimbing..."
            class="w-full px-4 py-2.5 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
          />

          <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              v-for="cat in ['Semua', 'Teknologi', 'Olahraga', 'Kepemimpinan', 'Seni', 'Keagamaan']"
              :key="cat"
              @click="catalogCategoryFilter = cat"
              :class="[
                'px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer shrink-0',
                catalogCategoryFilter === cat
                  ? 'bg-[#191D23] text-white shadow-xs'
                  : 'bg-slate-100 text-[#57707A] hover:bg-slate-200'
              ]"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto pr-1">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="item in filteredCatalogEkskul"
              :key="item.id_ekskul"
              class="rounded-2xl border border-[#c8cbd3] overflow-hidden bg-white hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div class="h-32 bg-[#57707A] relative overflow-hidden">
                  <img
                    :src="getEkskulImage(item)"
                    :alt="item.nama_ekskul"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <span class="absolute top-2.5 left-2.5 bg-[#191D23]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {{ item.kategori }}
                  </span>
                </div>
                <div class="p-4">
                  <h4 class="font-bold text-[#191D23] text-sm">{{ item.nama_ekskul }}</h4>
                  <p class="text-xs text-[#57707A] mt-1 line-clamp-2">
                    Pengembangan bakat siswa untuk menunjang prestasi akademik dan non-akademik.
                  </p>
                  <div class="mt-3 text-[11px] text-[#7B919C] space-y-1">
                    <div>Pembina: <span class="font-semibold text-slate-700">{{ item.nama_pembina }}</span></div>
                    <div>Peserta: <span class="font-semibold text-slate-700">{{ item.total_anggota || 0 }} Siswa</span></div>
                  </div>
                </div>
              </div>

              <div class="p-4 pt-0">
                <button
                  @click="showAllEkskulModal = false; openQuickRegister(item)"
                  class="w-full py-2 rounded-xl bg-[#191D23] hover:bg-[#57707A] text-white text-xs font-semibold transition cursor-pointer"
                >
                  Daftar Sekarang
                </button>
              </div>
            </div>
          </div>

          <div v-if="filteredCatalogEkskul.length === 0" class="py-12 text-center text-xs text-slate-400">
            Tidak ada ekstrakurikuler yang sesuai dengan pencarian.
          </div>
        </div>

        <div class="pt-4 mt-2 border-t border-[#DEDCDC] flex justify-end">
          <button
            @click="showAllEkskulModal = false"
            class="px-5 py-2 rounded-full border border-[#989DAA] text-[#191D23] text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showAllDokumentasiModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
    >
      <div class="bg-white rounded-3xl shadow-2xl border border-[#c8cbd3] w-full max-w-5xl max-h-[90vh] flex flex-col p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between pb-4 border-b border-[#DEDCDC]">
          <div>
            <div class="text-xs font-bold uppercase tracking-wider text-[#57707A]">GALERI KEGIATAN</div>
            <h3 class="text-lg sm:text-xl font-black text-[#191D23]">Dokumentasi Lengkap Siswa SMKN 5 Telkom Banda Aceh</h3>
          </div>
          <button
            @click="showAllDokumentasiModal = false"
            class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="py-4">
          <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              v-for="cat in ['Semua', 'Prestasi', 'Workshop', 'Olahraga', 'Kepemimpinan', 'Keagamaan']"
              :key="cat"
              @click="selectedDokumentasiCategory = cat"
              :class="[
                'px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer shrink-0',
                selectedDokumentasiCategory === cat
                  ? 'bg-[#191D23] text-white shadow-xs'
                  : 'bg-slate-100 text-[#57707A] hover:bg-slate-200'
              ]"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto pr-1">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div
              v-for="doc in filteredDokumentasi"
              :key="doc.id"
              class="rounded-2xl border border-[#c8cbd3] overflow-hidden bg-white hover:shadow-lg transition group"
            >
              <div class="h-44 overflow-hidden relative">
                <img
                  :src="doc.gambar"
                  :alt="doc.judul"
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <span class="absolute top-2.5 left-2.5 bg-[#191D23]/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-md backdrop-blur-xs">
                  {{ doc.kategori }}
                </span>
                <span class="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[10px] font-medium px-2 py-0.5 rounded-md backdrop-blur-xs">
                  {{ doc.tanggal }}
                </span>
              </div>
              <div class="p-4 space-y-1.5">
                <h4 class="font-bold text-[#191D23] text-sm leading-snug">{{ doc.judul }}</h4>
                <p class="text-xs text-[#57707A] leading-relaxed line-clamp-2">
                  {{ doc.deskripsi }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="filteredDokumentasi.length === 0" class="py-12 text-center text-xs text-slate-400">
            Tidak ada dokumentasi untuk kategori ini.
          </div>
        </div>

        <div class="pt-4 mt-2 border-t border-[#DEDCDC] flex justify-end">
          <button
            @click="showAllDokumentasiModal = false"
            class="px-5 py-2 rounded-full bg-[#191D23] hover:bg-[#57707A] text-white text-xs font-semibold transition cursor-pointer"
          >
            Tutup Galeri
          </button>
        </div>
      </div>
    </div>
  </div>
</template>