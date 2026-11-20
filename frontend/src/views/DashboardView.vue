<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api.js';

const isLoading = ref(true);
const summary = ref({
  total_ekskul: 0,
  total_anggota: 0,
  total_jadwal: 0,
  total_presensi: 0,
  anggotaPerEkskul: [],
  anggotaPerKelas: [],
  aktivitasTerbaru: []
});

const loadSummary = async () => {
  isLoading.value = true;
  try {
    const res = await api.get('/dashboard/summary');
    if (res.data.success) {
      summary.value = res.data.data;
    }
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
  } finally {
    isLoading.value = false;
  }
};

const maxBarValue = () => {
  if (!summary.value.anggotaPerEkskul.length) return 10;
  const max = Math.max(...summary.value.anggotaPerEkskul.map((item) => Number(item.total)));
  return max > 0 ? max : 10;
};

const classColors = {
  'Kelas X': '#3b82f6',
  'Kelas XI': '#10b981',
  'Kelas XII': '#f59e0b',
  Lainnya: '#94a3b8'
};

onMounted(() => {
  loadSummary();
});
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:shadow-md transition">
        <div>
          <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Ekstrakurikuler</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">{{ summary.total_ekskul }}</div>
          <div class="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>Aktif Terdaftar</span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:shadow-md transition">
        <div>
          <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Anggota Aktif</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">{{ summary.total_anggota }}</div>
          <div class="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>Siswa Tergabung</span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:shadow-md transition">
        <div>
          <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jadwal Kegiatan</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">{{ summary.total_jadwal }}</div>
          <div class="flex items-center gap-1 text-[11px] font-semibold text-blue-600 mt-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Agenda Semester Ini</span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between hover:shadow-md transition">
        <div>
          <div class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Catatan Presensi</div>
          <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">{{ summary.total_presensi }}</div>
          <div class="flex items-center gap-1 text-[11px] font-semibold text-purple-600 mt-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Total Kehadiran</span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 class="text-base sm:text-lg font-bold text-slate-900">Grafik Jumlah Anggota per Ekstrakurikuler</h2>
            <p class="text-xs text-slate-500">Statistik persebaran anggota pada masing-masing kegiatan</p>
          </div>
          <span class="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">Real-time</span>
        </div>

        <div v-if="isLoading" class="h-64 flex items-center justify-center text-slate-400 text-sm">
          Memuat data grafik...
        </div>
        <div v-else class="mt-6">
          <div v-if="summary.anggotaPerEkskul.length === 0" class="h-56 flex items-center justify-center text-slate-400 text-sm">
            Belum ada data anggota untuk ditampilkan di grafik.
          </div>
          <div v-else class="space-y-4">
            <div
              v-for="item in summary.anggotaPerEkskul"
              :key="item.nama_ekskul"
              class="space-y-1.5"
            >
              <div class="flex items-center justify-between text-xs font-semibold">
                <span class="text-slate-700 truncate max-w-[200px] sm:max-w-xs">{{ item.nama_ekskul }}</span>
                <span class="text-blue-600 font-bold">{{ item.total }} Anggota</span>
              </div>
              <div class="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                <div
                  class="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-700 ease-out"
                  :style="{ width: `${Math.max(8, (Number(item.total) / maxBarValue()) * 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
        <div class="pb-4 border-b border-slate-100">
          <h2 class="text-base sm:text-lg font-bold text-slate-900">Distribusi per Kelas</h2>
          <p class="text-xs text-slate-500">Partisipasi siswa berdasarkan tingkatan</p>
        </div>

        <div v-if="isLoading" class="h-60 flex items-center justify-center text-slate-400 text-sm">
          Memuat data...
        </div>
        <div v-else class="py-6 flex flex-col items-center justify-center">
          <div class="relative w-40 h-40 flex items-center justify-center">
            <div class="w-36 h-36 rounded-full border-8 border-slate-100 flex items-center justify-center shadow-inner">
              <div class="text-center">
                <div class="text-2xl font-black text-slate-900">{{ summary.total_anggota }}</div>
                <div class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Siswa</div>
              </div>
            </div>
          </div>

          <div class="w-full mt-6 space-y-2">
            <div
              v-for="item in summary.anggotaPerKelas"
              :key="item.tingkat"
              class="flex items-center justify-between text-xs p-2 rounded-lg hover:bg-slate-50 transition"
            >
              <div class="flex items-center gap-2">
                <span
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: classColors[item.tingkat] || '#94a3b8' }"
                ></span>
                <span class="font-medium text-slate-700">{{ item.tingkat }}</span>
              </div>
              <span class="font-bold text-slate-900">
                {{ item.total }} ({{ summary.total_anggota > 0 ? Math.round((Number(item.total) / summary.total_anggota) * 100) : 0 }}%)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 class="text-base sm:text-lg font-bold text-slate-900">Aktivitas Terbaru</h2>
          <p class="text-xs text-slate-500">Pemberitahuan pendaftaran dan pergerakan keanggotaan terkini</p>
        </div>
      </div>

      <div v-if="isLoading" class="py-8 text-center text-slate-400 text-sm">
        Memuat aktivitas...
      </div>
      <div v-else class="divide-y divide-slate-100 mt-2">
        <div
          v-for="act in summary.aktivitasTerbaru"
          :key="act.id"
          class="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/80 px-2 rounded-xl transition"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <div class="text-xs sm:text-sm font-bold text-slate-800">{{ act.judul }}</div>
              <div class="text-xs text-slate-500">{{ act.keterangan }}</div>
            </div>
          </div>
          <span class="text-[11px] font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md shrink-0">
            {{ act.tipe }}
          </span>
        </div>

        <div v-if="summary.aktivitasTerbaru.length === 0" class="py-8 text-center text-slate-400 text-xs">
          Belum ada aktivitas terekam.
        </div>
      </div>
    </div>
  </div>
</template>
