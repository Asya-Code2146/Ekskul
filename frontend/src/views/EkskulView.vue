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
const selectedKategori = ref('Semua');
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

const filteredEkskul = computed(() => {
  let list = [...ekskulList.value];

  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter((item) =>
      item.nama_ekskul.toLowerCase().includes(q) ||
      (item.nama_pembina && item.nama_pembina.toLowerCase().includes(q))
    );
  }

  if (selectedKategori.value !== 'Semua') {
    list = list.filter((item) => item.kategori === selectedKategori.value);
  }

  if (sortBy.value === 'nama') {
    list.sort((a, b) => a.nama_ekskul.localeCompare(b.nama_ekskul));
  } else if (sortBy.value === 'terbaru') {
    list.sort((a, b) => b.id_ekskul - a.id_ekskul);
  }

  return list;
});

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

const badgeClass = (kategori) => {
  switch (kategori) {
    case 'Teknologi':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Olahraga':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Seni':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Kepemimpinan':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

onMounted(() => {
  fetchInitialData();
});
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 class="text-lg sm:text-xl font-bold text-slate-900">Daftar Ekstrakurikuler</h2>
        <p class="text-xs sm:text-sm text-slate-500">Kelola informasi divisi ekstrakurikuler SMKN 5 Telkom Banda Aceh.</p>
      </div>
      <button
        @click="openCreateModal"
        class="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition shadow-sm hover:shadow active:scale-95 cursor-pointer shrink-0"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        <span>Tambah Ekstrakurikuler</span>
      </button>
    </div>

    <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="relative flex-1 max-w-md">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari nama ekstrakurikuler atau pembina..."
            class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-slate-50/50"
          />
          <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="flex items-center gap-2 self-end sm:self-auto">
          <select
            v-model="sortBy"
            class="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="terbaru">Urutkan: Terbaru</option>
            <option value="nama">Urutkan: Nama A-Z</option>
          </select>
        </div>
      </div>

      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
        <button
          @click="selectedKategori = 'Semua'"
          :class="[
            'px-3 py-1.5 rounded-lg font-medium transition shrink-0 cursor-pointer',
            selectedKategori === 'Semua' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]"
        >
          Semua ({{ ekskulList.length }})
        </button>
        <button
          v-for="kat in kategoriOptions"
          :key="kat"
          @click="selectedKategori = kat"
          :class="[
            'px-3 py-1.5 rounded-lg font-medium transition shrink-0 cursor-pointer',
            selectedKategori === kat ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          ]"
        >
          {{ kat }}
        </button>
      </div>
    </div>

    <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
      {{ errorMessage }}
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div v-if="isLoading" class="p-12 text-center text-slate-400 text-sm">
        Memuat data ekstrakurikuler...
      </div>
      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr class="bg-slate-900 text-white text-xs uppercase font-bold tracking-wider">
                <th class="py-3.5 px-4 w-12 text-center">NO</th>
                <th class="py-3.5 px-4">NAMA EKSTRAKURIKULER</th>
                <th class="py-3.5 px-4">PEMBINA / PEMBIMBING</th>
                <th class="py-3.5 px-4">KATEGORI</th>
                <th class="py-3.5 px-4 text-center">TOTAL ANGGOTA</th>
                <th class="py-3.5 px-4 text-center w-36">AKSI</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm">
              <tr
                v-for="(item, index) in filteredEkskul"
                :key="item.id_ekskul"
                class="hover:bg-blue-50/30 transition group"
              >
                <td class="py-3.5 px-4 text-center font-semibold text-slate-400 text-xs">{{ index + 1 }}</td>
                <td class="py-3.5 px-4 font-bold text-slate-900">
                  <div class="text-sm font-semibold text-slate-900">{{ item.nama_ekskul }}</div>
                </td>
                <td class="py-3.5 px-4">
                  <div class="font-medium text-slate-800 text-sm">{{ item.nama_pembina }}</div>
                  <div class="text-xs text-slate-400">NIP. {{ item.nip || '-' }}</div>
                </td>
                <td class="py-3.5 px-4">
                  <span
                    :class="[
                      'border text-xs font-semibold px-2.5 py-1 rounded-full inline-block',
                      badgeClass(item.kategori)
                    ]"
                  >
                    {{ item.kategori }}
                  </span>
                </td>
                <td class="py-3.5 px-4 text-center font-bold text-slate-700">
                  <span class="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full text-xs">
                    {{ item.total_anggota || 0 }} Siswa
                  </span>
                </td>
                <td class="py-3.5 px-4 text-center">
                  <div class="flex items-center justify-center gap-1.5">
                    <button
                      @click="openEditModal(item)"
                      class="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      @click="removeEkskul(item.id_ekskul, item.nama_ekskul)"
                      class="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs transition cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredEkskul.length === 0">
                <td colspan="6" class="py-12 text-center text-slate-400 text-sm">
                  Tidak ada ekstrakurikuler yang sesuai dengan pencarian atau filter.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 class="text-base sm:text-lg font-bold text-slate-900">
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
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Nama Ekstrakurikuler *
            </label>
            <input
              v-model="form.nama_ekskul"
              type="text"
              required
              placeholder="Contoh: Telkom Coding Club"
              class="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Kategori Bidang *
            </label>
            <select
              v-model="form.kategori"
              required
              class="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white"
            >
              <option v-for="kat in kategoriOptions" :key="kat" :value="kat">
                {{ kat }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pembina Penanggung Jawab *
            </label>
            <select
              v-model="form.id_pembina"
              required
              class="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white"
            >
              <option v-for="p in pembinaList" :key="p.id_pembina" :value="p.id_pembina">
                {{ p.nama_pembina }} (NIP. {{ p.nip }})
              </option>
            </select>
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              {{ isEditMode ? 'Simpan Perubahan' : 'Simpan Data' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
