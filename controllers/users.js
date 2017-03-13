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



// passport.use(new LocalStrategy(
//   function(email, password, done) {
//    User.getUserByUsername(email, function(err, user){
//    	if(err) throw err;
//    	if(!user){
//    		return done(null, false, {message: 'Unknown User'});
//    	}

//    	User.comparePassword(password, user.password, function(err, isMatch){
//    		if(err) throw err;
//    		if(isMatch){
//    			return done(null, user);
//    		} else {
//    			return done(null, false, {message: 'Invalid password'});
//    		}
//    	});
//    });
//   }));

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(userid, done) {
//   User.getUserById(userid, function(err, user) {
//     done(err, user);
//   });
// });

router.post('/login', passport.authenticate('local', { 
	successRedirect: '/users',                    
	failureRedirect: '/users/register' 
	}
));


router.get('/logout', function(req, res){
	req.logout();

	//req.flash('success_msg', 'You are logged out');

	res.redirect('/users/login');
});




//_______________________________________________________________________________________________________________________

module.exports = router;