const express = require('express');
const router = express.Router();
const airQualityController = require('../controllers/airQualityController');

router.get('/', airQualityController.getAirQualityData);
router.get('/thresholds', airQualityController.getAirQualityThresholds);  // Đảm bảo route này tồn tại

module.exports = router;