//jshint esversion:6
const Referee = require('../models/referee');
const nodemailer = require('nodemailer');
const transport = require('nodemailer-sendgrid-transport');
const _ = require('lodash');

const transporter = nodemailer.createTransport(transport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY

  }
}));


//get Referee page
exports.getAddReferee = (req, res, next) => {
  let title = 'Add Referre';
  let path = 'add-referee';

  res.render('referee/add-referee', {
    title: title,
    path: path,
    message: req.flash('error')
  });
}



exports.getReferees = async (req, res, next) => {



  try {
    if (req.user.roles.isAdmin) {
      const referees = await Referee.find();
      return res.status(200).json(referees);

    } else if (req.user.roles.active) {
      const referees = await Referee.find({ userId: req.user._id }).select('-referrals');
      return res.status(200).json(referees);

    }




  } catch (error) {

    return res.status(400).json({ msg: 'no referees found' });

  }


}


//post Referee or referee
exports.postReferee = (req, res, next) => {
  const name = req.body.name;
  const last_name = req.body.last_name;
  const phone = req.body.phone;
  const email = req.body.email;
  const userId = req.user._id;



  Referee.findOne({
    name: name,
    last_name: last_name
  })
    .then(referee => {
      if (referee) {

        return res.status(404).json({
          message: 'Referee already registered'
        })
        throw new Error('Referee already in file');

      } else {
        const referee = new Referee({
          name: name,
          last_name: last_name,
          phone: phone,
          email: email,
          referrals: [],
          userId: userId
        })
        referee.save()
          .then((referee) => {
            res.json(referee);
          })
      }
    }).catch(err => console.log(err));


}

exports.getOneReferee = (req, res, next) => {

  const id = req.params.id;
  Referee.findOne({
    _id: id
  })
    .then(referee => {

      res.json(
        referee
      );

    })
    .catch(err => console.log(err));
}

//get edit referee page

exports.getEditReferee = (req, res, next) => {

  const title = 'Edit Referee';
  const path = 'edit referee';
  const id = req.params.id;
  Referee.findOne({
    _id: id
  })
    .then(referee => {
      res.render('referee/edit', {
        referee: referee,
        title: title,
        path: path
      });
    })
    .catch(err => console.log(err))
}

//post update referre page

exports.postUpdateReferee = (req, res) => {
  const id = req.params.id;
  // const title = "Update Referee";
  // const path = 'update referee';
  const body = _.pick(req.body, ['name', 'last_name', 'email', 'phone']);

  Referee.findByIdAndUpdate(id, body, {
    new: true
  })
    .then(referee => {
      res.json(referee);
    })
    .catch(err => console.log(err.message));


}

exports.deleteReferee = (req, res) => {
  const id = req.params.id;

  Referee.findByIdAndDelete(id)
    .then(result => {
      res.json({
        message: 'Referee Deleted'
      });
    })
}