const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport');
const aws = require('aws-sdk');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

//This sets up an https server.
var https = require('https');
var fs = require('fs');

const PNUB_PUB_KEY = process.env.PNUB_PUB_KEY;
const PNUB_SUB_KEY = process.env.PNUB_SUB_KEY;
const PNUB_SEC_KEY = process.env.PNUB_SEC_KEY;

// var PubNub = require('pubnub');
// var pubnub =  new PubNub({
//   subscribeKey: PNUB_SUB_KEY,
//   publishKey: PNUB_PUB_KEY,
//   secretKey: PNUB_SEC_KEY,
//   ssl: true
// });

const S3_BUCKET = process.env.S3_BUCKET;
const S3_STREAM_BUCKET = process.env.S3_STREAM_BUCKET;

aws.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY});

aws.config.update({region: 'us-west-1'});

//Requiring Models
require('./models/Users');
require('./models/Purchases');

//Loads the initializations of Passport
require('./config/passport');

var app = express();
var helmet = require('helmet');

app.use(helmet());

if (process.env.LOCAL === 'yes') {
  mongoose.connect('mongodb://localhost/ggDev');
} else {
    mongoose.connect('mongodb://' + process.env.MONGO_USERNAME + ':' +
     process.env.MONGO_PASSWORD + '@' + 'localhost/');
}

//Initialize the Sessions
var sesh = {
  proxy: true,
  secret: process.env.SESSION_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: { secure: 'auto' },
  store: new MongoStore({ mongooseConnection: mongoose.connection})
}
app.set('trust proxy', 1);

//Use the Sessions declared above
app.use(session(sesh));

// This was used to create an HTTP server traditionally
// var server = app.listen(3000);

//This creates an HTTPS Server
if (process.env.ENVIRON === 'local') {
  //Development
  var server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    passphrase: process.env.HTTPS_PASSPHRASE
  }, app).listen(8888);
  // This was used to create an HTTP server traditionally
  // var server = app.listen(3000);
} else if (process.env.ENVIRON === 'testing') {
  //Testing
  var server = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
    passphrase: process.env.HTTPS_PASSPHRASE
  }, app).listen(8888);
} else {
  //Production
  var server = https.createServer({
    key: fs.readFileSync('www_gamergril_com.key'),
    cert: fs.readFileSync('www_gamergril_com.crt'),
    ca: [fs.readFileSync('DigiCertCA.crt')]
  }, app).listen(8888);
}

// Add headers
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/views', express.static(__dirname + '/views')); //serve views directory as assets

app.use(passport.initialize());
app.use(passport.session());

//ROUTE FILES

var index = require('./routes/index');
var users = require('./routes/users');
var streamers = require('./routes/streamers');
var points = require('./routes/points');
var auth = require('./routes/auth');
var chats = require('./routes/chats');

app.use('/', index);
app.use('/', users);
app.use('/', streamers);
app.use('/', points);
app.use('/', auth);
app.use('/', chats);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error Handlers

// Development error handler
// Will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if(res.status === 401) {
      return res.redirect('/#/login');
    }
    res.render('error', {
      title: "Error Page",
      message: err.message,
      error: {}
    });
  });
} else {
  // Production error handler
  // No stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    if(err.status === 401) {
      return res.redirect('/#/login');
    }
    res.render('error', {
      title: "Sorry, Error",
      message: err.message,
      error: {}
    });
  });
}

module.exports = app;
