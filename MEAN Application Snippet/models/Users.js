var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var validator = require('validator');

var UserSchema = new mongoose.Schema({
  username: {
      type: String,
      unique: true,
      minlength: [6, 'Too small. Your username must be greater than 6 characters.'],
      maxlength: [30, 'Too big. Your username cannot be greater than 30 characters.']
    },
  name_lower: {type: String, lowercase: true, unique: true},
  email: {
    type: String,
    lowercase: true,
    unique: true,
    minlength: [6, 'Too small. Your email must be greater than 6 characters.'],
    maxlength: [30, 'Too big. Your email must be less than 30 characters.']
  },
  hash: String,
  salt: String,
  pic: {type: String, default: '/images/default_user.png'},
  status: {type: String, default: 'basic'},
  streamKey: {type: String, unique: true},
  stream: {
    title: {type: String},
    game: {type: String},
    withGame: Boolean,
    status: Boolean,
    streamImage: {type: String},
    //This will create a blank empty array when the User is created
    bannedUsers: [String],
    //Whether Goal is Turned On/Off
    withGoal: {type: Boolean},
    //The current Goal
    goal: {type: Number, min: 0},
    //How many points they've received so far
    received: {type: Number},
    goalReward: {type: String, maxlength: 100},
    twitter: {type: String, maxlength: 150},
    firstSite: {type: String, maxlength: 150},
    bio: { type: String, maxlength: 600},
    default: {}
  },
  pkee: {type: String, default: '', maxlength: 100},
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  personalSite: String,
  points: {type: Number, default: 0},
  IP: {type: String, default:""}
});

UserSchema.methods.setStream = function() {
  this.stream = { title:'',
                  game:'',
                  withGame:true,
                  status:false,
                  streamImage:''}
};

UserSchema.methods.setStreamKey = function() {
  this.streamKey = crypto.randomBytes(16).toString('hex');
};

UserSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

UserSchema.statics.isValidUserPassword = function(username, password, done) {
    var criteria = {};
    if (username.indexOf('@') === -1) {
      criteria = { username: username };
    } else {
      criteria = { email: username };
    }
    this.findOne(criteria, function(err, user){
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: 'Incorrect Username/Email' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect Password.' });
      }
      if (user) {
        return done(null, user);
      }
    });
};

UserSchema.methods.generateJWT = function() {

  var today = new Date();
  var expires = new Date(today);
  expires.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    exp: parseInt(expires.getTime() / 1000)},
    process.env.GG_SECRET);
};


mongoose.model('User', UserSchema);
