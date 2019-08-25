//jshint esversion:6
const nodemailer = require('nodemailer');
const transport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(transport({
    auth: {
        api_key: process.env.SENDGRID_API_KEY

    }
}));

const User = require('../models/user');

// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true,
//     auth: {

//         user: process.env.EMAIL,
//         pass: process.env.EMAIL_PSW

//     }
// });


exports.sendNithlyReport = (req, res, next) => {


    const notes = req.body.notes;
    const referrals = req.body.referrals;
    const extra_email = req.body.extra_email;
    let emailsTo = [];
    let emailsCC = [req.user.email];
    console.log(req.body)


    let notesList = '';

    notes.forEach(note => {

        notesList += `<li style="-webkit-box-sizing: inherit;box-sizing: inherit;padding: 1rem;-webkit-box-shadow: 1px 3px 9px 3px rgba(243, 238, 238, 0.57);box-shadow: 1px 3px 9px 3px rgba(243, 238, 238, 0.57);">
    <p style="-webkit-box-sizing: inherit;box-sizing: inherit;">${note.note}</p> <span class="italic"
        style="-webkit-box-sizing: inherit;box-sizing: inherit;font-style: italic;font-size: 0.8rem;">${new Date(note.created).toDateString()} <span>${new Date(note.created).toLocaleTimeString()}</span>
</li>`;

    })

    let refList = '';
    referrals.forEach(ref => {

        refList += ` 
    <tr style="-webkit-box-sizing: inherit;box-sizing: inherit;">
    <td style="-webkit-box-sizing: inherit;box-sizing: inherit;padding: 15px 5px;display: table-cell;text-align: center;vertical-align: inherit;border-radius: 2px;border: none;text-transform: uppercase;">${ref.mon}</td>
    <td style="-webkit-box-sizing: inherit;box-sizing: inherit;padding: 15px 5px;display: table-cell;text-align: center;vertical-align: inherit;border-radius: 2px;border: none;text-transform: capitalize;">${ref.address}
        ${ref.city}</td>
    <td style="-webkit-box-sizing: inherit;box-sizing: inherit;padding: 15px 5px;display: table-cell;text-align: center;vertical-align: inherit;border-radius: 2px;border: none;">${new Date(ref.due_date).toDateString()}</td>
    <td style="-webkit-box-sizing: inherit;box-sizing: inherit;padding: 15px 5px;display: table-cell;text-align: center;vertical-align: inherit;border-radius: 2px;border: none;">${ref.package}</td>
    </tr>`;
        if (!emailsCC.includes(ref.manager.email))
            emailsCC.push(ref.manager.email);
    });

    if(referrals.length === 0) {
        emailsCC.push(extra_email);
    }

    //HTML EMAIL BODY
    User.findOne({
            _id: req.user._id
        })
        .populate('coach', 'email')
        .exec()
        .then(user => {
            if (!user) return res.status(400).json(new Error('Not user found'))

            // res.json({
            //     msg: 'Report has been sent!'
            // });
            emailBody = `
    <!DOCTYPE html>
  <html lang="en" style="-webkit-box-sizing: inherit;box-sizing: inherit;">
  
  <head style="-webkit-box-sizing: inherit;box-sizing: inherit;">
      <meta charset="UTF-8" style="-webkit-box-sizing: inherit;box-sizing: inherit;">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" style="-webkit-box-sizing: inherit;box-sizing: inherit;">
      <meta http-equiv="X-UA-Compatible" content="ie=edge" style="-webkit-box-sizing: inherit;box-sizing: inherit;">
  
      <title style="-webkit-box-sizing: inherit;box-sizing: inherit;">Document</title>
  </head>
  
  <body style="-webkit-box-sizing: inherit;box-sizing: inherit;margin: 0;font-family: Roboto, &quot;Helvetica Neue&quot;, sans-serif;">
      <div class="container card" style="-webkit-box-sizing: inherit;box-sizing: inherit;width: 100%;left: 0;margin: 0 auto;-webkit-box-shadow: 1px 3px 9px 3px rgba(0, 0, 0, 0.57);box-shadow: 1px 3px 9px 3px rgba(0, 0, 0, 0.57);">
          <h2 class="card-title" style="-webkit-box-sizing: inherit;box-sizing: inherit;font-size: 24px;font-weight: 300;text-align: center;padding: 1rem;text-transform: capitalize;">${user.name} ${user.last_name}
              nightly report</h2>
          <table style="-webkit-box-sizing: inherit;box-sizing: inherit;border: none;width: 100%;display: table;border-collapse: separate;border-spacing: 2px;left: 0;margin: 0 auto;border-color: grey;margin-bottom: 1rem;">
              <thead style="-webkit-box-sizing: inherit;box-sizing: inherit;">
                  <tr style="-webkit-box-sizing: inherit;box-sizing: inherit;">
                      <th style="-webkit-box-sizing: inherit;box-sizing: inherit;padding: 15px 5px;display: table-cell;text-align: center;vertical-align: inherit;border-radius: 2px;border: none;font-weight: bold;">MON</th>
                      <th style="-webkit-box-sizing: inherit;box-sizing: inherit;padding: 15px 5px;display: table-cell;text-align: center;vertical-align: inherit;border-radius: 2px;border: none;font-weight: bold;">Address</th>
                      <th style="-webkit-box-sizing: inherit;box-sizing: inherit;padding: 15px 5px;display: table-cell;text-align: center;vertical-align: inherit;border-radius: 2px;border: none;font-weight: bold;">Due
                          Date</th>
                      <th style="-webkit-box-sizing: inherit;box-sizing: inherit;padding: 15px 5px;display: table-cell;text-align: center;vertical-align: inherit;border-radius: 2px;border: none;font-weight: bold;">Package</th>
                  </tr>
  
              </thead>
              <tbody style="-webkit-box-sizing: inherit;box-sizing: inherit;">
                
                      ${refList}
                
  
              </tbody>
              <tfoot style="-webkit-box-sizing: inherit;box-sizing: inherit;"></tfoot>
          </table>
          <div class="list-item" style="-webkit-box-sizing: inherit;box-sizing: inherit;border-top: 1px solid grey;">
              <h3 class="center" style="-webkit-box-sizing: inherit;box-sizing: inherit;text-align: center;padding: 1rem;">Today
                  notes</h3>
              <ul style="-webkit-box-sizing: inherit;box-sizing: inherit;padding: 10px;list-style: none;">
                  ${notesList}
  
  
  
              </ul>
          </div>
      </div>
  
  </body>
  
  </html>`;

            return transporter.sendMail({
                to: user.coach.email,
                from: `${user.name.toUpperCase()} ${user.last_name.toUpperCase()} ${req.user.email}`,
                cc: emailsCC,
                subject: 'Nightly Report Email',
                html: emailBody
            }, (err, info) => {
                console.log(err);
                res.json(info);
            });
        })
        .catch(err => next(err))




}