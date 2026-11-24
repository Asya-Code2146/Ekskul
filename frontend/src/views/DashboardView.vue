<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api.js';

const isLoading = ref(true);
const showAllActivities = ref(false);
const activityFilter = ref('semua');
const activitySearch = ref('');

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

const allActivitiesList = ref([
  {
    id: 1,
    kategori: 'anggota',
    judul: 'Anggota baru bergabung ke Futsal Telkom FC',
    detail: 'Nama: Ahmad Rizki (NISN: 0071234502) • Kelas: X RPL 1',
    waktu: '15 menit yang lalu',
    status: 'Terdaftar'
  },
  {
    id: 2,
    kategori: 'jadwal',
    judul: 'Jadwal latihan Basket diubah',
    detail: 'Perubahan: Waktu dipindah ke Sabtu 08:00 WIB • Lokasi: Lapangan Indoor',
    waktu: '25 menit yang lalu',
    status: 'Jadwal Baru'
  },
  {
    id: 3,
    kategori: 'presensi',
    judul: 'Presensi kegiatan Pramuka selesai',
    detail: 'Latihan Rutin Kepramukaan • Kehadiran: 42 Hadir, 2 Izin, 1 Sakit',
    waktu: '1 jam yang lalu',
    status: 'Presensi Selesai'
  },
  {
    id: 4,
    kategori: 'anggota',
    judul: 'Anggota baru bergabung ke Rohis Al-Kautsar',
    detail: 'Nama: Siti Aisyah (NISN: 0071234503) • Kelas: XI TKJ 2',
    waktu: '2 jam yang lalu',
    status: 'Terdaftar'
  },
  {
    id: 5,
    kategori: 'prestasi',
    judul: 'Prestasi Juara 1 LKS Web Technologies dicatat',
    detail: 'Siswa: Muhammad Al-Fatih • Tingkat: Provinsi Aceh 2026',
    waktu: '4 jam yang lalu',
    status: 'Juara 1'
  },
  {
    id: 6,
    kategori: 'jadwal',
    judul: 'Agenda Bootcamp IoT & Robotics dijadwalkan',
    detail: 'Tanggal: 21 November 2026 • Pembina: Fajar Siddiq, S.Kom., M.T.',
    waktu: '6 jam yang lalu',
    status: 'Diagendakan'
  },
  {
    id: 7,
    kategori: 'presensi',
    judul: 'Presensi Telkom Coding Club terekam',
    detail: 'Modul Vue 3 & Express API • Kehadiran: 28 Hadir dari 30 Peserta',
    waktu: 'Kemarin, 16:30 WIB',
    status: 'Presensi Selesai'
  },
  {
    id: 8,
    kategori: 'prestasi',
    judul: 'Juara 2 Kontes Robot Cerdas Nasional dicatat',
    detail: 'Siswa: Daffa Pratama • Penyelenggara: Puspresnas Kemendikbud',
    waktu: 'Kemarin, 14:15 WIB',
    status: 'Juara 2'
  },
  {
    id: 9,
    kategori: 'anggota',
    judul: 'Penetapan Struktur Jabatan Pengurus Paskibra',
    detail: 'Ketua: Rahmat Hidayat • Sekretaris: Cut Putri Meurah',
    waktu: '2 hari yang lalu',
    status: 'SK Pengurus'
  },
  {
    id: 10,
    kategori: 'jadwal',
    judul: 'Uji Coba Pertandingan Futsal antar Sekolah',
    detail: 'Lawan: SMA Negeri 1 Banda Aceh • Tempat: Lapangan Futsal Kick-Off',
    waktu: '3 hari yang lalu',
    status: 'Laga Tanding'
  }
]);

const filteredActivities = computed(() => {
  return allActivitiesList.value.filter((act) => {
    const matchCat = activityFilter.value === 'semua' || act.kategori === activityFilter.value;
    const matchSearch =
      activitySearch.value.trim() === '' ||
      act.judul.toLowerCase().includes(activitySearch.value.toLowerCase()) ||
      act.detail.toLowerCase().includes(activitySearch.value.toLowerCase());
    return matchCat && matchSearch;
  });
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
            <div class="text-[11px] text-[#57707A] font-semibold">Tahun Ajaran 2026/2027</div>
          </div>
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
        <button
          @click="showAllActivities = true"
          class="text-xs text-[#57707A] hover:text-[#191D23] font-bold cursor-pointer hover:underline transition"
        >
          Lihat Semua Aktivitas
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div
          v-for="item in allActivitiesList.slice(0, 4)"
          :key="item.id"
          class="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-100/60 transition flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-[#57707A]/15 text-[#57707A] flex items-center justify-center shrink-0">
              <svg v-if="item.kategori === 'anggota'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <svg v-else-if="item.kategori === 'jadwal'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <svg v-else-if="item.kategori === 'presensi'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <div class="text-xs sm:text-sm font-bold text-[#191D23]">{{ item.judul }}</div>
              <div class="text-xs text-[#57707A] line-clamp-1">{{ item.detail }}</div>
            </div>
          </div>
          <span class="text-[11px] text-slate-400 shrink-0">{{ item.waktu }}</span>
        </div>
      </div>
    </div>

    <div
      v-if="showAllActivities"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
    >
      <div class="bg-white rounded-3xl shadow-2xl border border-[#c8cbd3] w-full max-w-2xl max-h-[90vh] flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between pb-4 border-b border-[#DEDCDC]">
          <div>
            <h3 class="text-base sm:text-lg font-bold text-[#191D23]">Log Seluruh Aktivitas Ekstrakurikuler</h3>
            <p class="text-xs text-[#57707A]">Riwayat pencatatan sistem, pendaftaran, jadwal, presensi & prestasi</p>
          </div>
          <button
            @click="showAllActivities = false"
            class="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="py-4 space-y-3">
          <input
            v-model="activitySearch"
            type="text"
            placeholder="Cari aktivitas atau siswa..."
            class="w-full px-4 py-2.5 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm bg-[#f8f9fa] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
          />

          <div class="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              v-for="tab in ['semua', 'anggota', 'jadwal', 'presensi', 'prestasi']"
              :key="tab"
              @click="activityFilter = tab"
              :class="[
                'px-3 py-1.5 rounded-lg capitalize font-semibold transition cursor-pointer shrink-0',
                activityFilter === tab
                  ? 'bg-[#191D23] text-white shadow-xs'
                  : 'bg-slate-100 text-[#57707A] hover:bg-slate-200'
              ]"
            >
              {{ tab }}
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-100">
          <div
            v-for="act in filteredActivities"
            :key="act.id"
            class="pt-2.5 first:pt-0 flex items-start justify-between gap-3"
          >
            <div class="flex items-start gap-3">
              <div class="w-9 h-9 rounded-xl bg-[#57707A]/15 text-[#57707A] flex items-center justify-center shrink-0 mt-0.5">
                <svg v-if="act.kategori === 'anggota'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <svg v-else-if="act.kategori === 'jadwal'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <svg v-else-if="act.kategori === 'presensi'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <div class="text-xs sm:text-sm font-bold text-[#191D23]">{{ act.judul }}</div>
                <div class="text-xs text-[#57707A] mt-0.5">{{ act.detail }}</div>
                <div class="text-[11px] text-slate-400 mt-1">{{ act.waktu }}</div>
              </div>
            </div>
            <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-[#191D23] border border-slate-200 shrink-0">
              {{ act.status }}
            </span>
          </div>

          <div v-if="filteredActivities.length === 0" class="py-8 text-center text-xs text-slate-400">
            Tidak ada aktivitas yang sesuai dengan pencarian.
          </div>
        </div>

        <div class="pt-4 mt-2 border-t border-[#DEDCDC] flex justify-end">
          <button
            @click="showAllActivities = false"
            class="px-5 py-2 rounded-full bg-[#191D23] hover:bg-[#57707A] text-white text-xs font-semibold transition cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>