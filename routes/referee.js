//jshint esversion:6

const express = require('express');

const router = express.Router();
const auth = require('../middlewares/auth');

const refereeController = require('../controllers/referee');

// //get referralby page route
// router.get('/add-referee', refereeController.getAddReferee);

//add referralBy or referee 
router.post('/add-referee', auth, refereeController.postReferee);

//get all referees route
router.get('/all-referees', auth, refereeController.getReferees);

router.get('/details/:id', auth, refereeController.getOneReferee);

//get edit referee page
router.get('/edit/:id', auth, refereeController.getEditReferee);

// post update referee
router.post('/update/:id', auth, refereeController.postUpdateReferee);

router.delete('/delete/:id', auth, refereeController.deleteReferee);

module.exports = router;