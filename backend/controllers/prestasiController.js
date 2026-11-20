import pool from '../config/db.js';

export const getAllPrestasi = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id_prestasi,
        p.id_ekskul,
        e.nama_ekskul,
        p.nisn,
        s.nama_lengkap,
        s.kelas,
        j.kode_jurusan,
        p.peringkat
      FROM prestasi p
      INNER JOIN ekskul e ON p.id_ekskul = e.id_ekskul
      INNER JOIN siswa s ON p.nisn = s.nisn
      INNER JOIN jurusan j ON s.id_jurusan = j.id_jurusan
      ORDER BY p.id_prestasi DESC
    `);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPrestasi = async (req, res) => {
  try {
    const { id_ekskul, nisn, peringkat } = req.body;
    if (!id_ekskul || !nisn || !peringkat) {
      return res.status(400).json({
        success: false,
        message: 'Field id_ekskul, nisn, dan peringkat wajib diisi'
      });
    }

    const [result] = await pool.query(
      'INSERT INTO prestasi (id_ekskul, nisn, peringkat) VALUES (?, ?, ?)',
      [id_ekskul, nisn, peringkat]
    );

    res.status(201).json({
      success: true,
      message: 'Data prestasi berhasil ditambahkan',
      data: { id_prestasi: result.insertId }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePrestasi = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM prestasi WHERE id_prestasi = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Data prestasi tidak ditemukan' });
    }
    res.status(200).json({ success: true, message: 'Data prestasi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
