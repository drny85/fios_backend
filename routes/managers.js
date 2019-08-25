//jshint esversion:6

const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth');

const managerController = require('../controllers/manager');


//add referralBy or referee 
router.post('/add-manager', auth, managerController.postManager);

//get all referees route
router.get('/all-managers', auth, managerController.getManagers);

router.get('/details/:id', auth, managerController.getOneManager);

// post update referee
router.post('/update/:id', auth, managerController.postUpdateManager);

router.delete('/delete/:id', auth, managerController.deleteManager);

module.exports = router;