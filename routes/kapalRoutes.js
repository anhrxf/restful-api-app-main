const express = require('express');
const router = express.Router();
const kapalController = require('../controllers/kapalController');

router.get('/', kapalController.getAll);
router.get('/:id', kapalController.getById);
router.post('/', kapalController.create);
router.put('/:id', kapalController.update);
router.delete('/:id', kapalController.remove);

module.exports = router;
