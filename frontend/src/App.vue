<script setup>
import { ref } from 'vue';
import SidebarNav from './components/SidebarNav.vue';
import NavbarApp from './components/NavbarApp.vue';
import LandingView from './views/LandingView.vue';
import DashboardView from './views/DashboardView.vue';
import EkskulView from './views/EkskulView.vue';
import AnggotaView from './views/AnggotaView.vue';
import PrestasiView from './views/PrestasiView.vue';
import JadwalView from './views/JadwalView.vue';
import PengaturanView from './views/PengaturanView.vue';
import { useToast } from './services/toast.js';

const { toastState, closeToast } = useToast();

const currentMode = ref('landing');
const activeDashboardTab = ref('dashboard');
const isSidebarOpen = ref(false);

const handleEnterDashboard = () => {
  currentMode.value = 'dashboard';
  activeDashboardTab.value = 'dashboard';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleExitDashboard = () => {
  currentMode.value = 'landing';
  isSidebarOpen.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleTabChange = (tab) => {
  activeDashboardTab.value = tab;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <div class="min-h-screen bg-[#DEDCDC] text-[#191D23] font-sans antialiased selection:bg-[#57707A] selection:text-white">
    <LandingView
      v-if="currentMode === 'landing'"
      @enter-dashboard="handleEnterDashboard"
    />

    <div v-else class="min-h-screen flex flex-col lg:pl-64 transition-all duration-300">
      <SidebarNav
        :active-tab="activeDashboardTab"
        :is-open="isSidebarOpen"
        @change-tab="handleTabChange"
        @close-sidebar="isSidebarOpen = false"
        @exit-dashboard="handleExitDashboard"
      />

      <div class="flex-1 flex flex-col min-w-0">
        <NavbarApp
          :active-tab="activeDashboardTab"
          :is-sidebar-open="isSidebarOpen"
          @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
          @exit-dashboard="handleExitDashboard"
        />

        <main class="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <transition mode="out-in" enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 translate-y-1" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
            <DashboardView v-if="activeDashboardTab === 'dashboard'" key="dashboard" />
            <EkskulView v-else-if="activeDashboardTab === 'ekskul'" key="ekskul" />
            <AnggotaView v-else-if="activeDashboardTab === 'anggota'" key="anggota" />
            <JadwalView v-else-if="activeDashboardTab === 'jadwal' || activeDashboardTab === 'presensi'" key="jadwal" />
            <PrestasiView v-else-if="activeDashboardTab === 'prestasi'" key="prestasi" />
            <PengaturanView v-else-if="activeDashboardTab === 'pengaturan'" key="pengaturan" />
          </transition>
        </main>
      </div>
    </div>

    <transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-4 opacity-0 sm:translate-y-0 sm:translate-x-4"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toastState.show"
        class="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-xs sm:text-sm font-semibold max-w-sm backdrop-blur-md"
        :class="toastState.type === 'error' ? 'bg-[#191D23] text-rose-300 border-rose-500/50' : 'bg-[#191D23] text-emerald-300 border-emerald-500/50'"
      >
        <span class="w-2.5 h-2.5 rounded-full shrink-0" :class="toastState.type === 'error' ? 'bg-rose-500' : 'bg-emerald-400'"></span>
        <span class="flex-1 text-white">{{ toastState.message }}</span>
        <button @click="closeToast" class="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </transition>
  </div>
</template>
