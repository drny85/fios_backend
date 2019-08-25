//jshint esversion:6
const auth = require('../middlewares/auth');
const express = require('express');

const router = express.Router();

const referralController = require('../controllers/referrals');

//getting all referrals
router.get('/referrals', auth, referralController.getReferrals);

//adding a new referral 
router.get('/add-referral', auth, referralController.getAddReferral);
//adding referral route
router.post('/add-referral', auth, referralController.addReferral);
// referral detail route
router.get('/detail/:id', auth, referralController.getReferral);
//editing referral route
router.get('/referral/edit/:id', auth, referralController.editReferral);

//update referral route
router.post('/referral/update/:id', auth, referralController.updateReferral);

//delete referral route
router.delete('/referral/delete/:id', auth, referralController.deleteReferral);

//get all referral by referee.
router.get('/referral/myreferrals/:id', auth, referralController.getAllReferralsById);


//get all referrals by status page 
router.get('/my-referrals/:status', auth, referralController.getReferralsStatus);

router.post('/bydates', auth, referralController.getReferraslByDate);


module.exports = router;