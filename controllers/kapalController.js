const Kapal = require('../models/kapalModel');
const Dermaga = require('../models/dermagaModel');
const { errorHttp } = require('../middlewares/errorHandler');

const LIMIT_DEFAULT = 10;
const LIMIT_MAKS = 50;
const FIELD_SORT = ['kodeKapal', 'nama', 'kapasitas', 'jenis', 'createdAt'];
const FIELD_BOLEH_DIPILIH = ['kodeKapal', 'nama', 'kapasitas', 'jenis', 'rute', 'dermagaId', 'createdAt'];

// Mengubah bilangan dari query string menjadi bilangan bulat yang aman
function angkaAman(nilai, bawaan, min, maks) {
  const n = parseInt(nilai, 10);
  if (Number.isNaN(n)) return bawaan;
  return Math.min(Math.max(n, min), maks);
}

exports.create = async (req, res) => {
  try {
    const kapal = await Kapal.create(req.body);
    res.status(201).json(kapal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  const filter = {};

  // Filtering berdasarkan jenis (contoh: ?jenis=ketek)
  if (req.query.jenis) {
    filter.jenis = String(req.query.jenis);
  }

  // Filtering berdasarkan kode dermaga (contoh: ?dermaga=DRM01)
  if (req.query.dermaga) {
    const dermaga = await Dermaga.findOne({ kode: String(req.query.dermaga).toUpperCase() });
    filter.dermagaId = dermaga ? dermaga._id : { $in: [] };
  }

  // Filtering berdasarkan dermagaId langsung
  if (req.query.dermagaId) {
    filter.dermagaId = req.query.dermagaId;
  }

  // Filtering berdasarkan rute
  if (req.query.dermagaAwal) {
    filter['rute.dermagaAwal'] = String(req.query.dermagaAwal);
  }
  if (req.query.dermagaTujuan) {
    filter['rute.dermagaTujuan'] = String(req.query.dermagaTujuan);
  }

  const page = angkaAman(req.query.page, 1, 1, Number.MAX_SAFE_INTEGER);
  const limit = angkaAman(req.query.limit, LIMIT_DEFAULT, 1, LIMIT_MAKS);

  // Sorting: ?sort=nama (naik) atau ?sort=-nama (turun). Bawaan: terbaru dulu (-createdAt)
  const sortParam = String(req.query.sort || '-createdAt');
  const arah = sortParam.startsWith('-') ? -1 : 1;
  const sortField = sortParam.replace(/^-/, '');
  if (!FIELD_SORT.includes(sortField)) {
    throw errorHttp(400, `sort hanya boleh: ${FIELD_SORT.join(', ')}`);
  }

  // Projection: ?fields=kodeKapal,nama,jenis
  let select = '';
  if (req.query.fields) {
    const fields = String(req.query.fields).split(',').map((f) => f.trim());
    if (!fields.every((f) => FIELD_BOLEH_DIPILIH.includes(f))) {
      throw errorHttp(400, `fields hanya boleh: ${FIELD_BOLEH_DIPILIH.join(', ')}`);
    }
    select = fields.join(' ');
  }

  const query = Kapal.find(filter)
    .select(select)
    .sort({ [sortField]: arah, _id: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  // populate() otomatis menambahkan dermagaId ke hasil, jadi hanya dipanggil
  // bila dermagaId memang diminta (atau bila tidak ada pemilihan field)
  if (!select || select.split(' ').includes('dermagaId')) {
    query.populate('dermagaId', 'kode nama');
  }

  const [data, total] = await Promise.all([query, Kapal.countDocuments(filter)]);

  res.json({ data, page, limit, total, totalPages: Math.ceil(total / limit) });
};

exports.getById = async (req, res) => {
  const data = await Kapal.findById(req.params.id).populate('dermagaId');
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.json(data);
};

exports.update = async (req, res) => {
  try {
    const data = await Kapal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!data) throw errorHttp(404, 'Data tidak ditemukan');
    res.json(data);
  } catch (err) {
    if (err.status) throw err;
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  const data = await Kapal.findByIdAndDelete(req.params.id);
  if (!data) throw errorHttp(404, 'Data tidak ditemukan');
  res.status(204).send();
};
