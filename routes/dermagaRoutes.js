const express = require('express');
const router = express.Router();
const dermagaController = require('../controllers/dermagaController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', dermagaController.getAll);
router.get('/:id', dermagaController.getById);
router.post('/', cekApiKey, dermagaController.create);
router.put('/:id', cekApiKey, dermagaController.update);
router.delete('/:id', cekApiKey, dermagaController.remove);

module.exports = router;
