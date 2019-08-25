//jshint esversion:6

const express = require('express');
const auth = require('../middlewares/auth');

const router = express.Router();


router.post('/email/collateral', auth, require('../controllers/flyer').sendFlyer);



module.exports = router;