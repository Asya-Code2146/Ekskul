import express from 'express';
import {
  getAllEkskul,
  getEkskulById,
  createEkskul,
  updateEkskul,
  deleteEkskul
} from '../controllers/ekskulController.js';
import {
  getAllAnggota,
  createAnggota,
  updateAnggota,
  deleteAnggota
} from '../controllers/anggotaController.js';
import {
  getAllPembina,
  getAllSiswa,
  getAllTahunAjaran,
  getAllJurusan,
  getDashboardSummary
} from '../controllers/masterController.js';
import {
  getAllPrestasi,
  createPrestasi,
  deletePrestasi
} from '../controllers/prestasiController.js';
import {
  getAllJadwal,
  createJadwal,
  deleteJadwal,
  getAllPresensi,
  createPresensi
} from '../controllers/jadwalController.js';

const router = express.Router();

router.get('/dashboard/summary', getDashboardSummary);

router.get('/master/pembina', getAllPembina);
router.get('/master/siswa', getAllSiswa);
router.get('/master/tahun-ajaran', getAllTahunAjaran);
router.get('/master/jurusan', getAllJurusan);

router.get('/ekskul', getAllEkskul);
router.get('/ekskul/:id', getEkskulById);
router.post('/ekskul', createEkskul);
router.put('/ekskul/:id', updateEkskul);
router.delete('/ekskul/:id', deleteEkskul);

router.get('/anggota', getAllAnggota);
router.post('/anggota', createAnggota);
router.put('/anggota/:id', updateAnggota);
router.delete('/anggota/:id', deleteAnggota);

router.get('/prestasi', getAllPrestasi);
router.post('/prestasi', createPrestasi);
router.delete('/prestasi/:id', deletePrestasi);

router.get('/jadwal', getAllJadwal);
router.post('/jadwal', createJadwal);
router.delete('/jadwal/:id', deleteJadwal);

router.get('/presensi', getAllPresensi);
router.post('/presensi', createPresensi);

export default router;
