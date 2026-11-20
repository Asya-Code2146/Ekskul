<script setup>
import { computed } from 'vue';

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  isSidebarOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggle-sidebar', 'exit-dashboard']);

const titles = {
  dashboard: {
    title: 'Ringkasan',
    subtitle: 'Ringkasan data ekstrakurikuler SMKN'
  },
  ekskul: {
    title: 'Daftar Ekstrakurikuler',
    subtitle: 'Kelola data ekstrakurikuler dan pembimbing'
  },
  anggota: {
    title: 'Manajemen Anggota',
    subtitle: 'Kelola data anggota ekstrakurikuler'
  },
  jadwal: {
    title: 'Jadwal Kegiatan',
    subtitle: 'Kelola jadwal agenda ekstrakurikuler'
  },
  presensi: {
    title: 'Presensi Kehadiran',
    subtitle: 'Catatan presensi anggota ekstrakurikuler'
  },
  prestasi: {
    title: 'Laporan & Prestasi',
    subtitle: 'Daftar capaian prestasi siswa ekstrakurikuler'
  },
  pengaturan: {
    title: 'Pengaturan Sistem',
    subtitle: 'Konfigurasi sistem informasi ekstrakurikuler'
  }
};

const currentInfo = computed(() => titles[props.activeTab] || titles.dashboard);

const currentDate = computed(() => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('id-ID', options);
});
</script>

<template>
  <header class="bg-white/90 backdrop-blur-md border-b border-[#c8cbd3] sticky top-0 z-30 shadow-xs">
    <div class="px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <button
          @click="emit('toggle-sidebar')"
          aria-label="Menu"
          class="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-[#989DAA]/40 bg-white text-[#191D23] hover:bg-slate-100 transition focus:outline-none"
        >
          <span
            :class="[
              'w-5 h-0.5 bg-[#191D23] rounded-full transition-transform duration-300 origin-center',
              isSidebarOpen ? 'translate-y-2 rotate-45' : ''
            ]"
          ></span>
          <span
            :class="[
              'w-5 h-0.5 bg-[#191D23] rounded-full transition-opacity duration-200',
              isSidebarOpen ? 'opacity-0' : 'opacity-100'
            ]"
          ></span>
          <span
            :class="[
              'w-5 h-0.5 bg-[#191D23] rounded-full transition-transform duration-300 origin-center',
              isSidebarOpen ? '-translate-y-2 -rotate-45' : ''
            ]"
          ></span>
        </button>

        <div>
          <h1 class="text-base sm:text-xl font-bold text-[#191D23] leading-tight">
            {{ currentInfo.title }}
          </h1>
          <p class="hidden sm:block text-xs text-[#57707A] font-medium truncate max-w-md">
            {{ currentInfo.subtitle }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-[#DEDCDC]/60 rounded-xl border border-[#c8cbd3] text-xs font-semibold text-[#191D23]">
          <svg class="w-4 h-4 text-[#57707A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{{ currentDate }}</span>
        </div>

        <button
          @click="emit('exit-dashboard')"
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#c8cbd3] bg-white hover:bg-slate-50 text-xs font-semibold text-[#191D23] transition"
        >
          <svg class="w-3.5 h-3.5 text-[#57707A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span>Lihat Web</span>
        </button>

        <div class="flex items-center gap-2.5 pl-2 border-l border-[#c8cbd3]">
          <div class="w-9 h-9 rounded-full bg-[#191D23] text-white flex items-center justify-center font-bold text-xs ring-2 ring-[#57707A]/40 shadow-xs">
            <svg class="w-5 h-5 text-slate-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <div class="hidden lg:block text-left">
            <div class="text-xs font-bold text-[#191D23] leading-none">Admin Ekstrakurikuler</div>
            <div class="text-[10px] text-[#57707A] font-medium mt-0.5">SMKN 5 Telkom</div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
