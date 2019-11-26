const User = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Referee = require("../models/referee");
const Manager = require('../models/manager');
const transport = require('nodemailer-sendgrid-transport');
var randomstring = require("randomstring");
var os = require("os");

const transporter = nodemailer.createTransport(transport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY

    }
}));


const {
    validationResult
} = require('express-validator/check');


exports.createUser = (req, res, next) => {

    const body = _.pick(req.body, ['name', 'last_name', 'phone', 'email', 'password', 'password1']);


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
    }

    User.findOne({
        email: body.email
    })
        .then(user => {
            if (user) {
                return res.status(400).json({
                    message: 'User already registered'
                })
            }
            //encrypt pawword / hash password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(body.password, salt, (err, hashed) => {
                    const newUser = new User(body);
                    newUser.password = hashed;
                    return newUser.save()
                        .then(user => {
                            if (user) {
                                const token = user.generateAuthToken();
                                user.token = token;
                                res.header('x-auth-token', token).json({
                                    message: 'New user created',
                                    user: _.pick(user, ['name', 'email', '_id'])
                                });
                            };

                            return transporter.sendMail({
                                to: 'robertm3lendez@gmail.com',
                                from: 'notifications@myfiosreferrals.com',

                                subject: `${user.name} has been registered`,
                                html: `<h3 style="text-transform: capitalize;">${user.name} ${user.last_name} just registered, go to activate the account</h3><br>
                                <p>Email: ${user.email}`
                            }, (err, info) => {
                                console.log(info);
                            })
                        })

                })
            })

        })
        .catch(err => console.log(err));



}

exports.loginUser = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ msg: 'please enter a valid email' });
    }


    if (password.length < 6) {
        return res.status(400).json({ msg: 'password must be at least 6 characters' });
    }

    User.findOne({
        email: email
    }).populate('coach', '-password')
        .then(user => {
            if (!user) return res.status(400).json({
                msg: 'Not User Found'

            });

            bcrypt.compare(password, user.password, (err, matched) => {
                console.log(matched);

                if (!matched) return res.status(400).json({
                    msg: 'Invalid email or password'
                });

                const token = user.generateAuthToken();
                // const decoded = jwt.decode(token);
                // req.user = decoded;

                res.header('x-auth-token', token).json({
                    message: 'Success',
                    token,
                    user
                });
            })
        }).catch(err => console.Console(err));

}
//get user 
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).populate('coach', '-password').select('-password');


        return res.status(200).json(user);

    } catch (e) {
        return res.status(400).json({ msg: 'no user found' });
    }

};

exports.getUserById = (req, res, next) => {
    const id = req.params.id;
    User.findById(id)
        .select('-password')
        .populate('coach', 'email name last_name')
        .exec()
        .then(user => {
            res.json(user)
        }).catch(err => console.log(err));
}


exports.getAllUsers = (req, res, next) => {
    if (req.user.roles.isAdmin) {
        User.find()
            .select('-password')
            .populate('coach', 'name last_name email')
            .exec()
            .then(users => {
                res.json(users);
            }).catch(err => {
                console.log(err);
            })
    } else if (req.user.roles.coach) {
        User.find({
            coach: {
                _id: req.user._id
            }
        })
            .select('-password')
            .populate('coach', 'name last_name email')
            .exec()
            .then(users => {
                res.json(users);
            }).catch(err => {
                console.log(err);
            })
    }

}

exports.updateUser = (req, res, next) => {
    const id = req.body._id;
    const user = req.body;
    let userFound;
    // let profileCompleted = false;
    // if (user.coach && user.vendor) {
    //     profileCompleted = true;
    // }

    User.findOneAndUpdate({
        _id: id
    }, {
        ...user

    }, {
        new: true
    })
        .populate('coach', 'name last_name email')
        .populate('manager', 'name last_name email')
        .exec()
        .then(u => {
            userFound = u;

            Referee.findOne({ _id: u._id })
                .then(n => {
                    if (n) return res.json(n);
                    return Referee.create({
                        _id: id,
                        name: req.body.name,
                        last_name: req.body.last_name,
                        phone: req.body.phone,
                        email: req.body.email,
                        userId: userFound._id
                    })
                })


        })
        .then(n => {
            Manager.findOne({ _id: userFound._id })
                .then(f => {
                    if (!f) {
                        return Manager.create({
                            _id: userFound._id,
                            name: req.body.name,
                            last_name: req.body.last_name,
                            phone: req.body.phone,
                            email: req.body.email,
                            userId: userFound._id
                        })
                    }
                })

        })
        .catch(err => console.log(err));
}

exports.deleteUser = (req, res, next) => {
    const userId = req.params.id;
    User.findOne({
        _id: id
    })
        .then(u => {
            if (!u) return res.status(400).json({
                message: 'Not user found'
            });

            res.json(u);
        })
        .catch(err => console.log(err));
}

exports.getCoaches = (req, res, next) => {
    const id = req.user._id;
    User.find()
        .select('-password')
        .then(coach => {

            if (!coach) return res.status(400).json({
                message: 'Not coaches found'
            });

            coach = coach.filter(u => u.roles.coach);
            res.json(coach);
        }

        ).catch(err => next(err))



}

exports.forgotPassword = (req, res, next) => {
    let email = req.body.email;

    if (email) {
        User.findOne({ email: email })
            .then(user => {
                if (!user) return res.status(400).json({ msg: 'user not found', status: 400 });

                // 

                let rd = randomstring.generate('hex');
                user.resetString = rd;
                user.resetExpire = Date.now() + 360000;

                return user.save();
            })
            .then(u => {

                let url = 'https://safe-woodland-98128.herokuapp.com/reset/' + u.resetString;

                return transporter.sendMail({
                    to: u.email,
                    from: 'reset@myfiosreferrals.com',

                    subject: 'Password Reset Email',
                    html: `<h3 style="text-transform: capitalize;">Hi ${u.name}, </h3>
                <br>
                <p>Here is a link for you to reset your password</p><br><a href="${url}"> Reset Password</a>`
                }, (err, info) => {
                    if (!err) return res.status(200).json({ msg: 'success', status: 200 });

                    res.status(400).json({ msg: "error has ocurred", status: 400 });

                })
            })
            .catch(err => console.log(err))
    }
}

exports.resetPassword = (req, res, next) => {
    let st = req.body.st;
    let resetUser;

    if (st) {
        User.findOne({ resetString: st })
            .then(user => {
                resetUser = user;
                if (!user) return res.status(400).json({ msg: 'Email has expired', status: 400 });

                return bcrypt.hash(req.body.password, 12);

            })
            .then(hashed => {

                if (hashed) {
                    resetUser.password = hashed;
                    resetUser.resetString = undefined;
                    resetUser.resetExpire = undefined;
                    return resetUser.save();

                }

            })
            .then(result => {
                console.log(result);
                res.status(200).json({ msg: 'success', status: 200 });
            })
            .catch(err => console.log(err))
    }
}