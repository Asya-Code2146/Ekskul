<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api.js';

const prestasiList = ref([]);
const siswaList = ref([]);
const ekskulList = ref([]);
const isLoading = ref(false);

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
    alert('Prestasi siswa berhasil dicatat!');
    form.value.peringkat = '';
    await loadData();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menyimpan prestasi.');
  }
};

const removePrestasi = async (id, nama, peringkat) => {
  if (!confirm(`Hapus prestasi "${peringkat}" milik ${nama}?`)) return;
  try {
    await api.delete(`/prestasi/${id}`);
    await loadData();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menghapus prestasi.');
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-fit">
        <div class="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900 leading-tight">Input Prestasi Siswa</h2>
            <p class="text-xs text-slate-500">Catat capaian kejuaraan atau kompetisi</p>
          </div>
        </div>

        <form @submit.prevent="savePrestasi" class="space-y-4 mt-5">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pilih Siswa Berprestasi *
            </label>
            <select
              v-model="form.nisn"
              required
              class="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option v-for="s in siswaList" :key="s.nisn" :value="s.nisn">
                {{ s.nama_lengkap }} ({{ s.kelas }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Ekstrakurikuler *
            </label>
            <select
              v-model="form.id_ekskul"
              required
              class="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option v-for="e in ekskulList" :key="e.id_ekskul" :value="e.id_ekskul">
                {{ e.nama_ekskul }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Prestasi / Peringkat *
            </label>
            <textarea
              v-model="form.peringkat"
              required
              rows="3"
              placeholder="Contoh: Juara 1 LKS Web Technologies Tingkat Provinsi Aceh"
              class="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            ></textarea>
          </div>

          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition shadow-sm cursor-pointer"
          >
            Simpan Prestasi
          </button>
        </form>
      </div>

      <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
        <div class="p-5 border-b border-slate-100">
          <h2 class="text-base font-bold text-slate-900">Rekapitulasi Prestasi Ekskul</h2>
          <p class="text-xs text-slate-500">Daftar penghargaan yang diraih oleh siswa SMKN 5 Telkom</p>
        </div>

        <div v-if="isLoading" class="p-12 text-center text-slate-400 text-sm">
          Memuat rekapitulasi prestasi...
        </div>
        <div v-else class="overflow-x-auto flex-1">
          <table class="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr class="bg-slate-900 text-white text-xs uppercase font-bold tracking-wider">
                <th class="py-3 px-4 w-12 text-center">NO</th>
                <th class="py-3 px-4">SISWA</th>
                <th class="py-3 px-4">EKSTRAKURIKULER</th>
                <th class="py-3 px-4">PRESTASI & JUARA</th>
                <th class="py-3 px-4 text-center w-24">AKSI</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm">
              <tr
                v-for="(item, index) in prestasiList"
                :key="item.id_prestasi"
                class="hover:bg-slate-50 transition"
              >
                <td class="py-3.5 px-4 text-center text-xs font-semibold text-slate-400">{{ index + 1 }}</td>
                <td class="py-3.5 px-4">
                  <div class="font-bold text-slate-900 text-sm">{{ item.nama_lengkap }}</div>
                  <div class="text-xs text-slate-500">{{ item.kelas }} • {{ item.kode_jurusan }}</div>
                </td>
                <td class="py-3.5 px-4">
                  <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    {{ item.nama_ekskul }}
                  </span>
                </td>
                <td class="py-3.5 px-4">
                  <div class="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
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
      </div>
    </div>
  </div>
</template>
