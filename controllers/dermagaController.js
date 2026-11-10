const Dermaga = require('../models/dermagaModel');
const { errorHttp } = require('../middlewares/errorHandler');

exports.create = async (req, res) => {
  try {
    const dermaga = await Dermaga.create(req.body);
    res.status(201).json(dermaga);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAll = async (req, res) => {
  res.json(await Dermaga.find());
};

exports.getById = async (req, res) => {
  const dermaga = await Dermaga.findById(req.params.id);
  if (!dermaga) throw errorHttp(404, 'Dermaga tidak ditemukan');
  res.json(dermaga);
};

exports.update = async (req, res) => {
  try {
    const dermaga = await Dermaga.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true }
    );
    if (!dermaga) throw errorHttp(404, 'Dermaga tidak ditemukan');
    res.json(dermaga);
  } catch (err) {
    if (err.status) throw err;
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  const dermaga = await Dermaga.findByIdAndDelete(req.params.id);
  if (!dermaga) throw errorHttp(404, 'Dermaga tidak ditemukan');
  res.status(204).send();
};
