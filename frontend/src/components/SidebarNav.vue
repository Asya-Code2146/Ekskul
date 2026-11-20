<script setup>
defineProps({
  activeTab: {
    type: String,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['change-tab', 'close-sidebar', 'exit-dashboard']);

const navItems = [
  { id: 'dashboard', label: 'Ringkasan', icon: 'home' },
  { id: 'ekskul', label: 'Ekstrakurikuler', icon: 'edit' },
  { id: 'anggota', label: 'Anggota', icon: 'users' },
  { id: 'jadwal', label: 'Jadwal Kegiatan', icon: 'calendar' },
  { id: 'presensi', label: 'Presensi', icon: 'check-square' },
  { id: 'prestasi', label: 'Laporan & Prestasi', icon: 'bar-chart' },
  { id: 'pengaturan', label: 'Pengaturan', icon: 'settings' }
];

const handleSelect = (id) => {
  emit('change-tab', id);
  emit('close-sidebar');
};
</script>

<template>
  <div>
    <div
      v-if="isOpen"
      @click="emit('close-sidebar')"
      class="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
    ></div>

    <aside
      :class="[
        'fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#191D23] text-slate-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-[#282f38] shadow-2xl lg:shadow-none',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="p-5 flex flex-col h-full overflow-y-auto">
        <div class="flex items-center justify-between pb-5 border-b border-[#2a303a]">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-transparent border-2 border-white/80 flex items-center justify-center text-white shadow-sm">
              <svg class="w-6 h-6 fill-white" viewBox="0 0 24 24">
                <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3zm0 4.5l1.55 3.14 3.47.5-2.51 2.45.59 3.46L12 14.42l-3.1 1.63.59-3.46-2.51-2.45 3.47-.5L12 6.5z"/>
              </svg>
            </div>
            <div>
              <div class="font-extrabold text-sm tracking-wider text-white">SIM-EKSKUL SMKN</div>
              <div class="text-[11px] text-[#989DAA] font-medium">Sistem Informasi Ekstrakurikuler</div>
            </div>
          </div>
          <button
            @click="emit('close-sidebar')"
            class="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#282f38] transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav class="space-y-1.5 my-6">
          <button
            v-for="item in navItems"
            :key="item.id"
            @click="handleSelect(item.id)"
            :class="[
              'w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition duration-200 text-left cursor-pointer',
              activeTab === item.id
                ? 'bg-[#57707A] text-white shadow-md font-semibold'
                : 'text-slate-300 hover:bg-[#282f38] hover:text-white'
            ]"
          >
            <span v-if="item.icon === 'home'" class="w-5 h-5 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </span>
            <span v-else-if="item.icon === 'edit'" class="w-5 h-5 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </span>
            <span v-else-if="item.icon === 'users'" class="w-5 h-5 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
            <span v-else-if="item.icon === 'calendar'" class="w-5 h-5 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            <span v-else-if="item.icon === 'check-square'" class="w-5 h-5 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span v-else-if="item.icon === 'bar-chart'" class="w-5 h-5 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
            <span v-else-if="item.icon === 'settings'" class="w-5 h-5 flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            <span>{{ item.label }}</span>
          </button>
        </nav>

        <div class="mt-auto pt-4 border-t border-[#2a303a] space-y-3">
          <div class="flex items-center gap-3 px-3 py-2 bg-[#21262f] rounded-xl border border-[#2e3541]">
            <div class="w-9 h-9 rounded-full bg-[#57707A] text-white flex items-center justify-center font-bold text-xs ring-2 ring-white/10">
              AE
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs font-bold text-white truncate">Admin Ekskul</div>
              <div class="text-[10px] text-[#989DAA] truncate">Administrator</div>
            </div>
          </div>

          <button
            @click="emit('exit-dashboard')"
            class="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:bg-[#282f38] hover:text-white transition cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Keluar</span>
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>
