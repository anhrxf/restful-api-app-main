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

Header untuk request `POST`:
- `Content-Type`: `application/json`
*(Tidak diperlukan autentikasi / API key)*

### Skenario Pengujian (Sesuai Soal UTS):
1. **C1 - POST Entity Pendukung (Dermaga)**:
   - `POST /dermaga` (Body: `{"kode": "DRM01", "nama": "Dermaga Benteng Kuto Besak"}`)
   - Status: `201 Created`
2. **C1 - GET Entity Pendukung (Dermaga)**:
   - `GET /dermaga`
   - Status: `200 OK` (Array seluruh data Dermaga)
3. **C1 - POST Entity Utama (Kapal)**:
   - `POST /kapal` (Body sesuai contoh di atas dengan `dermagaId` valid)
   - Status: `201 Created`
4. **C2 - GET Seluruh Data Entity Utama (Kapal)**:
   - `GET /kapal`
   - Status: `200 OK` (Array data Kapal dengan default projection: `_id`, `kodeKapal`, `nama`, `kapasitas`, `jenis`)
5. **C3 - GET Filtering Entity Utama**:
   - `GET /kapal?jenis=ketek`
   - Status: `200 OK` (Hanya data kapal dengan jenis persis sama; `[]` jika tidak ada)
6. **C4 - GET Detail Entity Utama**:
   - `GET /kapal/:id`
   - Status: `200 OK` (Mengirim seluruh field lengkap dengan `dermagaId` ter-populate `{ kode, nama }`)
7. **Error Handling (A3)**:
   - **CastError (ID salah format)**: `GET /kapal/123` -> Status `400` (`{"message": "Format ID tidak valid"}`)
   - **ID tidak ada**: `GET /kapal/507f1f77bcf86cd799439011` -> Status `404` (`{"message": "Data kapal tidak ditemukan"}`)
   - **Duplikat kodeKapal (E11000)**: POST `kodeKapal` yang sudah ada -> Status `409`
   - **ValidationError**: POST data tanpa field wajib atau `kapasitas: 0` -> Status `400` (`{"message": "Data tidak valid", "detail": [...]}`)

---

## 🛠️ Cara Menjalankan

1. Konfigurasi di berkas `.env`:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/paw2
   CORS_ORIGIN=http://localhost:5173
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


