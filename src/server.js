const express = require('express');
const path = require('path');

const db = require('./db');
const { validateCreate, validateUpdate } = require('./validators');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));

function currentYear() {
  return new Date().getFullYear();
}

function withLamaStudi(row) {
  if (!row) return null;
  return {
    nim: row.nim,
    nama: row.nama,
    program_studi: row.program_studi,
    angkatan: row.angkatan,
    ipk: row.ipk,
    lama_studi: currentYear() - row.angkatan,
  };
}

const selectAll = db.prepare('SELECT * FROM mahasiswa ORDER BY nim');
const selectOne = db.prepare('SELECT * FROM mahasiswa WHERE nim = ?');
const insertOne = db.prepare(
  'INSERT INTO mahasiswa (nim, nama, program_studi, angkatan, ipk) VALUES (?, ?, ?, ?, ?)'
);
const updateOne = db.prepare(
  'UPDATE mahasiswa SET nama = ?, program_studi = ?, angkatan = ?, ipk = ? WHERE nim = ?'
);
const deleteOne = db.prepare('DELETE FROM mahasiswa WHERE nim = ?');

app.get('/api/mahasiswa', (req, res) => {
  const rows = selectAll.all().map(withLamaStudi);
  res.json({ ok: true, data: rows });
});

app.get('/api/mahasiswa/:nim', (req, res) => {
  const nim = Number.parseInt(req.params.nim, 10);
  if (!Number.isInteger(nim)) {
    return res.status(400).json({ ok: false, errors: ['NIM tidak valid.'] });
  }
  const row = selectOne.get(nim);
  if (!row) {
    return res.status(404).json({ ok: false, errors: ['Mahasiswa tidak ditemukan.'] });
  }
  res.json({ ok: true, data: withLamaStudi(row) });
});

app.post('/api/mahasiswa', (req, res) => {
  const result = validateCreate(req.body);
  if (!result.ok) {
    return res.status(400).json({ ok: false, errors: result.errors });
  }

  const existing = selectOne.get(result.data.nim);
  if (existing) {
    return res.status(409).json({ ok: false, errors: ['NIM sudah terdaftar.'] });
  }

  try {
    insertOne.run(
      result.data.nim,
      result.data.nama,
      result.data.program_studi,
      result.data.angkatan,
      result.data.ipk
    );
  } catch (error) {
    return res.status(500).json({ ok: false, errors: ['Gagal menyimpan data.'] });
  }

  const created = selectOne.get(result.data.nim);
  res.status(201).json({ ok: true, data: withLamaStudi(created) });
});

app.put('/api/mahasiswa/:nim', (req, res) => {
  const nim = Number.parseInt(req.params.nim, 10);
  if (!Number.isInteger(nim)) {
    return res.status(400).json({ ok: false, errors: ['NIM tidak valid.'] });
  }

  const existing = selectOne.get(nim);
  if (!existing) {
    return res.status(404).json({ ok: false, errors: ['Mahasiswa tidak ditemukan.'] });
  }

  const result = validateUpdate(req.body);
  if (!result.ok) {
    return res.status(400).json({ ok: false, errors: result.errors });
  }

  updateOne.run(
    result.data.nama,
    result.data.program_studi,
    result.data.angkatan,
    result.data.ipk,
    nim
  );

  const updated = selectOne.get(nim);
  res.json({ ok: true, data: withLamaStudi(updated) });
});

app.delete('/api/mahasiswa/:nim', (req, res) => {
  const nim = Number.parseInt(req.params.nim, 10);
  if (!Number.isInteger(nim)) {
    return res.status(400).json({ ok: false, errors: ['NIM tidak valid.'] });
  }

  const result = deleteOne.run(nim);
  if (result.changes === 0) {
    return res.status(404).json({ ok: false, errors: ['Mahasiswa tidak ditemukan.'] });
  }

  res.json({ ok: true, message: 'Mahasiswa berhasil dihapus.' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
