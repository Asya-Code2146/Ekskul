<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api.js';

const ekskulList = ref([]);
const pembinaList = ref([]);
const isLoading = ref(false);
const showModal = ref(false);
const isEditMode = ref(false);
const errorMessage = ref('');
const searchQuery = ref('');
const sortBy = ref('terbaru');

const form = ref({
  id_ekskul: null,
  nama_ekskul: '',
  kategori: 'Teknologi',
  id_pembina: ''
});

const kategoriOptions = ['Teknologi', 'Olahraga', 'Seni', 'Kepemimpinan', 'Keagamaan'];

const fetchInitialData = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const [resEkskul, resPembina] = await Promise.all([
      api.get('/ekskul'),
      api.get('/master/pembina')
    ]);
    ekskulList.value = resEkskul.data.data;
    pembinaList.value = resPembina.data.data;
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Gagal mengambil data dari server.';
  } finally {
    isLoading.value = false;
  }
};

const scheduleData = {
  1: { hari: 'Sabtu', jam: '09:00 - 12:00', lokasi: 'Lab Komputer RPL' },
  2: { hari: 'Senin', jam: '16:00 - 18:00', lokasi: 'Lapangan Utama' },
  3: { hari: 'Selasa', jam: '15:30 - 17:30', lokasi: 'Lapangan Futsal' },
  4: { hari: 'Jumat', jam: '14:00 - 16:30', lokasi: 'Lab IoT & Robotika' }
};

const filteredEkskul = computed(() => {
  let list = [...ekskulList.value];

  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter((item) =>
      item.nama_ekskul.toLowerCase().includes(q) ||
      (item.nama_pembina && item.nama_pembina.toLowerCase().includes(q))
    );
  }

  if (sortBy.value === 'nama') {
    list.sort((a, b) => a.nama_ekskul.localeCompare(b.nama_ekskul));
  } else if (sortBy.value === 'terbaru') {
    list.sort((a, b) => b.id_ekskul - a.id_ekskul);
  }

  return list;
});

const currentPage = ref(1);
const perPage = ref(3);

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredEkskul.value.length / perPage.value));
});

const paginatedEkskul = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredEkskul.value.slice(start, start + perPage.value);
});

const setPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const openCreateModal = () => {
  isEditMode.value = false;
  form.value = {
    id_ekskul: null,
    nama_ekskul: '',
    kategori: 'Teknologi',
    id_pembina: pembinaList.value.length > 0 ? pembinaList.value[0].id_pembina : ''
  };
  showModal.value = true;
};

const openEditModal = (item) => {
  isEditMode.value = true;
  form.value = {
    id_ekskul: item.id_ekskul,
    nama_ekskul: item.nama_ekskul,
    kategori: item.kategori,
    id_pembina: item.id_pembina
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveEkskul = async () => {
  try {
    const payload = {
      nama_ekskul: form.value.nama_ekskul,
      kategori: form.value.kategori,
      id_pembina: form.value.id_pembina
    };

    if (isEditMode.value) {
      await api.put(`/ekskul/${form.value.id_ekskul}`, payload);
    } else {
      await api.post('/ekskul', payload);
    }
    closeModal();
    await fetchInitialData();
  } catch (error) {
    alert(error.response?.data?.message || 'Terjadi kesalahan saat menyimpan data.');
  }
};

const removeEkskul = async (id, nama) => {
  const konfirmasi = confirm(`Apakah Anda yakin ingin menghapus ekstrakurikuler "${nama}"?`);
  if (!konfirmasi) return;

  try {
    await api.delete(`/ekskul/${id}`);
    await fetchInitialData();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menghapus data.');
  }
};

onMounted(() => {
  fetchInitialData();
});
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white rounded-3xl p-6 sm:p-8 border border-[#c8cbd3] shadow-xs">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-4">
        <h2 class="text-xl sm:text-2xl font-black text-[#191D23]">Daftar Ekstrakurikuler</h2>
        <button
          @click="openCreateModal"
          class="inline-flex items-center justify-center gap-2 bg-[#191D23] hover:bg-[#57707A] text-white font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition shadow-md active:scale-95 cursor-pointer shrink-0"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tambah Ekstrakurikuler</span>
        </button>
      </div>

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div class="relative flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari ekstrakurikuler..."
            class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#57707A] bg-[#f8f9fa]"
          />
          <svg class="w-4 h-4 text-[#7B919C] absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex items-center gap-2 self-end sm:self-auto">
          <span class="text-xs text-[#57707A] font-medium hidden sm:inline">Urutkan</span>
          <select
            v-model="sortBy"
            class="px-4 py-2 rounded-xl border border-[#c8cbd3] text-xs sm:text-sm bg-white font-medium text-[#191D23] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
          >
            <option value="terbaru">Terbaru</option>
            <option value="nama">Nama A-Z</option>
          </select>
        </div>
      </div>

      <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
        {{ errorMessage }}
      </div>

      <div v-if="isLoading" class="p-12 text-center text-[#7B919C] text-sm">
        Memuat data ekstrakurikuler...
      </div>
      <div v-else class="overflow-x-auto rounded-2xl border border-[#c8cbd3]">
        <table class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr class="bg-[#191D23] text-white text-[11px] sm:text-xs uppercase font-extrabold tracking-wider">
              <th class="py-3.5 px-4 w-12 text-center">NO</th>
              <th class="py-3.5 px-4">NAMA EKSTRAKURIKULER</th>
              <th class="py-3.5 px-4">PEMBIMBING</th>
              <th class="py-3.5 px-4">HARI</th>
              <th class="py-3.5 px-4">JAM</th>
              <th class="py-3.5 px-4">LOKASI</th>
              <th class="py-3.5 px-4 text-center w-36">AKSI</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-xs sm:text-sm">
            <tr
              v-for="(item, index) in paginatedEkskul"
              :key="item.id_ekskul"
              class="hover:bg-slate-50/80 transition"
            >
              <td class="py-4 px-4 text-center font-semibold text-slate-400">
                {{ (currentPage - 1) * perPage + index + 1 }}
              </td>
              <td class="py-4 px-4 font-bold text-[#191D23]">
                {{ item.nama_ekskul }}
              </td>
              <td class="py-4 px-4 text-slate-700 font-medium">
                {{ item.nama_pembina }}
              </td>
              <td class="py-4 px-4 text-slate-600">
                {{ scheduleData[item.id_ekskul]?.hari || 'Senin' }}
              </td>
              <td class="py-4 px-4 text-slate-600">
                {{ scheduleData[item.id_ekskul]?.jam || '15:30 - 17:30' }}
              </td>
              <td class="py-4 px-4 text-slate-600">
                {{ scheduleData[item.id_ekskul]?.lokasi || 'Lab Komputer' }}
              </td>
              <td class="py-4 px-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="openEditModal(item)"
                    class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#57707A] hover:bg-[#191D23] text-white font-semibold text-xs transition cursor-pointer"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    <span>Edit</span>
                  </button>
                  <button
                    @click="removeEkskul(item.id_ekskul, item.nama_ekskul)"
                    class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition cursor-pointer"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Hapus</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredEkskul.length === 0">
              <td colspan="7" class="py-12 text-center text-slate-400 text-sm">
                Tidak ada data ekstrakurikuler yang sesuai.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-between pt-6 text-xs text-[#57707A] gap-4">
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
        <div class="flex items-center gap-2">
          <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>
          <span class="text-slate-300">•</span>
          <span class="text-slate-500">Total {{ filteredEkskul.length }} data</span>
        </div>
      </div>

      <div class="text-center pt-8 border-t border-slate-100 text-xs text-[#7B919C] mt-6">
        © 2026 SMKN 5 Telkom Banda Aceh. All rights reserved.
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
    >
      <div class="bg-white rounded-3xl shadow-2xl border border-[#c8cbd3] w-full max-w-md p-6">
        <div class="flex items-center justify-between pb-4 border-b border-[#DEDCDC]">
          <h3 class="text-base sm:text-lg font-bold text-[#191D23]">
            {{ isEditMode ? 'Edit Ekstrakurikuler' : 'Tambah Ekstrakurikuler Baru' }}
          </h3>
          <button
            @click="closeModal"
            class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveEkskul" class="space-y-4 mt-4">
          <div>
            <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">
              Nama Ekstrakurikuler *
            </label>
            <input
              v-model="form.nama_ekskul"
              type="text"
              required
              placeholder="Contoh: Basketball"
              class="w-full border border-[#989DAA]/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">
              Kategori Bidang *
            </label>
            <select
              v-model="form.kategori"
              required
              class="w-full border border-[#989DAA]/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white"
            >
              <option v-for="kat in kategoriOptions" :key="kat" :value="kat">
                {{ kat }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">
              Pembina / Pembimbing *
            </label>
            <select
              v-model="form.id_pembina"
              required
              class="w-full border border-[#989DAA]/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white"
            >
              <option v-for="p in pembinaList" :key="p.id_pembina" :value="p.id_pembina">
                {{ p.nama_pembina }}
              </option>
            </select>
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t border-[#DEDCDC]">
            <button
              type="button"
              @click="closeModal"
              class="px-5 py-2 rounded-full border border-[#989DAA] text-[#191D23] text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-6 py-2 rounded-full bg-[#191D23] text-white text-xs font-semibold hover:bg-[#57707A] transition cursor-pointer"
            >
              {{ isEditMode ? 'Simpan Perubahan' : 'Simpan Data' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
