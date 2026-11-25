<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api.js';
import { useToast } from '../services/toast.js';

const { showToast } = useToast();

const anggotaList = ref([]);
const siswaList = ref([]);
const ekskulList = ref([]);
const tahunAjaranList = ref([]);
const jurusanList = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');
const selectedEkskulFilter = ref('');

const showEditModal = ref(false);
const showKtaModal = ref(false);
const selectedKtaAnggota = ref(null);
const showPrintModal = ref(false);
const editForm = ref({
  id_anggota: null,
  nama_lengkap: '',
  nisn: '',
  kelas: '',
  jurusan: '',
  jenis_kelamin: 'Laki-laki',
  no_hp: '',
  email: '',
  id_ekskul: '',
  id_tahun_ajaran: '',
  jabatan: 'Anggota'
});

const form = ref({
  nama_lengkap: '',
  nisn: '',
  kelas: '',
  id_jurusan: '',
  jenis_kelamin: 'Laki-laki',
  no_hp: '',
  email: '',
  alamat: '',
  id_ekskul: '',
  id_tahun_ajaran: '',
  jabatan: 'Anggota'
});

const loadAllData = async () => {
  isLoading.value = true;
  try {
    const [resAnggota, resSiswa, resEkskul, resTahun, resJurusan] = await Promise.all([
      api.get('/anggota'),
      api.get('/master/siswa'),
      api.get('/ekskul'),
      api.get('/master/tahun-ajaran'),
      api.get('/master/jurusan')
    ]);
    anggotaList.value = resAnggota.data.data;
    siswaList.value = resSiswa.data.data;
    ekskulList.value = resEkskul.data.data;
    tahunAjaranList.value = resTahun.data.data;
    jurusanList.value = resJurusan.data.data;

    if (siswaList.value.length > 0 && !form.value.nisn) {
      onSelectSiswa(siswaList.value[0].nisn);
    }
    if (ekskulList.value.length > 0 && !form.value.id_ekskul) {
      form.value.id_ekskul = ekskulList.value[0].id_ekskul;
    }
    if (tahunAjaranList.value.length > 0 && !form.value.id_tahun_ajaran) {
      form.value.id_tahun_ajaran = tahunAjaranList.value[0].id_tahun_ajaran;
    }
  } catch (error) {
    console.error('Error loading data:', error);
  } finally {
    isLoading.value = false;
  }
};

const onSelectSiswa = (nisn) => {
  form.value.nisn = nisn;
  const s = siswaList.value.find((item) => item.nisn === nisn);
  if (s) {
    form.value.nama_lengkap = s.nama_lengkap;
    form.value.kelas = s.kelas;
    form.value.id_jurusan = s.id_jurusan;
  }
};

const filteredAnggota = computed(() => {
  let list = [...anggotaList.value];
  if (selectedEkskulFilter.value !== '') {
    list = list.filter((item) => String(item.id_ekskul) === String(selectedEkskulFilter.value));
  }
  if (searchQuery.value.trim() !== '') {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter((item) =>
      item.nama_lengkap.toLowerCase().includes(q) ||
      item.nisn.toLowerCase().includes(q) ||
      item.kelas.toLowerCase().includes(q) ||
      item.nama_ekskul.toLowerCase().includes(q)
    );
  }
  return list;
});

const currentPage = ref(1);
const perPage = ref(5);

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredAnggota.value.length / perPage.value));
});

const paginatedAnggota = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredAnggota.value.slice(start, start + perPage.value);
});

const setPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const registerAnggota = async () => {
  try {
    await api.post('/anggota', {
      nisn: form.value.nisn,
      id_ekskul: form.value.id_ekskul,
      id_tahun_ajaran: form.value.id_tahun_ajaran || (tahunAjaranList.value[0]?.id_tahun_ajaran),
      jabatan: form.value.jabatan
    });
    showToast('Pendaftaran anggota berhasil disimpan!');
    await loadAllData();
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal mendaftarkan anggota.', 'error');
  }
};

const resetForm = () => {
  if (siswaList.value.length > 0) {
    onSelectSiswa(siswaList.value[0].nisn);
  }
  form.value.no_hp = '';
  form.value.email = '';
  form.value.alamat = '';
};

const openEditModal = (item) => {
  editForm.value = {
    id_anggota: item.id_anggota,
    nama_lengkap: item.nama_lengkap,
    nisn: item.nisn,
    kelas: item.kelas,
    jurusan: item.kode_jurusan,
    jenis_kelamin: 'Laki-laki',
    no_hp: '08123456789',
    email: 'siswa@smkn5telkom.sch.id',
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
    showToast('Data anggota berhasil diperbarui!');
    showEditModal.value = false;
    await loadAllData();
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal memperbarui data.', 'error');
  }
};

const removeAnggota = async (id, nama) => {
  if (!confirm(`Keluarkan "${nama}" dari keanggotaan ekstrakurikuler ini?`)) return;
  try {
    await api.delete(`/anggota/${id}`);
    showToast('Anggota berhasil dikeluarkan dari ekskul.');
    await loadAllData();
  } catch (error) {
    showToast(error.response?.data?.message || 'Gagal menghapus keanggotaan.', 'error');
  }
};

const openKtaModal = (item) => {
  selectedKtaAnggota.value = item;
  showKtaModal.value = true;
};

const exportAnggotaCSV = () => {
  if (filteredAnggota.value.length === 0) {
    showToast('Tidak ada data anggota untuk diekspor.', 'error');
    return;
  }
  const headers = ['No', 'Nama Lengkap', 'NISN', 'Kelas', 'Jurusan', 'Ekstrakurikuler', 'Jabatan'];
  const rows = filteredAnggota.value.map((item, index) => [
    index + 1,
    `"${(item.nama_lengkap || '').replace(/"/g, '""')}"`,
    `"${item.nisn || ''}"`,
    `"${item.kelas || ''}"`,
    `"${item.kode_jurusan || ''}"`,
    `"${item.nama_ekskul || ''}"`,
    `"${item.jabatan || 'Anggota'}"`
  ]);
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `rekap_anggota_ekskul_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Laporan data anggota berhasil diekspor ke CSV!');
};

const openPrintModal = () => {
  if (filteredAnggota.value.length === 0) {
    showToast('Tidak ada data anggota untuk dicetak.', 'error');
    return;
  }
  showPrintModal.value = true;
};

const printReport = () => {
  window.print();
};

onMounted(() => {
  loadAllData();
});
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-4 bg-white p-4 sm:p-6 rounded-3xl border border-[#c8cbd3] shadow-xs">
        <div class="flex items-center gap-2.5 pb-4 border-b border-slate-100">
          <div class="w-8 h-8 rounded-xl bg-[#57707A]/15 text-[#57707A] flex items-center justify-center">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h2 class="text-base font-bold text-[#191D23]">Pendaftaran Anggota</h2>
          </div>
        </div>

        <form @submit.prevent="registerAnggota" class="space-y-3.5 mt-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
            <input
              v-model="form.nama_lengkap"
              type="text"
              required
              class="w-full border border-[#c8cbd3] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">NISN *</label>
            <select
              :value="form.nisn"
              @change="onSelectSiswa($event.target.value)"
              class="w-full border border-[#c8cbd3] rounded-xl px-3.5 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            >
              <option v-for="s in siswaList" :key="s.nisn" :value="s.nisn">
                {{ s.nisn }} - {{ s.nama_lengkap }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Kelas</label>
              <input
                v-model="form.kelas"
                type="text"
                class="w-full border border-[#c8cbd3] rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#57707A]"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Jurusan</label>
              <select
                v-model="form.id_jurusan"
                class="w-full border border-[#c8cbd3] rounded-xl px-3 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#57707A]"
              >
                <option v-for="j in jurusanList" :key="j.id_jurusan" :value="j.id_jurusan">
                  {{ j.kode_jurusan }}
                </option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Jenis Kelamin *</label>
            <input
              v-model="form.jenis_kelamin"
              type="text"
              placeholder="Laki-laki / Perempuan"
              class="w-full border border-[#c8cbd3] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">No. HP *</label>
            <input
              v-model="form.no_hp"
              type="text"
              placeholder="08xxxxxxxxxx"
              class="w-full border border-[#c8cbd3] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Email *</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="nama@email.com"
              class="w-full border border-[#c8cbd3] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Alamat</label>
            <input
              v-model="form.alamat"
              type="text"
              placeholder="Alamat tempat tinggal"
              class="w-full border border-[#c8cbd3] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Ekstrakurikuler *</label>
            <select
              v-model="form.id_ekskul"
              required
              class="w-full border border-[#c8cbd3] rounded-xl px-3.5 py-2 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            >
              <option v-for="e in ekskulList" :key="e.id_ekskul" :value="e.id_ekskul">
                {{ e.nama_ekskul }}
              </option>
            </select>
          </div>

          <div class="flex items-center gap-2 pt-3">
            <button
              type="submit"
              class="flex-1 bg-[#57707A] hover:bg-[#191D23] text-white font-semibold py-2.5 rounded-xl text-xs transition cursor-pointer"
            >
              Simpan
            </button>
            <button
              type="button"
              @click="resetForm"
              class="px-4 py-2.5 rounded-xl border border-[#c8cbd3] text-[#191D23] font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      </div>

      <div class="lg:col-span-8 bg-white p-4 sm:p-6 rounded-3xl border border-[#c8cbd3] shadow-xs">
        <div class="flex flex-col gap-3 pb-4 border-b border-slate-100">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-[#57707A]/15 text-[#57707A] flex items-center justify-center">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <h2 class="text-base font-bold text-[#191D23]">Daftar Anggota</h2>
                <p class="text-[11px] text-[#57707A]">Kelola keanggotaan dan kartu anggota siswa</p>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-wrap">
              <button
                @click="openPrintModal"
                class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#c8cbd3] bg-white hover:bg-slate-50 text-[#191D23] text-xs font-semibold transition cursor-pointer"
                title="Cetak Laporan Resmi"
              >
                <svg class="w-3.5 h-3.5 text-[#57707A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Cetak</span>
              </button>

              <button
                @click="exportAnggotaCSV"
                class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#c8cbd3] bg-white hover:bg-slate-50 text-[#191D23] text-xs font-semibold transition cursor-pointer"
                title="Export Data ke CSV"
              >
                <svg class="w-3.5 h-3.5 text-[#57707A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export</span>
              </button>

              <button
                @click="resetForm"
                class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#57707A] hover:bg-[#191D23] text-white text-xs font-semibold transition cursor-pointer shrink-0"
              >
                <span>+ Tambah Anggota</span>
              </button>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
            <div class="relative flex-1">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari nama, NISN, atau kelas..."
                class="w-full pl-9 pr-3 py-2 rounded-xl border border-[#c8cbd3] text-xs focus:outline-none focus:ring-2 focus:ring-[#57707A] bg-[#f8f9fa]"
              />
              <svg class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div class="w-full sm:w-48 shrink-0">
              <select
                v-model="selectedEkskulFilter"
                class="w-full px-3 py-2 rounded-xl border border-[#c8cbd3] text-xs bg-white text-[#191D23] focus:outline-none focus:ring-2 focus:ring-[#57707A]"
              >
                <option value="">Semua Ekskul</option>
                <option v-for="e in ekskulList" :key="e.id_ekskul" :value="e.id_ekskul">
                  {{ e.nama_ekskul }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="isLoading" class="p-12 text-center text-slate-400 text-sm">
          Memuat data keanggotaan...
        </div>
        <div v-else class="overflow-x-auto mt-4 rounded-2xl border border-[#c8cbd3]">
          <table class="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr class="bg-[#f8f9fa] border-b border-[#c8cbd3] text-[11px] font-bold text-slate-600 uppercase">
                <th class="py-3 px-3 w-10 text-center">No</th>
                <th class="py-3 px-3">Nama</th>
                <th class="py-3 px-3">NISN</th>
                <th class="py-3 px-3">Kelas</th>
                <th class="py-3 px-3">Jurusan</th>
                <th class="py-3 px-3">Ekstrakurikuler</th>
                <th class="py-3 px-3 text-center">Status</th>
                <th class="py-3 px-3 text-center w-28">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-xs">
              <tr
                v-for="(item, index) in paginatedAnggota"
                :key="item.id_anggota"
                class="hover:bg-slate-50 transition"
              >
                <td class="py-3.5 px-3 text-center text-slate-400 font-semibold">
                  {{ (currentPage - 1) * perPage + index + 1 }}
                </td>
                <td class="py-3.5 px-3 font-bold text-[#191D23]">{{ item.nama_lengkap }}</td>
                <td class="py-3.5 px-3 text-slate-600">{{ item.nisn }}</td>
                <td class="py-3.5 px-3 text-slate-600">{{ item.kelas }}</td>
                <td class="py-3.5 px-3 text-slate-600">{{ item.kode_jurusan }}</td>
                <td class="py-3.5 px-3 font-semibold text-[#57707A]">{{ item.nama_ekskul }}</td>
                <td class="py-3.5 px-3 text-center">
                  <span class="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-[#57707A] text-white">
                    Aktif
                  </span>
                </td>
                <td class="py-3.5 px-3 text-center">
                  <div class="flex items-center justify-center gap-1.5">
                    <button
                      @click="openKtaModal(item)"
                      class="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 transition cursor-pointer"
                      title="Lihat / Cetak Kartu Anggota (KTA)"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                    </button>
                    <button
                      @click="openEditModal(item)"
                      class="p-1.5 rounded-lg bg-slate-100 hover:bg-[#57707A] hover:text-white text-slate-600 transition cursor-pointer"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button
                      @click="removeAnggota(item.id_anggota, item.nama_lengkap)"
                      class="p-1.5 rounded-lg bg-red-50 hover:bg-red-600 hover:text-white text-red-600 transition cursor-pointer"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredAnggota.length === 0">
                <td colspan="8" class="py-12 text-center text-slate-400">
                  Belum ada data anggota.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between pt-4 text-xs text-[#57707A] gap-3">
          <div>
            Menampilkan {{ filteredAnggota.length > 0 ? (currentPage - 1) * perPage + 1 : 0 }}-{{ Math.min(currentPage * perPage, filteredAnggota.length) }} dari {{ filteredAnggota.length }} anggota
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

    <div
      v-if="showEditModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
    >
      <div class="bg-white rounded-3xl shadow-2xl border border-[#c8cbd3] w-full max-w-lg p-6">
        <div class="flex items-center justify-between pb-4 border-b border-[#DEDCDC]">
          <h3 class="text-base font-bold text-[#191D23]">Edit Anggota</h3>
          <button
            @click="showEditModal = false"
            class="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveEditAnggota" class="space-y-3.5 mt-4 text-xs">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Nama Lengkap *</label>
              <input
                v-model="editForm.nama_lengkap"
                type="text"
                required
                class="w-full border border-[#c8cbd3] rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">NISN</label>
              <input
                v-model="editForm.nisn"
                type="text"
                disabled
                class="w-full border border-[#c8cbd3] rounded-xl px-3 py-2 text-xs bg-slate-100 text-slate-500"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Kelas</label>
              <input
                v-model="editForm.kelas"
                type="text"
                class="w-full border border-[#c8cbd3] rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Jurusan</label>
              <input
                v-model="editForm.jurusan"
                type="text"
                class="w-full border border-[#c8cbd3] rounded-xl px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Jenis Kelamin *</label>
              <input
                v-model="editForm.jenis_kelamin"
                type="text"
                class="w-full border border-[#c8cbd3] rounded-xl px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1">Jabatan</label>
              <select
                v-model="editForm.jabatan"
                class="w-full border border-[#c8cbd3] rounded-xl px-3 py-2 text-xs bg-white"
              >
                <option value="Ketua">Ketua</option>
                <option value="Wakil Ketua">Wakil Ketua</option>
                <option value="Sekretaris">Sekretaris</option>
                <option value="Bendahara">Bendahara</option>
                <option value="Anggota">Anggota</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Ekstrakurikuler *</label>
            <select
              v-model="editForm.id_ekskul"
              required
              class="w-full border border-[#c8cbd3] rounded-xl px-3 py-2 text-xs bg-white"
            >
              <option v-for="e in ekskulList" :key="e.id_ekskul" :value="e.id_ekskul">
                {{ e.nama_ekskul }}
              </option>
            </select>
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t border-[#DEDCDC]">
            <button
              type="button"
              @click="showEditModal = false"
              class="px-5 py-2.5 rounded-xl border border-[#c8cbd3] text-[#191D23] font-semibold hover:bg-slate-50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              class="px-6 py-2.5 rounded-xl bg-[#57707A] text-white font-semibold hover:bg-[#191D23] transition cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="showKtaModal && selectedKtaAnggota"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all"
    >
      <div class="bg-white rounded-3xl shadow-2xl border border-[#c8cbd3] w-full max-w-md overflow-hidden">
        <div class="p-4 bg-[#191D23] text-white flex items-center justify-between border-b border-[#57707A]/40">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span class="text-xs font-bold uppercase tracking-wider">Kartu Tanda Anggota (KTA) Digital</span>
          </div>
          <button @click="showKtaModal = false" class="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div class="relative bg-gradient-to-br from-[#191D23] via-[#222834] to-[#35464f] rounded-2xl p-5 text-white shadow-xl border border-slate-700/60 overflow-hidden">
            <div class="absolute -right-8 -bottom-8 w-36 h-36 bg-[#57707A]/20 rounded-full blur-2xl pointer-events-none"></div>

            <div class="flex items-center justify-between border-b border-white/15 pb-3">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <div class="text-[10px] font-bold tracking-widest text-[#C5BAC4] uppercase">SMKN 5 TELKOM BANDA ACEH</div>
                  <div class="text-xs font-black tracking-wide text-white">KARTU ANGGOTA EKSTRAKURIKULER</div>
                </div>
              </div>
              <span class="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">AKTIF</span>
            </div>

            <div class="flex items-start gap-4 mt-4">
              <div class="w-16 h-20 rounded-xl bg-white/10 border border-white/20 flex flex-col items-center justify-center shrink-0">
                <svg class="w-8 h-8 text-[#C5BAC4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span class="text-[8px] text-[#C5BAC4] mt-1 font-semibold">FOTO</span>
              </div>

              <div class="flex-1 min-w-0 space-y-1 text-xs">
                <div>
                  <div class="text-[9px] text-[#C5BAC4] uppercase font-semibold">Nama Anggota</div>
                  <div class="font-bold text-sm text-white truncate">{{ selectedKtaAnggota.nama_lengkap }}</div>
                </div>
                <div class="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <div class="text-[9px] text-[#C5BAC4] uppercase font-semibold">NISN</div>
                    <div class="font-semibold text-white">{{ selectedKtaAnggota.nisn }}</div>
                  </div>
                  <div>
                    <div class="text-[9px] text-[#C5BAC4] uppercase font-semibold">Kelas</div>
                    <div class="font-semibold text-white">{{ selectedKtaAnggota.kelas }}</div>
                  </div>
                </div>
                <div>
                  <div class="text-[9px] text-[#C5BAC4] uppercase font-semibold">Ekstrakurikuler</div>
                  <div class="font-bold text-emerald-300 text-xs">{{ selectedKtaAnggota.nama_ekskul }}</div>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between border-t border-white/15 pt-3 mt-4 text-[9px] text-[#C5BAC4]">
              <div>
                <span>Jabatan: </span>
                <span class="font-bold text-white">{{ selectedKtaAnggota.jabatan || 'Anggota' }}</span>
              </div>
              <div class="font-mono">ID: EK-{{ selectedKtaAnggota.nisn?.slice(-4) || '2026' }}</div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-2 mt-5">
            <button
              @click="showKtaModal = false"
              class="px-4 py-2 rounded-xl border border-[#c8cbd3] text-[#191D23] font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
            >
              Tutup
            </button>
            <button
              @click="openPrintModal"
              class="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#191D23] hover:bg-[#57707A] text-white font-semibold text-xs transition cursor-pointer"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>Cetak Laporan</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="showPrintModal"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div class="bg-white rounded-3xl shadow-2xl border border-[#c8cbd3] w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <div class="flex items-center justify-between pb-4 border-b border-slate-200">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span class="text-xs font-bold text-[#191D23] uppercase">Pratinjau Dokumen Resmi</span>
          </div>
          <button @click="showPrintModal = false" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div id="print-area" class="mt-6 p-6 sm:p-8 border border-slate-300 rounded-xl bg-white text-slate-800 text-xs">
          <div class="text-center border-b-2 border-slate-800 pb-3 mb-4">
            <div class="text-xs font-bold tracking-widest text-slate-600 uppercase">PEMERINTAH ACEH • DINAS PENDIDIKAN</div>
            <div class="text-base sm:text-lg font-black text-slate-900 tracking-wide">SMK NEGERI 5 TELKOM BANDA ACEH</div>
            <div class="text-[11px] text-slate-600 mt-0.5">Jl. Stadion H. Dimurthala No. 1, Lampineung, Banda Aceh 23126</div>
            <div class="text-[10px] text-slate-500">Email: smkn5telkombandaaceh@gmail.com | Website: smkn5telkom.sch.id</div>
          </div>

          <div class="text-center my-4">
            <div class="text-sm font-bold uppercase underline tracking-wider text-slate-900">REKAPITULASI DATA ANGGOTA EKSTRAKURIKULER</div>
            <div class="text-[11px] text-slate-600 mt-1">Tahun Ajaran 2026/2027 • Status: Terverifikasi</div>
          </div>

          <table class="w-full text-left border-collapse border border-slate-300 my-4 text-[11px]">
            <thead>
              <tr class="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase">
                <th class="py-2 px-2 border-r border-slate-300 text-center w-8">No</th>
                <th class="py-2 px-2 border-r border-slate-300">Nama Lengkap</th>
                <th class="py-2 px-2 border-r border-slate-300">NISN</th>
                <th class="py-2 px-2 border-r border-slate-300">Kelas</th>
                <th class="py-2 px-2 border-r border-slate-300">Ekstrakurikuler</th>
                <th class="py-2 px-2 text-center">Jabatan</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in filteredAnggota" :key="item.id_anggota" class="border-b border-slate-200">
                <td class="py-1.5 px-2 text-center border-r border-slate-200 font-semibold">{{ idx + 1 }}</td>
                <td class="py-1.5 px-2 border-r border-slate-200 font-bold">{{ item.nama_lengkap }}</td>
                <td class="py-1.5 px-2 border-r border-slate-200">{{ item.nisn }}</td>
                <td class="py-1.5 px-2 border-r border-slate-200">{{ item.kelas }} {{ item.kode_jurusan }}</td>
                <td class="py-1.5 px-2 border-r border-slate-200 font-medium">{{ item.nama_ekskul }}</td>
                <td class="py-1.5 px-2 text-center">{{ item.jabatan || 'Anggota' }}</td>
              </tr>
            </tbody>
          </table>

          <div class="grid grid-cols-2 gap-6 mt-8 pt-4 text-[11px] text-center">
            <div>
              <div>Mengetahui,</div>
              <div class="font-bold text-slate-900 mt-0.5">Kepala SMK Negeri 5 Telkom</div>
              <div class="h-14"></div>
              <div class="font-bold underline text-slate-900">Drs. Dahlia, M.Pd.</div>
              <div class="text-[10px] text-slate-500">NIP. 19680512 199403 1 004</div>
            </div>
            <div>
              <div>Banda Aceh, 25 November 2026</div>
              <div class="font-bold text-slate-900 mt-0.5">Koordinator Ekstrakurikuler</div>
              <div class="h-14"></div>
              <div class="font-bold underline text-slate-900">Fajar Siddiq, S.Kom., M.T.</div>
              <div class="text-[10px] text-slate-500">NIP. 19850921 201001 1 012</div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2.5 mt-5">
          <button
            @click="showPrintModal = false"
            class="px-4 py-2 rounded-xl border border-[#c8cbd3] text-[#191D23] font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
          >
            Tutup
          </button>
          <button
            @click="printReport"
            class="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#191D23] hover:bg-[#57707A] text-white font-semibold text-xs transition cursor-pointer"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Cetak Dokumen Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
