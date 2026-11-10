const express = require('express');
const router = express.Router();
const kapalController = require('../controllers/kapalController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', kapalController.getAll);
router.get('/:id', kapalController.getById);
router.post('/', cekApiKey, kapalController.create);
router.put('/:id', cekApiKey, kapalController.update);
router.delete('/:id', cekApiKey, kapalController.remove);

module.exports = router;
