const express = require('express');
const SimulationController = require('../controllers/simulationController');

const router = express.Router();

// Definir rotas para simulações
router.post('/simulations', SimulationController.create);
router.get('/simulations', SimulationController.list);
router.get('/simulations/:id', SimulationController.getById);
router.put('/simulations/:id', SimulationController.update);
router.delete('/simulations/:id', SimulationController.delete);

module.exports = router;