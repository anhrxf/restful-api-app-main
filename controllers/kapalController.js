const Kapal = require('../models/kapalModel');
const { errorHttp } = require('../middlewares/errorHandler');

exports.create = async (req, res, next) => {
  try {
    // C1: Hanya field dari tabel topik yang diterima dari body; field lain diabaikan
    const { kodeKapal, nama, kapasitas, jenis, rute, dermagaId } = req.body;
    const kapal = await Kapal.create({
      kodeKapal,
      nama,
      kapasitas,
      jenis,
      rute,
      dermagaId,
    });
    res.status(201).json(kapal);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};

    // C3: Filter dengan query parameter [filter]: sama persis
    if (req.query.jenis !== undefined) {
      filter.jenis = req.query.jenis;
    }

    // C3: Projection: daftar data hanya mengirim field _id, [unik], [teks], [angka], dan [filter]
    // misal: .select('kodeKapal nama kapasitas jenis')
    // Berlaku juga saat memakai filter
    let select = 'kodeKapal nama kapasitas jenis';
    if (req.query.fields) {
      select = req.query.fields.split(',').map((f) => f.trim()).join(' ');
    }

    const data = await Kapal.find(filter).select(select);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    // C4: [ref] di-populate (memuat kode dan nama). ID tidak ada: 404. ID salah format: 400.
    // GET /kapal/:id tetap mengirim semua field (tanpa pembatasan projection C3).
    const data = await Kapal.findById(req.params.id).populate('dermagaId', 'kode nama');
    if (!data) throw errorHttp(404, 'Data kapal tidak ditemukan');
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { kodeKapal, nama, kapasitas, jenis, rute, dermagaId } = req.body;
    const data = await Kapal.findByIdAndUpdate(
      req.params.id,
      { kodeKapal, nama, kapasitas, jenis, rute, dermagaId },
      { returnDocument: 'after', runValidators: true }
    );
    if (!data) throw errorHttp(404, 'Data kapal tidak ditemukan');
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const data = await Kapal.findByIdAndDelete(req.params.id);
    if (!data) throw errorHttp(404, 'Data kapal tidak ditemukan');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
