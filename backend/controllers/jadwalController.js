import pool from '../config/db.js';

export const getAllJadwal = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        j.id_jadwal,
        j.id_ekskul,
        e.nama_ekskul,
        e.kategori,
        DATE_FORMAT(j.tanggal, '%Y-%m-%d') AS tanggal,
        j.agenda,
        (SELECT COUNT(*) FROM presensi p WHERE p.id_jadwal = j.id_jadwal) AS total_presensi
      FROM jadwal_kegiatan j
      INNER JOIN ekskul e ON j.id_ekskul = e.id_ekskul
      ORDER BY j.tanggal DESC
    `);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createJadwal = async (req, res) => {
  try {
    const { id_ekskul, tanggal, agenda } = req.body;
    if (!id_ekskul || !tanggal || !agenda) {
      return res.status(400).json({
        success: false,
        message: 'Field id_ekskul, tanggal, dan agenda wajib diisi'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO jadwal_kegiatan (id_ekskul, tanggal, agenda) VALUES (?, ?, ?)',
      [id_ekskul, tanggal, agenda]
    );

    res.status(201).json({
      success: true,
      message: 'Jadwal kegiatan berhasil ditambahkan',
      data: { id_jadwal: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteJadwal = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM jadwal_kegiatan WHERE id_jadwal = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data jadwal tidak ditemukan' });
    }
    res.status(200).json({ success: true, message: 'Jadwal kegiatan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllPresensi = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        pr.id_presensi,
        pr.id_jadwal,
        j.agenda,
        DATE_FORMAT(j.tanggal, '%Y-%m-%d') AS tanggal,
        e.nama_ekskul,
        pr.id_anggota,
        s.nama_lengkap,
        s.nisn,
        s.kelas,
        pr.status_kehadiran
      FROM presensi pr
      INNER JOIN jadwal_kegiatan j ON pr.id_jadwal = j.id_jadwal
      INNER JOIN ekskul e ON j.id_ekskul = e.id_ekskul
      INNER JOIN anggota_ekskul a ON pr.id_anggota = a.id_anggota
      INNER JOIN siswa s ON a.nisn = s.nisn
      ORDER BY pr.id_presensi DESC
    `);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPresensi = async (req, res) => {
  try {
    const { id_jadwal, id_anggota, status_kehadiran } = req.body;
    if (!id_jadwal || !id_anggota) {
      return res.status(400).json({
        success: false,
        message: 'Field id_jadwal dan id_anggota wajib diisi'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO presensi (id_jadwal, id_anggota, status_kehadiran) VALUES (?, ?, ?)',
      [id_jadwal, id_anggota, status_kehadiran || 'Hadir']
    );

    res.status(201).json({
      success: true,
      message: 'Presensi berhasil dicatat',
      data: { id_presensi: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
