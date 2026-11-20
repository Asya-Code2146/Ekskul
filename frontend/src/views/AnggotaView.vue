<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api.js';

const anggotaList = ref([]);
const siswaList = ref([]);
const ekskulList = ref([]);
const tahunAjaranList = ref([]);
const jurusanList = ref([]);
const isLoading = ref(false);
const searchQuery = ref('');

const showEditModal = ref(false);
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

const registerAnggota = async () => {
  try {
    await api.post('/anggota', {
      nisn: form.value.nisn,
      id_ekskul: form.value.id_ekskul,
      id_tahun_ajaran: form.value.id_tahun_ajaran || (tahunAjaranList.value[0]?.id_tahun_ajaran),
      jabatan: form.value.jabatan
    });
    alert('Pendaftaran anggota berhasil disimpan!');
    await loadAllData();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal mendaftarkan anggota.');
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
    alert('Data anggota berhasil diperbarui!');
    showEditModal.value = false;
    await loadAllData();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal memperbarui data.');
  }
};

const removeAnggota = async (id, nama) => {
  if (!confirm(`Keluarkan "${nama}" dari keanggotaan ekstrakurikuler ini?`)) return;
  try {
    await api.delete(`/anggota/${id}`);
    await loadAllData();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menghapus keanggotaan.');
  }
};

onMounted(() => {
  loadAllData();
});
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div class="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#c8cbd3] shadow-xs">
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

      <div class="lg:col-span-8 bg-white p-6 rounded-3xl border border-[#c8cbd3] shadow-xs">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-[#57707A]/15 text-[#57707A] flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 class="text-base font-bold text-[#191D23]">Daftar Anggota</h2>
          </div>

          <div class="flex items-center gap-3">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari anggota..."
                class="pl-9 pr-3 py-2 rounded-xl border border-[#c8cbd3] text-xs focus:outline-none focus:ring-2 focus:ring-[#57707A] bg-[#f8f9fa] w-48 sm:w-60"
              />
              <svg class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <button
              @click="resetForm"
              class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#57707A] hover:bg-[#191D23] text-white text-xs font-semibold transition cursor-pointer shrink-0"
            >
              <span>+ Tambah Anggota</span>
            </button>
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
                v-for="(item, index) in filteredAnggota"
                :key="item.id_anggota"
                class="hover:bg-slate-50 transition"
              >
                <td class="py-3.5 px-3 text-center text-slate-400 font-semibold">{{ index + 1 }}</td>
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
          <div>1-{{ filteredAnggota.length }} dari {{ anggotaList.length }} anggota</div>
          <div class="flex items-center gap-1">
            <button class="px-2.5 py-1 rounded-md border border-[#c8cbd3] bg-white hover:bg-slate-50 cursor-pointer">&lt;</button>
            <button class="px-3 py-1 rounded-md bg-[#57707A] text-white font-bold">1</button>
            <button class="px-3 py-1 rounded-md border border-[#c8cbd3] bg-white hover:bg-slate-50 cursor-pointer">2</button>
            <button class="px-3 py-1 rounded-md border border-[#c8cbd3] bg-white hover:bg-slate-50 cursor-pointer">3</button>
            <button class="px-3 py-1 rounded-md border border-[#c8cbd3] bg-white hover:bg-slate-50 cursor-pointer">5</button>
            <button class="px-2.5 py-1 rounded-md border border-[#c8cbd3] bg-white hover:bg-slate-50 cursor-pointer">&gt;</button>
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
  </div>
</template>
