const Dermaga = require('../models/dermagaModel');
const { errorHttp } = require('../middlewares/errorHandler');

exports.create = async (req, res, next) => {
  try {
    const { kode, nama } = req.body;
    const dermaga = await Dermaga.create({ kode, nama });
    res.status(201).json(dermaga);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const dermaga = await Dermaga.find();
    res.status(200).json(dermaga);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const dermaga = await Dermaga.findById(req.params.id);
    if (!dermaga) throw errorHttp(404, 'Data dermaga tidak ditemukan');
    res.status(200).json(dermaga);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { kode, nama } = req.body;
    const dermaga = await Dermaga.findByIdAndUpdate(
      req.params.id,
      { kode, nama },
      { returnDocument: 'after', runValidators: true }
    );
    if (!dermaga) throw errorHttp(404, 'Data dermaga tidak ditemukan');
    res.status(200).json(dermaga);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const dermaga = await Dermaga.findByIdAndDelete(req.params.id);
    if (!dermaga) throw errorHttp(404, 'Data dermaga tidak ditemukan');
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
