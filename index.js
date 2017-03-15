//===============Modules=============================
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportlocal= require('passport-local');
var passportsession= require('passport-session');
var User = require('./models/users_model.js');

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
    console.log(id);
  });
});

var users= require('./controllers/users.js');
var router = express.Router();

var app = express();


//-------------------------------- View engine setup------------------------------------------------------------------------------

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/users', users);


app.use(session({
    secret:"ceva",
    resave:true, //false
    saveUninitialized:true,
    cookie:{},
    duration: 45 * 60 * 1000,
    activeDuration: 15 * 60 * 1000
}));


// Passport init
app.use(passport.initialize());
app.use(passport.session());

//------------------------------------------------Routes---------------------------------------------------------------------------
app.get('/', function (req, res) {
     res.send('Welcome!');
});


//-------------------------------------Server---------------------------------------------------------------------------------

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
