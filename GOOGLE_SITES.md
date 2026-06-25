# Membuka Dashboard KPI di Google Sites

Google Sites tidak bisa menjalankan folder aplikasi langsung dari komputer. Supaya dashboard ini bisa dibuka di `sites.google.com`, dashboard perlu dipublikasikan dulu sebagai link online, lalu link tersebut dimasukkan ke Google Sites dengan fitur **Embed**.

## Cara yang disarankan

1. Hubungkan data ke cloud mengikuti panduan di `CLOUD_SETUP.md`.
2. Publikasikan folder `kpi-general-affair` ke layanan hosting statis, misalnya Netlify, Cloudflare Pages, GitHub Pages, atau hosting internal perusahaan.
3. Salin link dashboard yang sudah online, misalnya:

   ```text
   https://nama-dashboard.netlify.app
   ```

4. Buka Google Sites.
5. Pilih halaman tempat dashboard akan ditampilkan.
6. Klik **Sisipkan / Insert**.
7. Pilih **Embed**.
8. Pilih tab **By URL / Dengan URL**.
9. Tempel link dashboard.
10. Klik **Insert / Sisipkan**, lalu atur ukuran frame agar dashboard terlihat penuh.
11. Klik **Publish / Publikasikan**.

## Kode embed alternatif

Jika Google Sites meminta kode embed, gunakan pola berikut dan ganti `URL_DASHBOARD_ANDA` dengan link dashboard yang sudah online:

```html
<iframe
  src="URL_DASHBOARD_ANDA"
  style="width:100%; height:900px; border:0; border-radius:16px;"
  loading="lazy"
  title="Dashboard KPI General Affair">
</iframe>
```

## Penyimpanan data

Jika `cloud-config.js` sudah diisi dengan Supabase, data akan tersimpan bersama di cloud. Artinya data yang diinput dari kantor, laptop lain, atau lokasi lain akan tetap terbaca selama membuka link dashboard yang sama.

Jika `cloud-config.js` belum diisi, dashboard tetap bisa tampil, tetapi data hanya tersimpan di perangkat/browser masing-masing.

## Catatan penting

Versi saat ini dibuat tanpa login sesuai permintaan terakhir. Jika dashboard dipasang di Google Sites publik, siapa pun yang memiliki akses ke halaman tersebut bisa membuka dan mengubah data KPI.
