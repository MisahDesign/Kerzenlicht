const port = process.env.PORT || 3000;

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require('express-session');
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const Comments = require("./models/comments");
const bodyParser = require("body-parser");
const router = express.Router();
const flash = require('connect-flash');
const validator = require('express-validator');
const MongoStore = require('connect-mongo')(session);
const moment = require("moment");
const methodOverride = require("method-override");


const csrf = require('csurf');

const csrfProtection = csrf();

// ROUTES
const routes = require('./routes/index');
const userRoutes = require('./routes/user');

const MongoClient = require('mongodb').MongoClient;
mongoose.connect("mongodb+srv://misah:w9AcfjsFakqkD3wq@cluster0-lygfd.mongodb.net/test?retryWrites=true&w=majority", {
  dbName: 'kerzenlicht'
});
require('./config/passport');
const uri = "mongodb+srv://misah:w9AcfjsFakqkD3wq@cluster0-lygfd.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true
});
client.connect(err => {
  const collection = client.db("test").collection("devices");
  client.close();
});



app.set("viewengine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(validator());
app.use(express.static(__dirname + '/public'));
app.locals.moment = require('moment');
app.use(methodOverride('_method'));

moment.locale('de');

//PASSPORT CONFIGURATION
app.use(session({
  secret: "This is my secret",
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection
  }),
  cookie: {
    maxAge: 180 * 60 * 1000
  }
}));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());



// PASS USER, SESSION, TO ALL ROUTES
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});


app.use('/user', userRoutes);
app.use('/', routes);






module.exports = router;

app.listen(port, function () {
  console.log("The Server has Started");
});