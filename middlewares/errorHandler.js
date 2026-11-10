function errorHttp(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

function notFoundHandler(req, res) {
  res.status(404).json({ message: `Rute ${req.method} ${req.originalUrl} tidak ditemukan` });
}

function errorHandler(err, req, res, next) {
  // Body JSON rusak
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Format JSON tidak valid' });
  }

  // ID bukan ObjectId (CastError) - tanpa menyebut nama model
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Format ID tidak valid' });
  }

  // Pelanggaran Schema (ValidationError)
  if (err.name === 'ValidationError') {
    const detail = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: 'Data tidak valid', detail });
  }

  // Nilai unik bentrok (MongoDB E11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || err.keyValue || {})[0] || 'data';
    return res.status(409).json({ message: `Nilai unik untuk ${field} sudah digunakan` });
  }

  // Galat yang sengaja dilempar dengan status (mis. 404 data tidak ditemukan)
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }

  // Galat lain yang tidak terduga (tanpa stack trace)
  return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
}

module.exports = { errorHttp, notFoundHandler, errorHandler };