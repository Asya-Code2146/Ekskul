<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api.js';

const isLoading = ref(true);
const summary = ref({
  total_ekskul: 4,
  total_anggota: 4,
  total_jadwal: 2,
  total_presensi: 2,
  anggotaPerEkskul: [],
  anggotaPerKelas: [],
  aktivitasTerbaru: []
});

const defaultEkskulBars = [
  { nama: 'Basket', total: 145 },
  { nama: 'Futsal', total: 132 },
  { nama: 'Voli', total: 118 },
  { nama: 'Bulu Tangkis', total: 107 },
  { nama: 'Paskibra', total: 98 },
  { nama: 'Pramuka', total: 94 },
  { nama: 'Rohis', total: 94 },
  { nama: 'PMR', total: 87 },
  { nama: 'English Club', total: 76 },
  { nama: 'Karya Ilmiah', total: 68 },
  { nama: 'Teater', total: 59 },
  { nama: 'Seni Musik', total: 48 }
];

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

const displayEkskulBars = () => {
  if (summary.value.anggotaPerEkskul && summary.value.anggotaPerEkskul.length > 0) {
    return summary.value.anggotaPerEkskul.map((item) => ({
      nama: item.nama_ekskul,
      total: Number(item.total) || 1
    }));
  }
  return defaultEkskulBars;
};

onMounted(() => {
  loadSummary();
});
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-[#c8cbd3] shadow-xs flex items-center justify-between">
        <div>
          <div class="text-xs font-semibold text-[#57707A]">Total Ekstrakurikuler</div>
          <div class="text-2xl sm:text-3xl font-black text-[#191D23] mt-1">{{ summary.total_ekskul || 12 }}</div>
          <div class="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
            <span>↑ 10% dari bulan lalu</span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-[#57707A]/15 text-[#57707A] flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-[#c8cbd3] shadow-xs flex items-center justify-between">
        <div>
          <div class="text-xs font-semibold text-[#57707A]">Anggota Aktif</div>
          <div class="text-2xl sm:text-3xl font-black text-[#191D23] mt-1">1,248</div>
          <div class="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
            <span>↑ 5% dari bulan lalu</span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-[#57707A]/15 text-[#57707A] flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-[#c8cbd3] shadow-xs flex items-center justify-between">
        <div>
          <div class="text-xs font-semibold text-[#57707A]">Jadwal Kegiatan</div>
          <div class="text-2xl sm:text-3xl font-black text-[#191D23] mt-1">32</div>
          <div class="flex items-center gap-1 text-[11px] font-semibold text-red-500 mt-1">
            <span>↓ 8% dari bulan lalu</span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-[#57707A]/15 text-[#57707A] flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-[#c8cbd3] shadow-xs flex items-center justify-between">
        <div>
          <div class="text-xs font-semibold text-[#57707A]">Presensi Hari Ini</div>
          <div class="text-2xl sm:text-3xl font-black text-[#191D23] mt-1">94%</div>
          <div class="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
            <span>↑ 3% dari kemarin</span>
          </div>
        </div>
        <div class="w-12 h-12 rounded-xl bg-[#57707A]/15 text-[#57707A] flex items-center justify-center">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#c8cbd3] shadow-xs">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 class="text-base font-bold text-[#191D23]">Grafik Jumlah Anggota per Ekstrakurikuler</h2>
            <p class="text-xs text-[#57707A]">Persebaran jumlah anggota aktif divisi</p>
          </div>
          <button class="text-slate-400 hover:text-slate-600">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        <div class="pt-6">
          <div class="h-60 flex items-end gap-2 sm:gap-3 justify-between overflow-x-auto pb-4">
            <div
              v-for="item in displayEkskulBars()"
              :key="item.nama"
              class="flex flex-col items-center gap-2 flex-1 min-w-[36px]"
            >
              <div class="text-[10px] font-bold text-[#57707A]">{{ item.total }}</div>
              <div class="w-full max-w-[28px] bg-slate-100 rounded-t-lg h-44 flex items-end">
                <div
                  class="w-full bg-[#57707A] hover:bg-[#191D23] rounded-t-lg transition-all duration-500 cursor-pointer"
                  :style="{ height: `${Math.min(100, Math.max(12, (item.total / 150) * 100))}%` }"
                ></div>
              </div>
              <div class="text-[10px] font-semibold text-[#191D23] truncate w-full text-center">
                {{ item.nama }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-[#c8cbd3] shadow-xs flex flex-col justify-between">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 class="text-base font-bold text-[#191D23]">Distribusi Anggota per Kelas</h2>
            <div class="text-[11px] text-[#57707A] font-semibold cursor-pointer hover:underline mt-0.5">Lihat Detail</div>
          </div>
          <button class="text-slate-400 hover:text-slate-600">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>

        <div class="py-6 flex flex-col items-center justify-center">
          <div class="relative w-40 h-40 flex items-center justify-center">
            <div class="w-36 h-36 rounded-full border-12 border-[#57707A] flex items-center justify-center">
              <div class="text-center">
                <div class="text-2xl font-black text-[#191D23]">1,248</div>
                <div class="text-[10px] uppercase font-bold text-[#57707A] tracking-wider">Total Anggota</div>
              </div>
            </div>
          </div>

          <div class="w-full mt-6 space-y-2 text-xs">
            <div class="flex items-center justify-between p-1.5 rounded-lg">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-[#191D23]"></span>
                <span class="font-medium text-[#191D23]">Kelas X</span>
              </div>
              <span class="font-bold text-[#191D23]">456 (36.5%)</span>
            </div>
            <div class="flex items-center justify-between p-1.5 rounded-lg">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-[#57707A]"></span>
                <span class="font-medium text-[#191D23]">Kelas XI</span>
              </div>
              <span class="font-bold text-[#191D23]">384 (30.8%)</span>
            </div>
            <div class="flex items-center justify-between p-1.5 rounded-lg">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-[#7B919C]"></span>
                <span class="font-medium text-[#191D23]">Kelas XII</span>
              </div>
              <span class="font-bold text-[#191D23]">408 (32.7%)</span>
            </div>
            <div class="pt-2 border-t border-slate-100 flex items-center justify-between font-bold text-[#191D23]">
              <span>Total</span>
              <span>1,248 (100%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white p-6 rounded-2xl border border-[#c8cbd3] shadow-xs">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100">
        <h2 class="text-base font-bold text-[#191D23]">Aktivitas Terbaru</h2>
        <div class="text-xs text-[#57707A] font-semibold cursor-pointer hover:underline">Lihat Semua Aktivitas</div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div class="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-[#57707A]/15 text-[#57707A] flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <div class="text-xs sm:text-sm font-bold text-[#191D23]">Anggota baru bergabung ke Futsal</div>
              <div class="text-xs text-[#57707A]">Nama: Ahmad Rizki | Kelas: X</div>
            </div>
          </div>
          <span class="text-[11px] text-slate-400 shrink-0">15 menit lalu</span>
        </div>

        <div class="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-[#57707A]/15 text-[#57707A] flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div class="text-xs sm:text-sm font-bold text-[#191D23]">Jadwal kegiatan Basket diubah</div>
              <div class="text-xs text-[#57707A]">Perubahan: Waktu & Tempat</div>
            </div>
          </div>
          <span class="text-[11px] text-slate-400 shrink-0">15 menit lalu</span>
        </div>

        <div class="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-[#57707A]/15 text-[#57707A] flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div class="text-xs sm:text-sm font-bold text-[#191D23]">Presensi kegiatan Pramuka selesai</div>
              <div class="text-xs text-[#57707A]">Jumlah hadir: 42 / 45</div>
            </div>
          </div>
          <span class="text-[11px] text-slate-400 shrink-0">2 jam lalu</span>
        </div>

        <div class="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-[#57707A]/15 text-[#57707A] flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <div class="text-xs sm:text-sm font-bold text-[#191D23]">Anggota baru bergabung ke Rohis</div>
              <div class="text-xs text-[#57707A]">Nama: Siti Aisyah | Kelas: XI</div>
            </div>
          </div>
          <span class="text-[11px] text-slate-400 shrink-0">2 jam lalu</span>
        </div>
      </div>
    </div>
  </div>
</template>
