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
  </div>
</template>
