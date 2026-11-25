<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api.js';
import { useToast } from '../services/toast.js';

const { showToast } = useToast();

const prestasiList = ref([]);
const siswaList = ref([]);
const ekskulList = ref([]);
const isLoading = ref(false);

const currentPage = ref(1);
const perPage = ref(5);

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(prestasiList.value.length / perPage.value));
});

const paginatedPrestasi = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return prestasiList.value.slice(start, start + perPage.value);
});

const setPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const form = ref({
  nisn: '',
  id_ekskul: '',
  peringkat: ''
});

const loadData = async () => {
  isLoading.value = true;
  try {
    const [resPrestasi, resSiswa, resEkskul] = await Promise.all([
      api.get('/prestasi'),
      api.get('/master/siswa'),
      api.get('/ekskul')
    ]);
    prestasiList.value = resPrestasi.data.data;
    siswaList.value = resSiswa.data.data;
    ekskulList.value = resEkskul.data.data;

    if (siswaList.value.length > 0 && !form.value.nisn) {
      form.value.nisn = siswaList.value[0].nisn;
    }
    if (ekskulList.value.length > 0 && !form.value.id_ekskul) {
      form.value.id_ekskul = ekskulList.value[0].id_ekskul;
    }
  } catch (error) {
    console.error('Error loading prestasi:', error);
  } finally {
    isLoading.value = false;
  }
};

const savePrestasi = async () => {
  try {
    await api.post('/prestasi', form.value);
    showToast('Prestasi siswa berhasil dicatat!');
    form.value.peringkat = '';
    await loadData();
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal menyimpan prestasi.', 'error');
  }
};

const removePrestasi = async (id, nama, peringkat) => {
  if (!confirm(`Hapus prestasi "${peringkat}" milik ${nama}?`)) return;
  try {
    await api.delete(`/prestasi/${id}`);
    showToast('Prestasi berhasil dihapus.');
    await loadData();
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal menghapus prestasi.', 'error');
  }
};

const exportPrestasiCSV = () => {
  if (prestasiList.value.length === 0) {
    showToast('Tidak ada data prestasi untuk diekspor.', 'error');
    return;
  }
  const headers = ['No', 'Nama Siswa', 'NISN', 'Kelas', 'Ekstrakurikuler', 'Prestasi & Juara'];
  const rows = prestasiList.value.map((item, index) => [
    index + 1,
    `"${(item.nama_lengkap || '').replace(/"/g, '""')}"`,
    `"${item.nisn || ''}"`,
    `"${item.kelas || ''}"`,
    `"${item.nama_ekskul || ''}"`,
    `"${(item.peringkat || '').replace(/"/g, '""')}"`
  ]);
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `rekap_prestasi_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Rekap prestasi berhasil diekspor ke CSV!');
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-3xl border border-[#c8cbd3] shadow-xs h-fit">
        <div class="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div class="w-8 h-8 rounded-xl bg-[#57707A]/15 text-[#57707A] flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <h2 class="text-base font-bold text-[#191D23] leading-tight">Input Prestasi Siswa</h2>
            <p class="text-xs text-[#57707A]">Catat capaian kejuaraan atau kompetisi</p>
          </div>
        </div>

        <form @submit.prevent="savePrestasi" class="space-y-4 mt-5">
          <div>
            <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">
              Pilih Siswa Berprestasi *
            </label>
            <select
              v-model="form.nisn"
              required
              class="w-full border border-[#c8cbd3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            >
              <option v-for="s in siswaList" :key="s.nisn" :value="s.nisn">
                {{ s.nama_lengkap }} ({{ s.kelas }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">
              Ekstrakurikuler *
            </label>
            <select
              v-model="form.id_ekskul"
              required
              class="w-full border border-[#c8cbd3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            >
              <option v-for="e in ekskulList" :key="e.id_ekskul" :value="e.id_ekskul">
                {{ e.nama_ekskul }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">
              Nama Prestasi / Peringkat *
            </label>
            <textarea
              v-model="form.peringkat"
              required
              rows="3"
              placeholder="Contoh: Juara 1 LKS Web Technologies Tingkat Provinsi Aceh"
              class="w-full border border-[#c8cbd3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            ></textarea>
          </div>

          <button
            type="submit"
            class="w-full bg-[#191D23] hover:bg-[#57707A] text-white font-semibold py-2.5 rounded-xl text-sm transition shadow-sm cursor-pointer"
          >
            Simpan Prestasi
          </button>
        </form>
      </div>

      <div class="lg:col-span-2 bg-white p-4 sm:p-6 rounded-3xl border border-[#c8cbd3] shadow-xs flex flex-col">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 class="text-base font-bold text-[#191D23]">Rekapitulasi Prestasi Ekskul</h2>
            <p class="text-xs text-[#57707A]">Daftar penghargaan yang diraih oleh siswa SMKN 5 Telkom</p>
          </div>
          <button
            @click="exportPrestasiCSV"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#c8cbd3] bg-white hover:bg-slate-50 text-[#191D23] text-xs font-semibold transition cursor-pointer self-start sm:self-auto"
            title="Export CSV"
          >
            <svg class="w-3.5 h-3.5 text-[#57707A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>

        <div v-if="isLoading" class="p-12 text-center text-slate-400 text-sm">
          Memuat rekapitulasi prestasi...
        </div>
        <div v-else class="overflow-x-auto mt-4 rounded-2xl border border-[#c8cbd3]">
          <table class="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr class="bg-[#f8f9fa] border-b border-[#c8cbd3] text-[11px] font-bold text-slate-600 uppercase">
                <th class="py-3 px-4 w-12 text-center">NO</th>
                <th class="py-3 px-4">SISWA</th>
                <th class="py-3 px-4">EKSTRAKURIKULER</th>
                <th class="py-3 px-4">PRESTASI & JUARA</th>
                <th class="py-3 px-4 text-center w-24">AKSI</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs sm:text-sm">
              <tr
                v-for="(item, index) in paginatedPrestasi"
                :key="item.id_prestasi"
                class="hover:bg-slate-50 transition"
              >
                <td class="py-3.5 px-4 text-center text-xs font-semibold text-slate-400">
                  {{ (currentPage - 1) * perPage + index + 1 }}
                </td>
                <td class="py-3.5 px-4">
                  <div class="font-bold text-[#191D23] text-sm">{{ item.nama_lengkap }}</div>
                  <div class="text-xs text-[#57707A]">{{ item.kelas }} • {{ item.kode_jurusan }}</div>
                </td>
                <td class="py-3.5 px-4">
                  <span class="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#57707A]/15 text-[#57707A]">
                    {{ item.nama_ekskul }}
                  </span>
                </td>
                <td class="py-3.5 px-4">
                  <div class="font-semibold text-[#191D23] text-sm flex items-center gap-1.5">
                    <span class="text-amber-500">★</span>
                    <span>{{ item.peringkat }}</span>
                  </div>
                </td>
                <td class="py-3.5 px-4 text-center">
                  <button
                    @click="removePrestasi(item.id_prestasi, item.nama_lengkap, item.peringkat)"
                    class="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs transition cursor-pointer"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="prestasiList.length === 0">
                <td colspan="5" class="py-12 text-center text-slate-400 text-sm">
                  Belum ada prestasi yang ditambahkan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between pt-5 mt-auto text-xs text-[#57707A] gap-3">
          <div>
            Menampilkan {{ prestasiList.length > 0 ? (currentPage - 1) * perPage + 1 : 0 }}-{{ Math.min(currentPage * perPage, prestasiList.length) }} dari {{ prestasiList.length }} prestasi
          </div>
          <div class="flex items-center gap-1.5">
            <button
              @click="setPage(currentPage - 1)"
              :disabled="currentPage === 1"
              :class="[
                'px-2.5 py-1 rounded-md border border-[#c8cbd3] transition',
                currentPage === 1 ? 'opacity-40 cursor-not-allowed bg-slate-100' : 'bg-white hover:bg-slate-50 cursor-pointer'
              ]"
            >
              &lt;
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              @click="setPage(page)"
              :class="[
                'px-3 py-1 rounded-md transition cursor-pointer font-bold',
                currentPage === page
                  ? 'bg-[#191D23] text-white shadow-xs'
                  : 'border border-[#c8cbd3] bg-white text-[#57707A] hover:bg-slate-50'
              ]"
            >
              {{ page }}
            </button>
            <button
              @click="setPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              :class="[
                'px-2.5 py-1 rounded-md border border-[#c8cbd3] transition',
                currentPage === totalPages ? 'opacity-40 cursor-not-allowed bg-slate-100' : 'bg-white hover:bg-slate-50 cursor-pointer'
              ]"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
