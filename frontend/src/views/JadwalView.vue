<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api.js';

const jadwalList = ref([]);
const presensiList = ref([]);
const ekskulList = ref([]);
const anggotaList = ref([]);
const isLoading = ref(false);

const activeSubTab = ref('jadwal');

const formJadwal = ref({
  id_ekskul: '',
  tanggal: new Date().toISOString().split('T')[0],
  agenda: ''
});

const formPresensi = ref({
  id_jadwal: '',
  id_anggota: '',
  status_kehadiran: 'Hadir'
});

const loadData = async () => {
  isLoading.value = true;
  try {
    const [resJadwal, resPresensi, resEkskul, resAnggota] = await Promise.all([
      api.get('/jadwal'),
      api.get('/presensi'),
      api.get('/ekskul'),
      api.get('/anggota')
    ]);
    jadwalList.value = resJadwal.data.data;
    presensiList.value = resPresensi.data.data;
    ekskulList.value = resEkskul.data.data;
    anggotaList.value = resAnggota.data.data;

    if (ekskulList.value.length > 0 && !formJadwal.value.id_ekskul) {
      formJadwal.value.id_ekskul = ekskulList.value[0].id_ekskul;
    }
    if (jadwalList.value.length > 0 && !formPresensi.value.id_jadwal) {
      formPresensi.value.id_jadwal = jadwalList.value[0].id_jadwal;
    }
    if (anggotaList.value.length > 0 && !formPresensi.value.id_anggota) {
      formPresensi.value.id_anggota = anggotaList.value[0].id_anggota;
    }
  } catch (error) {
    console.error('Error loading jadwal/presensi:', error);
  } finally {
    isLoading.value = false;
  }
};

const saveJadwal = async () => {
  try {
    await api.post('/jadwal', formJadwal.value);
    alert('Jadwal kegiatan berhasil ditambahkan!');
    formJadwal.value.agenda = '';
    await loadData();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menambahkan jadwal.');
  }
};

const removeJadwal = async (id, agenda) => {
  if (!confirm(`Hapus jadwal kegiatan "${agenda}"?`)) return;
  try {
    await api.delete(`/jadwal/${id}`);
    await loadData();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menghapus jadwal.');
  }
};

const savePresensi = async () => {
  try {
    await api.post('/presensi', formPresensi.value);
    alert('Catatan presensi berhasil disimpan!');
    await loadData();
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menyimpan presensi.');
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-2 border-b border-[#c8cbd3] pb-3">
      <button
        @click="activeSubTab = 'jadwal'"
        :class="[
          'px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer',
          activeSubTab === 'jadwal'
            ? 'bg-[#191D23] text-white shadow-xs'
            : 'bg-white text-[#57707A] hover:bg-slate-100'
        ]"
      >
        Jadwal Kegiatan ({{ jadwalList.length }})
      </button>
      <button
        @click="activeSubTab = 'presensi'"
        :class="[
          'px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition cursor-pointer',
          activeSubTab === 'presensi'
            ? 'bg-[#191D23] text-white shadow-xs'
            : 'bg-white text-[#57707A] hover:bg-slate-100'
        ]"
      >
        Presensi Kehadiran ({{ presensiList.length }})
      </button>
    </div>

    <div v-if="activeSubTab === 'jadwal'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-3xl border border-[#c8cbd3] shadow-xs h-fit">
        <h2 class="text-base font-bold text-[#191D23] pb-3 border-b border-slate-100">Tambah Jadwal Baru</h2>
        <form @submit.prevent="saveJadwal" class="space-y-4 mt-4">
          <div>
            <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Ekstrakurikuler *</label>
            <select
              v-model="formJadwal.id_ekskul"
              required
              class="w-full border border-[#c8cbd3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            >
              <option v-for="e in ekskulList" :key="e.id_ekskul" :value="e.id_ekskul">
                {{ e.nama_ekskul }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Tanggal Pelaksanaan *</label>
            <input
              v-model="formJadwal.tanggal"
              type="date"
              required
              class="w-full border border-[#c8cbd3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Agenda Kegiatan *</label>
            <textarea
              v-model="formJadwal.agenda"
              required
              rows="3"
              placeholder="Contoh: Latihan Rutin & Pemantapan Materi Web Development"
              class="w-full border border-[#c8cbd3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            ></textarea>
          </div>

          <button
            type="submit"
            class="w-full bg-[#191D23] hover:bg-[#57707A] text-white font-semibold py-2.5 rounded-xl text-sm transition shadow-sm cursor-pointer"
          >
            Simpan Jadwal
          </button>
        </form>
      </div>

      <div class="lg:col-span-2 bg-white rounded-3xl border border-[#c8cbd3] shadow-xs overflow-hidden flex flex-col">
        <div class="p-5 border-b border-slate-100">
          <h2 class="text-base font-bold text-[#191D23]">Daftar Jadwal Kegiatan</h2>
          <p class="text-xs text-[#57707A]">Agenda dan kegiatan ekstrakurikuler terjadwal</p>
        </div>

        <div v-if="isLoading" class="p-12 text-center text-slate-400 text-sm">
          Memuat jadwal kegiatan...
        </div>
        <div v-else class="overflow-x-auto flex-1">
          <table class="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr class="bg-[#191D23] text-white text-xs uppercase font-bold tracking-wider">
                <th class="py-3 px-4 w-12 text-center">NO</th>
                <th class="py-3 px-4">TANGGAL</th>
                <th class="py-3 px-4">EKSTRAKURIKULER</th>
                <th class="py-3 px-4">AGENDA</th>
                <th class="py-3 px-4 text-center w-24">AKSI</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm">
              <tr
                v-for="(item, index) in jadwalList"
                :key="item.id_jadwal"
                class="hover:bg-slate-50 transition"
              >
                <td class="py-3.5 px-4 text-center text-xs font-semibold text-slate-400">{{ index + 1 }}</td>
                <td class="py-3.5 px-4 font-semibold text-[#191D23] text-xs sm:text-sm whitespace-nowrap">
                  {{ item.tanggal }}
                </td>
                <td class="py-3.5 px-4">
                  <div class="font-bold text-[#191D23] text-sm">{{ item.nama_ekskul }}</div>
                  <div class="text-[11px] text-[#57707A]">{{ item.kategori }}</div>
                </td>
                <td class="py-3.5 px-4 text-slate-700 text-xs sm:text-sm">
                  {{ item.agenda }}
                </td>
                <td class="py-3.5 px-4 text-center">
                  <button
                    @click="removeJadwal(item.id_jadwal, item.agenda)"
                    class="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs transition cursor-pointer"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
              <tr v-if="jadwalList.length === 0">
                <td colspan="5" class="py-12 text-center text-slate-400 text-sm">
                  Belum ada jadwal kegiatan dibuat.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-3xl border border-[#c8cbd3] shadow-xs h-fit">
        <h2 class="text-base font-bold text-[#191D23] pb-3 border-b border-slate-100">Catat Presensi Siswa</h2>
        <form @submit.prevent="savePresensi" class="space-y-4 mt-4">
          <div>
            <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Pilih Jadwal Kegiatan *</label>
            <select
              v-model="formPresensi.id_jadwal"
              required
              class="w-full border border-[#c8cbd3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            >
              <option v-for="j in jadwalList" :key="j.id_jadwal" :value="j.id_jadwal">
                {{ j.nama_ekskul }} - {{ j.tanggal }} ({{ j.agenda }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Pilih Anggota Siswa *</label>
            <select
              v-model="formPresensi.id_anggota"
              required
              class="w-full border border-[#c8cbd3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            >
              <option v-for="a in anggotaList" :key="a.id_anggota" :value="a.id_anggota">
                {{ a.nama_lengkap }} ({{ a.nama_ekskul }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-[#191D23] uppercase tracking-wider mb-1.5">Status Kehadiran *</label>
            <select
              v-model="formPresensi.status_kehadiran"
              required
              class="w-full border border-[#c8cbd3] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#57707A]"
            >
              <option value="Hadir">Hadir</option>
              <option value="Izin">Izin</option>
              <option value="Sakit">Sakit</option>
              <option value="Alpa">Alpa</option>
            </select>
          </div>

          <button
            type="submit"
            class="w-full bg-[#191D23] hover:bg-[#57707A] text-white font-semibold py-2.5 rounded-xl text-sm transition shadow-sm cursor-pointer"
          >
            Simpan Presensi
          </button>
        </form>
      </div>

      <div class="lg:col-span-2 bg-white rounded-3xl border border-[#c8cbd3] shadow-xs overflow-hidden flex flex-col">
        <div class="p-5 border-b border-slate-100">
          <h2 class="text-base font-bold text-[#191D23]">Rekap Presensi Kegiatan</h2>
          <p class="text-xs text-[#57707A]">Log kehadiran anggota dalam sesi kegiatan</p>
        </div>

        <div v-if="isLoading" class="p-12 text-center text-slate-400 text-sm">
          Memuat data presensi...
        </div>
        <div v-else class="overflow-x-auto flex-1">
          <table class="w-full text-left border-collapse min-w-[550px]">
            <thead>
              <tr class="bg-[#191D23] text-white text-xs uppercase font-bold tracking-wider">
                <th class="py-3 px-4 w-12 text-center">NO</th>
                <th class="py-3 px-4">SISWA</th>
                <th class="py-3 px-4">EKSTRAKURIKULER</th>
                <th class="py-3 px-4">AGENDA & TANGGAL</th>
                <th class="py-3 px-4 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm">
              <tr
                v-for="(item, index) in presensiList"
                :key="item.id_presensi"
                class="hover:bg-slate-50 transition"
              >
                <td class="py-3.5 px-4 text-center text-xs font-semibold text-slate-400">{{ index + 1 }}</td>
                <td class="py-3.5 px-4">
                  <div class="font-bold text-[#191D23] text-sm">{{ item.nama_lengkap }}</div>
                  <div class="text-xs text-[#57707A]">NISN: {{ item.nisn }} • {{ item.kelas }}</div>
                </td>
                <td class="py-3.5 px-4 font-semibold text-[#191D23] text-sm">
                  {{ item.nama_ekskul }}
                </td>
                <td class="py-3.5 px-4">
                  <div class="text-xs font-medium text-slate-800">{{ item.agenda }}</div>
                  <div class="text-[11px] text-[#57707A]">{{ item.tanggal }}</div>
                </td>
                <td class="py-3.5 px-4 text-center">
                  <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#57707A] text-white">
                    {{ item.status_kehadiran }}
                  </span>
                </td>
              </tr>
              <tr v-if="presensiList.length === 0">
                <td colspan="5" class="py-12 text-center text-slate-400 text-sm">
                  Belum ada catatan presensi tersimpan.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
