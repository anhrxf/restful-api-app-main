const mongoose = require('mongoose');

const ruteSchema = new mongoose.Schema({
  dermagaAwal: {
    type: String,
    trim: true,
  },
  dermagaTujuan: {
    type: String,
    trim: true,
  },
}, { _id: false });

const kapalSchema = new mongoose.Schema({
  kodeKapal: {
    type: String,
    required: [true, 'kodeKapal wajib diisi'],
    unique: true,
    trim: true,
  },
  nama: {
    type: String,
    required: [true, 'nama wajib diisi'],
    trim: true,
  },
  kapasitas: {
    type: Number,
    required: [true, 'kapasitas wajib diisi'],
    min: [1, 'kapasitas minimal 1'],
  },
  jenis: {
    type: String,
    required: [true, 'jenis wajib diisi'],
    trim: true,
  },
  rute: {
    type: ruteSchema,
    default: () => ({}),
  },
  dermagaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dermaga',
    required: [true, 'dermagaId wajib diisi'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Kapal', kapalSchema);
