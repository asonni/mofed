var User = require("../models/user"),
    easyPbkdf2 = require("easy-pbkdf2")(),
    user = null;


module.exports = {
  /* here we add a new user to the system */
  register: function (body, cb) {
    var salt = easyPbkdf2.generateSalt(); //we generate a new salt for every new user
    easyPbkdf2.secureHash( body.password, salt, function( err, passwordHash, originalSalt ) {
      var obj={
        email : body.email,
        password : passwordHash,
        salt : originalSalt,
      };
      user = new User(obj);
      user.save(function(err,result){
        if (!err) {
          cb(result);
        } else {
          //TODO: return page with errors
          console.log(err)
          cb(null);
        }
      });
    });
  },

  /* here we activate the user */
  activate: function (token, cb) {
    User.findOne({studentId : token}, function(err, user){
      console.log(user);
      user.activated = true;
      user.save(function(err,result){
        if (!err) {
          cb(result);
        } else {
          //TODO: return page with errors
          console.log(err)
          cb(null);
        }
      });
    });
  },

  /* here we check if activated */
  isActive: function (token, cb) {
    User.findOne({studentId : token}, function(err, user){
      if (!err) {
        cb(user.activated);
      } else {
        //TODO: return page with errors
        console.log(err)
        cb(null);
      }
    });
  },
  /* here we check if activated */
  isRegistered: function (email, cb) {
    User.findOne({email : email}, function(err, user){
      if (!err) {
        if(user){
          cb(true);
        } else {
          cb(false);
        }
      } else {
        //TODO: return page with errors
        console.log(err)
        cb(null);
      }
    });
  },
}

// var us= {
//   name: "احمد الفيتوري",
//   password: "pss", 
//   salt: "String",
//   email: "String",
//   status: true,
//   verified: 1
// }
// this.addUser(us,function(result){
//   console.log(result)
// })

// driver = new DriversModel({
//    firstName:req.body.firstname,
//    lastName:req.body.lastname,
//  });
  
//  driver.save(function (err) {
//    if (!err) {
//      return console.log("created");
//    } else {
//      //TODO: return page with errors
//      return console.log(err);
//    }
//  });

