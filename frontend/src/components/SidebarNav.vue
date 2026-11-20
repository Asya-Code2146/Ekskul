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
  { id: 'dashboard', label: 'Ringkasan', icon: 'grid' },
  { id: 'ekskul', label: 'Ekstrakurikuler', icon: 'award' },
  { id: 'anggota', label: 'Anggota', icon: 'users' },
  { id: 'jadwal', label: 'Jadwal & Presensi', icon: 'calendar' },
  { id: 'prestasi', label: 'Prestasi Siswa', icon: 'trophy' }
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
      class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-300"
    ></div>

    <aside
      :class="[
        'fixed top-0 left-0 bottom-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 border-r border-slate-800 shadow-xl lg:shadow-none',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="p-5 flex flex-col h-full">
        <div class="flex items-center justify-between pb-6 border-b border-slate-800/80">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/30">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <div class="font-bold text-sm tracking-wide text-white">SIM-EKSKUL SMKN</div>
              <div class="text-[11px] text-slate-400 font-medium">SMKN 5 Banda Aceh</div>
            </div>
          </div>
          <button
            @click="emit('close-sidebar')"
            class="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="my-6">
          <div class="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">Menu Utama</div>
          <nav class="space-y-1">
            <button
              v-for="item in navItems"
              :key="item.id"
              @click="handleSelect(item.id)"
              :class="[
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition duration-200 text-left',
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              ]"
            >
              <span v-if="item.icon === 'grid'" class="w-5 h-5 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </span>
              <span v-else-if="item.icon === 'award'" class="w-5 h-5 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </span>
              <span v-else-if="item.icon === 'users'" class="w-5 h-5 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
              <span v-else-if="item.icon === 'calendar'" class="w-5 h-5 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
              <span v-else-if="item.icon === 'trophy'" class="w-5 h-5 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </span>
              <span>{{ item.label }}</span>
            </button>
          </nav>
        </div>

        <div class="mt-auto pt-4 border-t border-slate-800/80 space-y-3">
          <div class="flex items-center gap-3 px-3 py-2 bg-slate-800/50 rounded-xl border border-slate-800">
            <div class="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-bold text-xs ring-2 ring-blue-500/30">
              AD
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-xs font-semibold text-white truncate">Admin Ekskul</div>
              <div class="text-[11px] text-slate-400 truncate">Administrator</div>
            </div>
          </div>

          <button
            @click="emit('exit-dashboard')"
            class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Kembali ke Web Publik</span>
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>
