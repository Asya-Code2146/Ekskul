<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api.js';

const anggotaList = ref([]);
const siswaList = ref([]);
const ekskulList = ref([]);
const tahunAjaranList = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const filterEkskul = ref('Semua');

const showEditModal = ref(false);
const editForm = ref({
  id_anggota: null,
  nama_lengkap: '',
  nisn: '',
  id_ekskul: '',
  id_tahun_ajaran: '',
  jabatan: 'Anggota'
});

const form = ref({
  nisn: '',
  id_ekskul: '',
  id_tahun_ajaran: '',
  jabatan: 'Anggota'
});

const jabatanOptions = ['Ketua', 'Wakil Ketua', 'Sekretaris', 'Bendahara', 'Anggota'];

const loadAllData = async () => {
  isLoading.value = true;
  try {
    const [resAnggota, resSiswa, resEkskul, resTahun] = await Promise.all([
      api.get('/anggota'),
      api.get('/master/siswa'),
      api.get('/ekskul'),
      api.get('/master/tahun-ajaran')
    ]);
    anggotaList.value = resAnggota.data.data;
    siswaList.value = resSiswa.data.data;
    ekskulList.value = resEkskul.data.data;
    tahunAjaranList.value = resTahun.data.data;

    if (siswaList.value.length > 0 && !form.value.nisn) {
      form.value.nisn = siswaList.value[0].nisn;
    }
    if (ekskulList.value.length > 0 && !form.value.id_ekskul) {
      form.value.id_ekskul = ekskulList.value[0].id_ekskul;
    }
    if (tahunAjaranList.value.length > 0 && !form.value.id_tahun_ajaran) {
      form.value.id_tahun_ajaran = tahunAjaranList.value[0].id_tahun_ajaran;
    }
  } catch (error) {
    alert('Gagal memuat data: ' + (error.response?.data?.message || error.message));
  } finally {
    isLoading.value = false;
  }
};

const filteredAnggota = computed(() => {
  let list = [...anggotaList.value];

  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter((item) =>
      item.nama_lengkap.toLowerCase().includes(q) ||
      item.nisn.toLowerCase().includes(q) ||
      item.kelas.toLowerCase().includes(q) ||
      item.nama_ekskul.toLowerCase().includes(q)
    );
  }

  if (filterEkskul.value !== 'Semua') {
    list = list.filter((item) => String(item.id_ekskul) === String(filterEkskul.value));
  }

  return list;
});

const registerAnggota = async () => {
  try {
    await api.post('/anggota', form.value);
    alert('Siswa berhasil didaftarkan ke ekstrakurikuler!');
    await loadAllData();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal mendaftarkan anggota.');
  }
};

const openEditModal = (item) => {
  editForm.value = {
    id_anggota: item.id_anggota,
    nama_lengkap: item.nama_lengkap,
    nisn: item.nisn,
    id_ekskul: item.id_ekskul,
    id_tahun_ajaran: item.id_tahun_ajaran,
    jabatan: item.jabatan
  };
  showEditModal.value = true;
};

const saveEditAnggota = async () => {
  try {
    await api.put(`/anggota/${editForm.value.id_anggota}`, {
      id_ekskul: editForm.value.id_ekskul,
      id_tahun_ajaran: editForm.value.id_tahun_ajaran,
      jabatan: editForm.value.jabatan
    });
    alert('Data keanggotaan berhasil diperbarui!');
    showEditModal.value = false;
    await loadAllData();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal memperbarui keanggotaan.');
  }
};

const removeAnggota = async (id, namaSiswa) => {
  if (!confirm(`Keluarkan "${namaSiswa}" dari keanggotaan ekskul ini?`)) return;
  try {
    await api.delete(`/anggota/${id}`);
    await loadAllData();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menghapus keanggotaan.');
  }
};

const jabatanBadge = (jabatan) => {
  switch (jabatan) {
    case 'Ketua':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Wakil Ketua':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'Sekretaris':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Bendahara':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

onMounted(() => {
  loadAllData();
});
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs h-fit">
        <div class="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <h2 class="text-base font-bold text-slate-900 leading-tight">Pendaftaran Anggota</h2>
            <p class="text-xs text-slate-500">Hubungkan data siswa ke ekstrakurikuler</p>
          </div>
        </div>

        <form @submit.prevent="registerAnggota" class="space-y-4 mt-5">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pilih Siswa *
            </label>
            <select
              v-model="form.nisn"
              required
              class="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white"
            >
              <option v-for="s in siswaList" :key="s.nisn" :value="s.nisn">
                {{ s.nama_lengkap }} ({{ s.kelas }} - {{ s.kode_jurusan }})
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
              class="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white"
            >
              <option v-for="e in ekskulList" :key="e.id_ekskul" :value="e.id_ekskul">
                {{ e.nama_ekskul }} ({{ e.kategori }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tahun Ajaran & Semester *
            </label>
            <select
              v-model="form.id_tahun_ajaran"
              required
              class="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white"
            >
              <option v-for="t in tahunAjaranList" :key="t.id_tahun_ajaran" :value="t.id_tahun_ajaran">
                {{ t.nama_tahun }} - {{ t.semester }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Jabatan *
            </label>
            <select
              v-model="form.jabatan"
              required
              class="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition bg-white"
            >
              <option v-for="jab in jabatanOptions" :key="jab" :value="jab">
                {{ jab }}
              </option>
            </select>
          </div>

          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm transition shadow-sm hover:shadow active:scale-98 cursor-pointer mt-2"
          >
            Daftarkan Anggota
          </button>
        </form>
      </div>

      <div class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
        <div class="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-base font-bold text-slate-900">Daftar Anggota Ekstrakurikuler</h2>
            <p class="text-xs text-slate-500">Relasi 5 entitas (siswa, jurusan, ekskul, tahun ajaran)</p>
          </div>

          <div class="flex items-center gap-2">
            <select
              v-model="filterEkskul"
              class="border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Semua">Semua Ekskul</option>
              <option v-for="e in ekskulList" :key="e.id_ekskul" :value="e.id_ekskul">
                {{ e.nama_ekskul }}
              </option>
            </select>
          </div>
        </div>

        <div class="p-3 border-b border-slate-100 bg-slate-50/50">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari anggota berdasarkan nama, NISN, atau kelas..."
              class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <svg class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div v-if="isLoading" class="p-12 text-center text-slate-400 text-sm">
          Memuat data keanggotaan...
        </div>
        <div v-else class="overflow-x-auto flex-1">
          <table class="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr class="bg-slate-900 text-white text-xs uppercase font-bold tracking-wider">
                <th class="py-3 px-4 w-12 text-center">NO</th>
                <th class="py-3 px-4">SISWA</th>
                <th class="py-3 px-4">EKSTRAKURIKULER</th>
                <th class="py-3 px-4">PERIODE</th>
                <th class="py-3 px-4 text-center">JABATAN</th>
                <th class="py-3 px-4 text-center w-28">AKSI</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm">
              <tr
                v-for="(item, index) in filteredAnggota"
                :key="item.id_anggota"
                class="hover:bg-slate-50 transition"
              >
                <td class="py-3.5 px-4 text-center text-xs font-semibold text-slate-400">{{ index + 1 }}</td>
                <td class="py-3.5 px-4">
                  <div class="font-bold text-slate-900 text-sm leading-tight">{{ item.nama_lengkap }}</div>
                  <div class="text-xs text-slate-500 mt-0.5">NISN: {{ item.nisn }} • {{ item.kelas }} ({{ item.kode_jurusan }})</div>
                </td>
                <td class="py-3.5 px-4">
                  <div class="font-semibold text-slate-800 text-sm">{{ item.nama_ekskul }}</div>
                  <div class="text-[11px] text-slate-400">{{ item.kategori }}</div>
                </td>
                <td class="py-3.5 px-4">
                  <div class="text-xs font-medium text-slate-700">{{ item.nama_tahun }}</div>
                  <div class="text-[11px] text-slate-400">Semester {{ item.semester }}</div>
                </td>
                <td class="py-3.5 px-4 text-center">
                  <span
                    :class="[
                      'border text-[11px] font-semibold px-2.5 py-0.5 rounded-full inline-block',
                      jabatanBadge(item.jabatan)
                    ]"
                  >
                    {{ item.jabatan }}
                  </span>
                </td>
                <td class="py-3.5 px-4 text-center">
                  <div class="flex items-center justify-center gap-1.5">
                    <button
                      @click="openEditModal(item)"
                      class="px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs transition cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      @click="removeAnggota(item.id_anggota, item.nama_lengkap)"
                      class="px-2 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs transition cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredAnggota.length === 0">
                <td colspan="6" class="py-12 text-center text-slate-400 text-sm">
                  Belum ada data anggota yang terdaftar atau cocok dengan pencarian.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
    >
      <div class="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6">
        <div class="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 class="text-base font-bold text-slate-900">Edit Keanggotaan Siswa</h3>
            <p class="text-xs text-slate-500">{{ editForm.nama_lengkap }} ({{ editForm.nisn }})</p>
          </div>
          <button
            @click="showEditModal = false"
            class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveEditAnggota" class="space-y-4 mt-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pilihan Ekstrakurikuler *
            </label>
            <select
              v-model="editForm.id_ekskul"
              required
              class="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white"
            >
              <option v-for="e in ekskulList" :key="e.id_ekskul" :value="e.id_ekskul">
                {{ e.nama_ekskul }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Tahun Ajaran *
            </label>
            <select
              v-model="editForm.id_tahun_ajaran"
              required
              class="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white"
            >
              <option v-for="t in tahunAjaranList" :key="t.id_tahun_ajaran" :value="t.id_tahun_ajaran">
                {{ t.nama_tahun }} - {{ t.semester }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Jabatan *
            </label>
            <select
              v-model="editForm.jabatan"
              required
              class="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white"
            >
              <option v-for="jab in jabatanOptions" :key="jab" :value="jab">
                {{ jab }}
              </option>
            </select>
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              @click="showEditModal = false"
              class="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
