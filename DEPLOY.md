# Panduan Simpan ke GitHub & Deploy

Aplikasi: **Laporan Hasil Belajar Mengaji - METODE UMMI - MI Islamiyah Malang**

Project ini dibangun dengan **React + Vite + Tailwind**. Hasil build berupa **satu file `index.html`** (semua CSS & JS sudah digabung), sehingga sangat mudah di-deploy ke mana saja.

---

## BAGIAN 1 — Simpan ke GitHub

### A. Lewat Website GitHub (paling mudah, tanpa perintah)

1. Buka https://github.com lalu login / daftar.
2. Klik tombol hijau **New** (atau ikon ➕ kanan atas → **New repository**).
3. Isi:
   - **Repository name**: `laporan-mengaji-ummi`
   - Pilih **Public** (gratis) atau **Private**.
   - **JANGAN** centang "Add a README".
4. Klik **Create repository**.
5. Di halaman berikutnya pilih **uploading an existing file**.
6. **Download semua file project ini** ke komputer Anda, lalu **drag & drop** seluruh folder/file ke halaman upload GitHub.
   > Penting: JANGAN ikut upload folder `node_modules` dan `dist` (file `.gitignore` sudah mengatur ini bila pakai Git).
7. Klik **Commit changes**.

### B. Lewat Git di Komputer (cara standar)

Pastikan sudah install **Git** (https://git-scm.com) dan **Node.js** (https://nodejs.org).

```bash
# 1. Masuk ke folder project
cd nama-folder-project

# 2. Inisialisasi git
git init
git add .
git commit -m "Initial commit - aplikasi laporan mengaji UMMI"

# 3. Hubungkan ke repository GitHub Anda
#    (ganti URL dengan URL repo Anda)
git remote add origin https://github.com/USERNAME/laporan-mengaji-ummi.git
git branch -M main
git push -u origin main
```

Jika diminta login, gunakan **username GitHub** dan **Personal Access Token** (bukan password biasa). Token dibuat di: GitHub → Settings → Developer settings → Personal access tokens.

---

## BAGIAN 2 — Deploy (Online / Bisa Diakses Publik)

Pilih **salah satu** cara di bawah. Yang paling direkomendasikan: **Vercel** atau **Netlify**.

### Opsi 1 — Vercel (Rekomendasi, Otomatis)

1. Buka https://vercel.com → **Sign up** pakai akun GitHub.
2. Klik **Add New → Project**.
3. Pilih repository `laporan-mengaji-ummi` → **Import**.
4. Vercel otomatis mendeteksi Vite. Pastikan:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Klik **Deploy**.
6. Tunggu ±1 menit. Selesai! Anda dapat URL seperti `https://laporan-mengaji-ummi.vercel.app`.

> Setiap kali Anda `git push` perubahan baru ke GitHub, Vercel otomatis update website.

### Opsi 2 — Netlify (Otomatis)

1. Buka https://netlify.com → **Sign up** pakai GitHub.
2. **Add new site → Import an existing project → GitHub**.
3. Pilih repository Anda.
4. Isi:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Klik **Deploy site**. Selesai.

### Opsi 3 — GitHub Pages (Gratis dari GitHub)

Karena hasil build adalah file tunggal, cara termudah:

1. Jalankan di komputer:
   ```bash
   npm install
   npm run build
   ```
2. Buka folder `dist`, akan ada `index.html`.
3. Buat repository baru bernama `USERNAME.github.io` (ganti USERNAME dengan username Anda).
4. Upload isi folder `dist` ke repository tersebut.
5. Buka Settings → Pages → pastikan source = `main` branch.
6. Website aktif di `https://USERNAME.github.io`.

> Catatan untuk GitHub Pages bila bukan repo `USERNAME.github.io`:
> tambahkan `base: '/nama-repo/'` di `vite.config.ts` sebelum build, mis:
> ```ts
> export default defineConfig({ base: '/laporan-mengaji-ummi/', plugins: [...] })
> ```

---

## BAGIAN 3 — Menjalankan di Komputer Sendiri (Development)

```bash
npm install      # install dependencies (sekali saja)
npm run dev      # jalankan mode development (http://localhost:5173)
npm run build    # build untuk produksi (hasil di folder dist/)
npm run preview  # cek hasil build secara lokal
```

---

## Catatan Penting tentang Penyimpanan Data

Aplikasi ini menyimpan data (guru, siswa, nilai, absensi, user) di **localStorage browser** masing-masing perangkat. Artinya:

- Data **tersimpan otomatis** di browser pengguna.
- Data **TIDAK tersinkron** antar perangkat/HP yang berbeda.
- Jika cache/browser dibersihkan, data bisa hilang.

Jika ke depan Anda butuh data **terpusat & tersinkron** untuk banyak guru/perangkat,
perlu ditambahkan **backend/database** (contoh gratis: **Supabase** atau **Firebase**).
Beri tahu saya jika ingin saya bantu integrasikan.

---

## Akun Demo

| Role  | Username | Password   |
|-------|----------|------------|
| Admin | `admin`  | `admin123` |
| Guru  | `guru`   | `guru123`  |
| Siswa | `siswa`  | `siswa123` |
