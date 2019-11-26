const nodemailer = require('nodemailer');
const transport = require('nodemailer-sendgrid-transport');
const User = require('../models/user');
const path = require('path');
const Referral = require('../models/referral')

const transporter = nodemailer.createTransport(transport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY

    }
}));

exports.sendFlyer = async (req, res) => {

    const email = req.body.email;
    let referral;

    try {
        referral = await Referral.findById(req.body.id)
        const user = await User.findOne({ _id: req.user._id });
        let n = user.name.toUpperCase();
        let l = user.last_name.toUpperCase();
        if (user && !referral.collateral_sent) {
            return transporter.sendMail({
                to: email,
                from: `${n} ${l} ` + req.user.email,
                cc: req.user.email,
                subject: 'Your Personal Verizon Fios Specialist',

                html: `<!DOCTYPE html>
                    <html lang="en">
                    
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="ie=edge">
                        <title>Your Fios Specialist</title>
                        <style lang="en">
                            body {
                                margin: 0;
                                padding: 0;
                                box-sizing: border-box;
                                width: 100%;
                                height: 100%;
                                position: relative;
                            }
                    
                            .container {
                                box-sizing: border-box;
                                padding: 10px;
                                min-width: 100%;
                                min-height: 100%;
                                max-width: 100%;
                                max-height: 100%;
                                position: relative;
                    
                            }
                    
                            .container img {
                                width: 100%;
                                height: 100%;
                    
                            }
                    
                            .text {
                    
                                min-width: 100%;
                                min-height: 20vh;
                                position: relative;
                    
                            }
                    
                            .text h4 {
                                text-align: center;
                                font-size: 1.8rem;
                                padding-top: 1rem;
                                font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;
                            }
                    
                            .text p {
                                text-align: left;
                                line-height: 1.5;
                                font-size: 1.2rem;
                                padding: 1rem;
                                text-indent: 1.5rem;
                                font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;
                    
                            }
                    
                            .name {
                                text-transform: capitalize;
                            }
                    
                            .link a {
                                text-decoration: none;
                                display: block;
                                margin: 1rem auto;
                                width: 25%;
                                text-align: center;
                                background: black;
                                padding: 10px 20px;
                                border-radius: 30px;
                    
                                color: white;
                                font-weight: bold;
                            }
                        </style>
                    
                    </head>
                    
                    <body style="margin: 0;padding: 0;box-sizing: border-box;width: 100%;height: 100%;position: relative;">
                        <div class="container" style="box-sizing: border-box;padding: 10px;min-width: 100%;min-height: 100%;max-width: 100%;max-height: 100%;position: relative;">
                            <div class="text" style="min-width: 100%;min-height: 20vh;position: relative;display:block; width:100%;">
                                <h4 style="text-align: center;font-size: 1.8rem;padding-top: 1rem;font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;">Congratulations on your move <span class="name" style="text-transform: capitalize;">${referral.name}</span> </h4>
                                <p style="text-align: left;line-height: 1.5;font-size: 1.2rem;padding: 1rem;text-indent: 1.5rem;font-family: 'Segoe UI', Tahoma, Verdana, sans-serif;">My name is <span class="name" style="text-transform: capitalize;">${user.name}</span> from Verizon Fios. I am your dedicated Fios Specialist.
                                    My goal is to
                                    provide excellent and high quality services to my clients. I work with the office at
                                    <span class="name" style="text-transform: capitalize;">${referral.address}, ${referral.city}</span>, to make sure you get the best Internet,
                                    TV and
                                    home phone
                                    services for your apartment or home. You are just a phone call away to start enjoying Fios. Let me
                                    know how I can help to set up your services ASAP! </p>
                                <div class="link">
                                    <a href="tel:${user.phone}" style="text-decoration: none;display: block;margin: 1rem auto;width: 25%;text-align: center;background: black;padding: 10px 20px;border-radius: 30px;color: white;font-weight: bold;">Call me</a>
                                    <a href="mailto:${user.email}" style="text-decoration: none;display: block;margin: 1rem auto;width: 25%;text-align: center;background: black;padding: 10px 20px;border-radius: 30px;color: white;font-weight: bold;">Email me</a>
                                </div>
                    
                    
                            </div>
                            <div style="width:100%;height: 100%; position:relative; margin-top:15px;">
                            <img src="cid:flyer" alt="flyer" style="max-width: 100%;height: auto; margin:auto; display:block; text-align:center;">
                            </div>
                            
                    
                    
                    
                        </div>
                    
                    
                    </body>
                    
                    </html>`,
                attachments: [{
                    filename: 'flyer.jpg',
                    path: path.join(__dirname, '../public/images/flyer.jpg'),
                    cid: 'flyer'
                }],
            }, (err, info) => {
                console.log(err);
                if (info) {

                    return Referral.findOneAndUpdate({ _id: referral._id }, {
                        collateral_sent: true,
                        collateral_sent_on: new Date()
                    }, { new: true })
                        .populate('referralBy', '-password')
                        .populate('manager')
                        .populate('updatedBy', '-password')
                        .populate('coach', 'name last_name email')
                        .populate('userId', '-password')
                        .exec()
                        .then(ref => {
                            //updated to true
                            res.status(200).json({
                                message: 'Email Sent.',
                                referral: ref
                            });
                        })


                }
            }



            )
        }
    } catch (e) {
        print(e);
    }
}
