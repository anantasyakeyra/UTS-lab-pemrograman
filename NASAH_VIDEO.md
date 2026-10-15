# Naskah Video UTS Lab Pemrograman

## Aplikasi CRUD Data Mahasiswa


### \[0:00 – 0:30\] PEMBUKAAN

**Tampil: Layar browser di http://localhost:3000, halaman utama aplikasi**

> "Assalamu'alaikum. Perkenalkan nama saya \[NAMA KAMU\], NIM \[NIM KAMU\], mahasiswa \[PROGRAM STUDI\].

> Ini adalah video demonstrasi tugas UTS Lab Pemrograman semester gasal 2026/2027.

> Saya membuat aplikasi **CRUD Data Mahasiswa** menggunakan **Node.js + Express** untuk backend, **SQLite** sebagai database, dan **HTML/CSS/JavaScript vanilla** untuk frontend.

> Aplikasi ini memenuhi semua ketentuan soal: Create, Read, Update, Delete, validasi input, perhitungan otomatis lama studi, dan data persisten di database."


### \[0:30 – 1:30\] DEMO FITUR CREATE (MENAMBAH MAHASISWA)

**Tampil: Form "Tambah Mahasiswa" di bagian atas halaman**

> "Pertama, fitur **Create**. Di sini ada form untuk menambah mahasiswa baru.

> Field yang wajib diisi: NIM, Nama, Program Studi, Angkatan, dan IPK.

> Saya coba isi data:

> - NIM: 2023001

> - Nama: Ahmad Rizki

> - Program Studi: Teknik Informatika

> - Angkatan: 2023

> - IPK: 3.85

> Klik **Simpan**."

**Aksi: Isi form, klik Simpan. Tampil baris baru di tabel.**

> "Data berhasil ditambah dan langsung muncul di tabel di bawahnya. Perhatikan kolom **Lama Studi** — nilainya **2 tahun** (2025 - 2023). Nilai ini **dihitung otomatis oleh program**, bukan diinput manual."


### \[1:30 – 2:30\] DEMO VALIDASI INPUT

**Tampil: Coba submit form kosong / data tidak valid**

> "Sistem memiliki validasi ketat sesuai ketentuan soal.

> Coba saya kosongkan **Nama** dan klik Simpan..."

**Aksi: Kosongkan nama, klik Simpan. Muncul pesan error merah: "Nama wajib diisi."**

> "Muncul pesan error: **'Nama wajib diisi.'**

> Coba **IPK di luar rentang**, misal 5.0..."

**Aksi: Isi IPK 5.0, klik Simpan. Error: "IPK wajib berupa angka antara 0.00 dan 4.00."**

> "Error: **'IPK wajib berupa angka antara 0.00 dan 4.00.'**

> Coba **NIM duplikat** — masukkan NIM 2023001 lagi..."

**Aksi: Isi NIM 2023001 lagi. Error: "NIM sudah terdaftar."**

> "Error: **'NIM sudah terdaftar.'** — sistem menolak NIM yang sudah ada.

> Semua validasi berjalan: field wajib, tipe data, range IPK, dan unique NIM."


### \[2:30 – 3:30\] DEMO READ (DAFTAR & DETAIL)

**Tampil: Tabel daftar mahasiswa, klik tombol Detail**

> "Fitur **Read** ada dua: daftar dan detail.

> Tabel menampilkan semua mahasiswa: NIM, Nama, Program Studi, Angkatan, IPK, dan **Lama Studi** yang dihitung otomatis.

> Tombol **Detail** menampilkan modal lengkap data mahasiswa."

**Aksi: Klik tombol Detail pada baris pertama. Modal terbuka.**

> "Di sini terlihat detail lengkap termasuk Lama Studi 2 tahun. Klik **Tutup** untuk kembali."


### \[3:30 – 4:30\] DEMO UPDATE (MENGUBAH DATA)

**Tampil: Klik tombol Ubah, form terisi data lama, ubah nilai, simpan**

> "Fitur **Update**: klik tombol **Ubah** pada baris yang ingin diedit.

> Form di atas berubah jadi mode **'Ubah Mahasiswa'**, NIM **terkunci (disabled)** karena NIM tidak boleh diubah, field lain terisi data lama.

> Saya ubah:

> - IPK: 3.85 → **3.95**

> - Angkatan: 2023 → **2022** (ini akan mengubah Lama Studi jadi 3 tahun)

> Klik **Perbarui**."

**Aksi: Klik Ubah, ubah IPK dan Angkatan, klik Perbarui. Tabel update, Lama Studi jadi 3.**

> "Data terupdate. Lama Studi sekarang **3 tahun** (2025 - 2022) — **terhitung ulang otomatis**."


### \[4:30 – 5:15\] DEMO DELETE (MENGHAPUS DATA)

**Tampil: Klik tombol Hapus, konfirmasi, data hilang**

> "Fitur **Delete**: klik tombol **Hapus** (merah), muncul konfirmasi browser.

> Klik **OK**."

**Aksi: Klik Hapus, konfirmasi OK. Baris hilang dari tabel.**

> "Data terhapus permanen dari database."


### \[5:15 – 6:30\] PENJELASAN TEKNIS: BACKEND & DATABASE

**Tampil: Buka folder project, tunjuk struktur file**

> "Sekarang jelaskan struktur kode.

> **Backend** ada di folder `src/`:

> - `server.js` — entry point Express, routing API RESTful

> - `db.js` — koneksi SQLite pakai built-in `node:sqlite` (Node.js v22+), tidak butuh native module

> - `validators.js` — validasi input Create & Update terpisah"

**Tampil: Buka src/server.js, scroll pelan**

> "API endpoints:

> - `GET /api/mahasiswa` — ambil semua data + hitung lama\_studi

> - `GET /api/mahasiswa/:nim` — detail satu mahasiswa

> - `POST /api/mahasiswa` — create dengan validasi & cek NIM duplikat

> - `PUT /api/mahasiswa/:nim` — update, NIM dari URL, validasi field lain

> - `DELETE /api/mahasiswa/:nim` — hapus by NIM

> Semua response format JSON: `\{ ok: true, data: ... \}` atau `\{ ok: false, errors: \[...\] \}`."

**Tampil: Buka src/db.js**

> "Database pakai **SQLite** file `db/mahasiswa.db`. Tabel `mahasiswa` dengan kolom: `nim` (PK), `nama`, `program\_studi`, `angkatan`, `ipk`. Mode WAL untuk performa. Data **persisten** — tetap ada setelah server restart."


### \[6:30 – 7:15\] PENJELASAN FRONTEND

**Tampil: Buka public/index.html, app.js, styles.css**

> "Frontend di folder `public/`:

> - `index.html` — struktur halaman: header, form, tabel, modal detail

> - `app.js` — logika: fetch API, render tabel, handle form submit/edit/delete, modal

> - `styles.css` — styling modern, responsive, aksesibel

> Tidak pakai framework CSS/JS — murni vanilla biar ringan dan jelas alurnya."


### \[7:15 – 8:00\] DEMO PERSISTENSI DATA (RESTART SERVER)

**Tampil: Terminal - Ctrl+C stop server, npm start lagi, refresh browser**

> "Buktikan data persisten: saya **stop server** (Ctrl+C), lalu **jalankan ulang** (`npm start`).

> Refresh browser..."

**Aksi: Stop server, start lagi, refresh. Data masih ada.**

> "Data **masih ada** — karena tersimpan di file `db/mahasiswa.db`, bukan di memory."


### \[8:00 – 8:30\] PENUTUP

**Tampil: Kembali ke halaman utama, tutup browser**

> "Itu demonstrasi aplikasi CRUD Data Mahasiswa.

> Fitur lengkap: Create, Read, Update, Delete. Validasi sesuai ketentuan. Lama Studi dihitung otomatis. Database SQLite persisten. Backend Node.js + Express, Frontend vanilla.

> Source code ada di GitHub: github.com/anantasyakeyra/UTS-lab-pemrograman

> Terima kasih. Wassalamu'alaikum."


## PERINTAH QUICK START UNTUK REKAMAN

```
Buka cmd lalu masuk ke folder project  
npm install  
npm start  
buka http://localhost:3000 di browser
```


**Selamat merekam! 🎬** Kalau butuh revisi naskah (misal tambah/hapus bagian), tinggal bilang.
