import pool from '../config/db.js';

export const getAllPembina = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id_pembina, nip, nama_pembina FROM pembina ORDER BY nama_pembina ASC');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllSiswa = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.nisn, s.nama_lengkap, s.kelas, j.id_jurusan, j.kode_jurusan, j.nama_jurusan
      FROM siswa s
      INNER JOIN jurusan j ON s.id_jurusan = j.id_jurusan
      ORDER BY s.nama_lengkap ASC
    `);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllTahunAjaran = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id_tahun_ajaran, nama_tahun, semester FROM tahun_ajaran ORDER BY id_tahun_ajaran DESC');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllJurusan = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id_jurusan, kode_jurusan, nama_jurusan FROM jurusan ORDER BY kode_jurusan ASC');
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardSummary = async (req, res) => {
  try {
    const [[{ total_ekskul }]] = await pool.query('SELECT COUNT(*) AS total_ekskul FROM ekskul');
    const [[{ total_anggota }]] = await pool.query('SELECT COUNT(*) AS total_anggota FROM anggota_ekskul');
    const [[{ total_jadwal }]] = await pool.query('SELECT COUNT(*) AS total_jadwal FROM jadwal_kegiatan');
    const [[{ total_presensi }]] = await pool.query('SELECT COUNT(*) AS total_presensi FROM presensi');

    const [anggotaPerEkskul] = await pool.query(`
      SELECT e.nama_ekskul, COUNT(a.id_anggota) AS total
      FROM ekskul e
      LEFT JOIN anggota_ekskul a ON e.id_ekskul = a.id_ekskul
      GROUP BY e.id_ekskul, e.nama_ekskul
      ORDER BY total DESC
    `);

    const [anggotaPerKelas] = await pool.query(`
      SELECT 
        CASE 
          WHEN s.kelas LIKE 'X %' OR s.kelas LIKE 'X-%' OR s.kelas = 'X' THEN 'Kelas X'
          WHEN s.kelas LIKE 'XI %' OR s.kelas LIKE 'XI-%' OR s.kelas = 'XI' THEN 'Kelas XI'
          WHEN s.kelas LIKE 'XII %' OR s.kelas LIKE 'XII-%' OR s.kelas = 'XII' THEN 'Kelas XII'
          ELSE 'Lainnya'
        END AS tingkat,
        COUNT(a.id_anggota) AS total
      FROM anggota_ekskul a
      INNER JOIN siswa s ON a.nisn = s.nisn
      GROUP BY tingkat
      ORDER BY tingkat ASC
    `);

    const [aktivitasTerbaru] = await pool.query(`
      SELECT 
        a.id_anggota AS id,
        CONCAT('Siswa ', s.nama_lengkap, ' bergabung ke ', e.nama_ekskul) AS judul,
        CONCAT(s.kelas, ' • Jabatan: ', a.jabatan) AS keterangan,
        'Keanggotaan' AS tipe
      FROM anggota_ekskul a
      INNER JOIN siswa s ON a.nisn = s.nisn
      INNER JOIN ekskul e ON a.id_ekskul = e.id_ekskul
      ORDER BY a.id_anggota DESC
      LIMIT 5
    `);

    res.status(200).json({
      success: true,
      data: {
        total_ekskul,
        total_anggota,
        total_jadwal,
        total_presensi,
        anggotaPerEkskul,
        anggotaPerKelas,
        aktivitasTerbaru
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
