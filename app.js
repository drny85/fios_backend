//jshint esversion:6
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cors = require('cors');
require('dotenv').config()
const db_pws = process.env.MY_MONGO_PASSWORD;

const MONGO_URL = `mongodb+srv://melendez:${db_pws}@cluster0-m0t4i.mongodb.net/fios`;
//main app
const app = express();
app.use(cors());

app.use(helmet());
//storing sessions
const store = new MongoDBStore({
  uri: MONGO_URL,
  collection: 'sessions'
});
// setting sessions
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);

//flash messages
app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));
app.use("/", express.static(path.join(__dirname, "angular")));


app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


// setting routes
const reportRoutes = require('./routes/reports');
const referralRoutes = require('./routes/referrals');
const refereeRoutes = require('./routes/referee');
const usersRoutes = require('./routes/users');
const managersRoutes = require('./routes/managers');
const notesRoutes = require('./routes/notes');
const flyerRoutes = require('./routes/flyer');

app.use('/report', reportRoutes);
app.use(referralRoutes);
app.use('/referee', refereeRoutes);
app.use('/user', usersRoutes);
app.use('/manager', managersRoutes);
app.use('/notes', notesRoutes);
app.use(flyerRoutes);

// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, "angular", "index.html"));
// })

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(result => {
    let PORT = process.env.PORT || 3000;
    app.listen(PORT);
    console.log('Server started and DB Connected ' + PORT);
  })
  .catch(err => {
    console.log(err.message);
  });