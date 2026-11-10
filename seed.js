// seed.js
// Mengisi basis data dengan data dermaga dan kapal wisata sungai.
// Aman dijalankan berulang: data lama dihapus dulu.
require('dotenv').config({ quiet: true });
const mongoose = require('mongoose');
const Dermaga = require('./models/dermagaModel');
const Kapal = require('./models/kapalModel');

const DERMAGA_DATA = [
  { kode: 'DRM01', nama: 'Dermaga Benteng Kuto Besak' },
  { kode: 'DRM02', nama: 'Dermaga 16 Ilir' },
  { kode: 'DRM03', nama: 'Dermaga Pulau Kemaro' },
  { kode: 'DRM04', nama: 'Dermaga Tangga Buntung' },
];

const KAPAL_DATA = [
  {
    kodeKapal: 'KPL-01',
    nama: 'Speedboat Musi Kilat 01',
    kapasitas: 12,
    jenis: 'speedboat',
    rute: { dermagaAwal: 'Dermaga Benteng Kuto Besak', dermagaTujuan: 'Dermaga 16 Ilir' },
  },
  {
    kodeKapal: 'KPL-02',
    nama: 'Ketek Sriwijaya Bahari',
    kapasitas: 8,
    jenis: 'ketek',
    rute: { dermagaAwal: 'Dermaga 16 Ilir', dermagaTujuan: 'Dermaga Pulau Kemaro' },
  },
  {
    kodeKapal: 'KPL-03',
    nama: 'Kapal Wisata Putri Kemaro',
    kapasitas: 45,
    jenis: 'kapal_wisata',
    rute: { dermagaAwal: 'Dermaga Benteng Kuto Besak', dermagaTujuan: 'Dermaga Pulau Kemaro' },
  },
  {
    kodeKapal: 'KPL-04',
    nama: 'Speedboat Ampera Express',
    kapasitas: 15,
    jenis: 'speedboat',
    rute: { dermagaAwal: 'Dermaga Benteng Kuto Besak', dermagaTujuan: 'Dermaga Tangga Buntung' },
  },
  {
    kodeKapal: 'KPL-05',
    nama: 'Ketek Wong Kito',
    kapasitas: 6,
    jenis: 'ketek',
    rute: { dermagaAwal: 'Dermaga Tangga Buntung', dermagaTujuan: 'Dermaga 16 Ilir' },
  },
  {
    kodeKapal: 'KPL-06',
    nama: 'Kapal Wisata Pesona Musi',
    kapasitas: 60,
    jenis: 'kapal_wisata',
    rute: { dermagaAwal: 'Dermaga Benteng Kuto Besak', dermagaTujuan: 'Dermaga Pulau Kemaro' },
  },
  {
    kodeKapal: 'KPL-07',
    nama: 'Ketek Berkah Sungai',
    kapasitas: 10,
    jenis: 'ketek',
    rute: { dermagaAwal: 'Dermaga 16 Ilir', dermagaTujuan: 'Dermaga Benteng Kuto Besak' },
  },
  {
    kodeKapal: 'KPL-08',
    nama: 'Speedboat Musi Jaya',
    kapasitas: 14,
    jenis: 'speedboat',
    rute: { dermagaAwal: 'Dermaga 16 Ilir', dermagaTujuan: 'Dermaga Tangga Buntung' },
  },
  {
    kodeKapal: 'KPL-09',
    nama: 'Kapal Wisata Belido Emas',
    kapasitas: 50,
    jenis: 'kapal_wisata',
    rute: { dermagaAwal: 'Dermaga Benteng Kuto Besak', dermagaTujuan: 'Dermaga 16 Ilir' },
  },
  {
    kodeKapal: 'KPL-10',
    nama: 'Ketek Bujang Gadis',
    kapasitas: 8,
    jenis: 'ketek',
    rute: { dermagaAwal: 'Dermaga Tangga Buntung', dermagaTujuan: 'Dermaga Benteng Kuto Besak' },
  },
];

async function main() {
  await mongoose.connect(process.env.DB_URI);
  await Kapal.deleteMany({});
  await Dermaga.deleteMany({});

  const dermaga = await Dermaga.insertMany(DERMAGA_DATA);

  const kapal = KAPAL_DATA.map((k, i) => ({
    ...k,
    dermagaId: dermaga[i % dermaga.length]._id,
  }));
  await Kapal.insertMany(kapal);

  console.log(`Seed selesai: ${dermaga.length} dermaga, ${kapal.length} kapal`);
  await mongoose.disconnect();
}

main().catch((err) => { console.error(err.message); process.exit(1); });