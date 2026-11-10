# RESTful API - Topik 35: Kapal Wisata Sungai

**Mahasiswa**: M. Fadhil Anhar (2428240158)  
**Mata Kuliah**: Pengembangan Aplikasi Web 2 (PAW 2)

---

## 📌 Deskripsi Entitas & Spesifikasi

### 1. Entity Pendukung: `Dermaga`
- **Model**: `models/dermagaModel.js`
- **Controller**: `controllers/dermagaController.js`
- **Route**: `routes/dermagaRoutes.js`
- **Endpoint**: `/dermaga`
- **Skema / Field**:
  - `kode`: String, Wajib, unik, trim, uppercase (contoh: `"DRM01"`)
  - `nama`: String, Wajib, trim (contoh: `"Dermaga Benteng Kuto Besak"`)
- **Contoh Body POST**:
  ```json
  {
    "kode": "DRM01",
    "nama": "Dermaga Benteng Kuto Besak"
  }
  ```

### 2. Entity Utama: `Kapal`
- **Model**: `models/kapalModel.js`
- **Controller**: `controllers/kapalController.js`
- **Route**: `routes/kapalRoutes.js`
- **Endpoint**: `/kapal`
- **Skema / Field**:
  - `kodeKapal`: String, Wajib, unik, trim
  - `nama`: String, Wajib, trim
  - `kapasitas`: Number, Wajib, minimal 1
  - `jenis`: String, Wajib, trim (dipakai untuk filter, contoh: `speedboat`, `ketek`, `kapal_wisata`)
  - `rute`: Subdocument (embedding), `{ dermagaAwal: String, dermagaTujuan: String }`, tanpa `_id`
  - `dermagaId`: ObjectId (referencing), Wajib, ref: `'Dermaga'`
  - `createdAt`: Date, default: waktu data dibuat
- **Contoh Body POST**:
  ```json
  {
    "kodeKapal": "KPL-01",
    "nama": "Speedboat Musi Kilat 01",
    "kapasitas": 11,
    "jenis": "speedboat",
    "rute": {
      "dermagaAwal": "Dermaga Benteng Kuto Besak",
      "dermagaTujuan": "Dermaga Pulau Kemaro"
    },
    "dermagaId": "<_id Dermaga>"
  }
  ```

---

## 🚀 Panduan Pengujian Postman

Header wajib untuk request `POST`, `PUT`, `DELETE`:
- `x-api-key`: `isi-dengan-kunci-anda` (sesuai file `.env`)
- `Content-Type`: `application/json`

### Skenario Pengujian:
1. **GET & POST Entity Pendukung (Dermaga)**:
   - `POST /dermaga` (Body: JSON kode & nama)
   - `GET /dermaga`
2. **POST Entity Utama (Kapal)**:
   - `POST /kapal` (Body sesuai contoh di atas, masukkan `_id` Dermaga valid)
3. **GET Filtering Entity Utama**:
   - `GET /kapal?jenis=ketek`
   - `GET /kapal?jenis=speedboat`
4. **GET Detail Entity Utama**:
   - `GET /kapal/:id` (mengembalikan data kapal dengan populate dermagaId)
5. **Skenario Galat (Error Handling)**:
   - POST duplikat `kodeKapal` yang sudah ada (mengembalikan status 400 galat duplikat)
   - POST data tanpa field wajib atau `kapasitas: 0` (mengembalikan status 400 galat validasi)
6. **GET Projection Entity Utama**:
   - `GET /kapal?fields=kodeKapal,nama,jenis`

---

## 🛠️ Cara Menjalankan

1. Pastikan MongoDB sudah berjalan di lokal atau siapkan URI MongoDB Atlas di `.env`:
   ```env
   PORT=3000
   API_KEY=isi-dengan-kunci-anda
   CORS_ORIGIN=http://localhost:5173
   DB_URI=mongodb://localhost:27017/paw2
   ```
2. Jalankan perintah instalasi (jika belum):
   ```bash
   npm install
   ```
3. Mengisi data awal (seeding database):
   ```bash
   node seed.js
   ```
4. Menjalankan server dalam mode development:
   ```bash
   npm run dev
   ```


