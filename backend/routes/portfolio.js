const express = require('express');
const router = express.Router();
const controller = require('../controllers/portfolioController');
const validator = require('../validators/portfolioValidator');

router.get('/summary', validator, controller.getSummary);

module.exports = router;