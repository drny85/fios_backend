//jshint esversion:6
const auth = require('../middlewares/auth');

const express = require('express');

const router = express.Router();

const reportController = require('../controllers/reports');

router.post('/nightly', auth, reportController.sendNithlyReport);

module.exports = router;