const express = require('express');
const router = express.Router();
const airQualityController = require('../controllers/airQualityController');

router.get('/', airQualityController.getAirQualityData);
router.get('/thresholds', airQualityController.getAirQualityThresholds);
router.get('/download', airQualityController.downloadAirQualityData);

module.exports = router;