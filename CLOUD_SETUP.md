# Menayangkan KPI General Affair

## 1. Buat database Supabase

1. Buat proyek di Supabase.
2. Buka **SQL Editor**.
3. Jalankan seluruh isi `supabase-schema.sql`.
4. Buka **Project Settings > API**.
5. Salin **Project URL** dan **anon public key**.

## 2. Hubungkan aplikasi

Buka `cloud-config.js`, lalu isi:

```js
window.KPI_CLOUD_CONFIG = {
  supabaseUrl: 'PROJECT_URL_ANDA',
  anonKey: 'ANON_KEY_ANDA',
  recordId: 'kpi-general-affair'
};
```

Saat tersambung, indikator kiri bawah akan menampilkan **Tersambung ke cloud**.

## 3. Publikasikan

Unggah seluruh isi folder `kpi-general-affair` ke Netlify, Cloudflare Pages,
GitHub Pages, atau layanan hosting statis lain. Gunakan `index.html` sebagai halaman utama.

## 4. Tampilkan di Google Sites

Setelah dashboard memiliki link online, buka Google Sites lalu pilih **Insert > Embed > By URL** dan tempel link dashboard tersebut.

Panduan lebih lengkap tersedia di `GOOGLE_SITES.md`.

## Catatan akses

Konfigurasi ini mengikuti kebutuhan dashboard tanpa login. Siapa pun yang memiliki
tautan dapat membaca dan mengubah data. Jangan gunakan untuk data rahasia.
