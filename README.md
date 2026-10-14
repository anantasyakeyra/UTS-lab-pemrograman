# UTS Lab Pemrograman - Aplikasi Data Mahasiswa

Aplikasi CRUD (Create, Read, Update, Delete) untuk mengelola data mahasiswa menggunakan
Node.js + Express dan database SQLite.

## Menjalankan Aplikasi

```bash
npm install
npm start
```

Buka browser di `http://localhost:3000`.

Data disimpan di `db/mahasiswa.db` dan tetap tersedia setelah aplikasi dimatikan.

## Validasi

- NIM, nama, program studi, angkatan, dan IPK wajib diisi.
- NIM harus berupa bilangan bulat dan unik.
- IPK harus berada pada rentang 0.00 - 4.00.
- Lama studi dihitung otomatis: tahun sekarang - angkatan.
