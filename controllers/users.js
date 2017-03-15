var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var passportlocal= require('passport-local');
var passportsession= require('passport-session');

var User = require('../models/users_model.js');
var router = express.Router();

const Sequelize = require("sequelize");
const sequelize = new Sequelize('millesime_admin', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

//_____________________________________________________________________ READ_____________________________________________


router.get('/',function(req,res){

res.send('USERS');

});
router.get('/register',function(req,res){

 res.render('registration');
});

router.post('/register', function(req, res) {
   var email = req.body.email;
    var password = req.body.password;

 console.log(req.body);

 User.findAll().then(user => {
    usersNumber = user.length;
    console.log('Numarul de useri inainte de inserare:', user.length );

	User.sync().then(function (){
	  return User.create({
	    userid:usersNumber+1,
	    email: email,
      	password: password

		 });
	}).then(c => {
	    console.log("User Created ", c.toJSON());
	     res.redirect('/users');
	}).catch(e => console.error(e));

 });
});

router.get('/login',function(req,res){
	res.render('authentication');
});

//router.post('/login', function(req, res, next) {
//    console.log(req.url);  // '/login'
//    console.log(req.body); // { username: 'username', password: 'parola' }
//    passport.authenticate('local', function(err, user, info) {
//        console.log("authenticate");
//        console.log('error:',err);
//        console.log('user:',user);
//        console.log('info:',info);
//    })(req, res, next);
//});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/events',
	failureRedirect: '/users/register'
	}));


router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/users/login');
});


//_______________________________________________________________________________________________________________________

module.exports = router;
