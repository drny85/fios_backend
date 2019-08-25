const Referral = require('../models/referral');

exports.getTodaySales = (req, res, next) => {

    let today = new Date();
    console.log(today.getDate())
    Referral.findById({
            userId: req.user._id
        })
        .then(referral => {

        })
}