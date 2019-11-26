//jshint esversion:6
const Manager = require('../models/manager');
// const nodemailer = require('nodemailer');
// const transport = require('nodemailer-sendgrid-transport');
const _ = require('lodash');

// const transporter = nodemailer.createTransport(transport({
//   auth: {
//     api_key: process.env.SENDGRID_API_KEY

//   }
// }));



exports.getManagers = (req, res, next) => {

    if (req.user.roles.isAdmin || req.user.roles.coach) {
        Manager.find()
            .then(managers => {
                res.json(
                    managers
                );

            })
            .catch(err => res.status(400).json({ msg: "bad request" }));
    } else if (req.user.roles.active && !req.user.roles.isAdmin) {
        Manager.find({
            userId: req.user._id
        })
            .then(managers => {
                console.log(managers);
                res.json(
                    managers
                );

            })
            .catch(err => res.status(400).json({ msg: "bad request" }));
    }
}





//post Referee or referee
exports.postManager = (req, res, next) => {
    const name = req.body.name;
    const last_name = req.body.last_name;
    const phone = req.body.phone;
    const email = req.body.email;
    const userId = req.user._id;



    Manager.findOne({
        name: name,
        last_name: last_name,
        userId: userId
    })
        .then(result => {
            if (result) {

                res.status(400).json({
                    message: "Already register"
                });

            } else {
                const manager = new Manager({
                    name: name,
                    last_name: last_name,
                    phone: phone,
                    email: email,
                    userId: userId

                })
                manager.save()
                    .then((manager) => {
                        res.json(manager)
                    })
            }
        }).catch(err => console.log(err));


}

exports.getOneManager = (req, res, next) => {

    const id = req.params.id;
    Manager.findOne({
        _id: id
    })
        .then(manager => {

            res.json(
                manager
            );

        })
        .catch(err => console.log(err));
}


//post update referre page

exports.postUpdateManager = async (req, res) => {
    const id = req.params.id;

    try {
        const { name, last_name, email, phone } = req.body;
        console.log("REV:", req.body);
        let manager = await Manager.findOneAndUpdate({ _id: id }, req.body, { new: true });
        console.log("NEW", manager);
        return res.json(manager)

    } catch (error) {
        return res.status(500).json({ msg: "bad request" });
    }
    // // const title = "Update Referee";
    // // const path = 'update referee';
    // console.log("Manager received", req.body);
    // const body = _.pick(req.body, ['name', 'last_name', 'email', 'phone']);

    // Manager.findByIdAndUpdate(id, body, {
    //     new: true
    // })
    //     .then(manager => {
    //         console.log("Manager Updated", manager)
    //         res.json(manager);
    //     })
    //     .catch(err => console.log(err.message));


}

exports.deleteManager = (req, res, next) => {
    const id = req.params.id;
    Manager.findOneAndDelete({
        _id: id
    })
        .then(r => {
            res.json(r);
        })
        .catch(err => next(err))

}