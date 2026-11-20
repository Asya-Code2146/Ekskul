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
            <div v-else-if="activeDashboardTab === 'pengaturan'" key="pengaturan" class="bg-white rounded-3xl p-8 border border-[#c8cbd3] shadow-xs">
              <h2 class="text-xl font-bold text-[#191D23] mb-2">Pengaturan Sistem</h2>
              <p class="text-xs text-[#57707A]">SIM-EKSKUL SMKN 5 Telkom Banda Aceh versi 1.0.0</p>
              <div class="mt-6 pt-6 border-t border-slate-100 space-y-3 text-xs text-slate-600">
                <div>Environment: Production / Cloud</div>
                <div>Status Database: Terkoneksi (MySQL Railway)</div>
                <div>Status Front-End: Terkoneksi (Vite + Tailwind CSS)</div>
              </div>
            </div>
          </transition>
        </main>
      </div>
    </div>
  </div>
</template>
