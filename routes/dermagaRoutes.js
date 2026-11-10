const express = require('express');
const router = express.Router();
const dermagaController = require('../controllers/dermagaController');

router.get('/', dermagaController.getAll);
router.get('/:id', dermagaController.getById);
router.post('/', dermagaController.create);
router.put('/:id', dermagaController.update);
router.delete('/:id', dermagaController.remove);

module.exports = router;
