//===============Modules=============================
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportlocal= require('passport-local');
//var LocalStrategy = require('passport-session').Strategy
var User = require('./models/users_model.js');

passport.use(new LocalStrategy({
    passReqToCallback: true
}, function(req, username, password, done) {
    User.findOne({ username: username }).then(function(user) {
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (password !== user.password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      req.session.user = user.toJSON();
      //if (!user.validPassword(password)) {
      //  return done(null, false, { message: 'Incorrect password.' });
      //}
      done(null, req.session.user);
    }).catch(err => {
      console.error(err);
      done(err);
    });
  }
));


var users= require('./controllers/users.js');
var router = express.Router();

var app = express();

app.use(session({
    secret:"ceva",
    resave:true, //false
    saveUninitialized:true,
    cookie:{},
    duration: 45 * 60 * 1000,
    activeDuration: 15 * 60 * 1000
}));

passport.serializeUser(function(user, done) {
  done(null, user.userid);
});

passport.deserializeUser(function(id, done) {
  User.findOne({ userid: id }).then(function(user) {
    done(null, user);
    console.log(id);
  }).catch(e => done(e));
});
// Passport init
app.use(passport.initialize());
app.use(passport.session());


//-------------------------------- View engine setup------------------------------------------------------------------------------

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/users', users);
app.get("/session", (req, res) => {
    res.json(req.session);
});



//------------------------------------------------Routes---------------------------------------------------------------------------
app.get('/', function (req, res) {
     res.send('Welcome!');
});


//-------------------------------------Server---------------------------------------------------------------------------------

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
