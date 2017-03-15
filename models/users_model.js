//var EventUser = require('./event_user_model.js');
//_____________________________________________________Init & Config Sequelize___________________________________________________

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
//_______________________________________________Declare table structure ______________________________________________

var User = sequelize.define('user', {
  userid: {
    type: Sequelize.STRING,
    primaryKey: true, 
    //autoIncrement: true,
  //  allowNull: false
    },
  username: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING
  },
  password: { 
    type: Sequelize.STRING,
   allowNull: false, 
  //   set: function(v){
  //      this.setDataValues(encyptPassword(v));
  //},
},
   birthday: {
    type: Sequelize.DATE
  },
   job: {
    type: Sequelize.STRING
  },
   position: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  phone: {
    type: Sequelize.STRING
  },
  adminrole: {
    type: Sequelize.BOOLEAN,
//    defaultValue: false //usually, new users are not admins
  },
   paidCurrentFee: {
    type: Sequelize.BOOLEAN
  },
  LastFeePayDate:{
    type: Sequelize.DATE
  },
  activeAccount:{
    type:Sequelize.BOOLEAN
  }
  //eventuser_id: { //Foreign Key
  //  type: Sequelize.INTEGER,
  //  references: {
  //    model: "eventuser",
  //    key: "user_id"
  //  }
  //},
  //  
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

//___________________________________Establish relationships with other tables____________________

// 1.  N Users - N Events (N-N)
// 2.  1 User - N TasteForms (1-N) ?

//User.belongsTo(EventUser);

//____________________________________________________________________________________________

User.sync({force:true}).then(function () { //sync only creates table; cannot update them  //detele  force: true when in production
  return User.create({
    userid:1,
    username: 'username',
    lastName: 'Lastname',
    password: 'parola',
    birthday: new Date(1995, 9, 13),
    job: 'myjob ',
    position: 'myposition',
    email: 'firstname@gmail.com',
    phone: '0770111222',
    adminrole:true ,
    paidCurrentFee: true,
    LastFeePayDate: new Date(2017, 2,14),
    activeAccount:true,
    eventuser_id:1    
  });
}).then(c => {
    console.log("User Created", c.toJSON());
})
//.then(function(){
//  User.findOne({ userid: 1 }).then(user => {
//  console.log('Foooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooound user', user.userid);});
//})
.catch(e => console.error(e));


//_______________________________________________________________________________________________________________________

module.exports = User;
