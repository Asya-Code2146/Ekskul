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
    subtitle: 'Ringkasan data ekstrakurikuler SMKN 5 Telkom Banda Aceh'
  },
  ekskul: {
    title: 'Daftar Ekstrakurikuler',
    subtitle: 'Kelola data unit kegiatan siswa dan pembina penanggung jawab'
  },
  anggota: {
    title: 'Manajemen Anggota',
    subtitle: 'Kelola data pendaftaran dan keanggotaan ekstrakurikuler'
  },
  jadwal: {
    title: 'Jadwal & Presensi Kegiatan',
    subtitle: 'Monitoring agenda kegiatan rutin dan catatan kehadiran'
  },
  prestasi: {
    title: 'Prestasi Siswa',
    subtitle: 'Pencatatan rekam jejak juara dan penghargaan ekskul'
  }
};

const currentInfo = computed(() => titles[props.activeTab] || titles.dashboard);

const currentDate = computed(() => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date().toLocaleDateString('id-ID', options);
});
</script>

<template>
  <header class="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
    <div class="px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <button
          @click="emit('toggle-sidebar')"
          aria-label="Menu"
          class="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 transition-all focus:outline-none"
        >
          <span
            :class="[
              'w-5 h-0.5 bg-slate-700 rounded-full transition-transform duration-300 origin-center',
              isSidebarOpen ? 'translate-y-2 rotate-45' : ''
            ]"
          ></span>
          <span
            :class="[
              'w-5 h-0.5 bg-slate-700 rounded-full transition-opacity duration-200',
              isSidebarOpen ? 'opacity-0' : 'opacity-100'
            ]"
          ></span>
          <span
            :class="[
              'w-5 h-0.5 bg-slate-700 rounded-full transition-transform duration-300 origin-center',
              isSidebarOpen ? '-translate-y-2 -rotate-45' : ''
            ]"
          ></span>
        </button>

        <div>
          <h1 class="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {{ currentInfo.title }}
          </h1>
          <p class="hidden sm:block text-xs text-slate-500 font-medium truncate max-w-md">
            {{ currentInfo.subtitle }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        <div class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600">
          <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{{ currentDate }}</span>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="emit('exit-dashboard')"
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            <span>Lihat Portal</span>
          </button>

          <div class="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div class="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-100 shadow-xs">
              AE
            </div>
            <div class="hidden lg:block text-left">
              <div class="text-xs font-bold text-slate-800 leading-none">Admin Ekskul</div>
              <div class="text-[10px] text-slate-400 font-medium mt-0.5">Administrator</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
