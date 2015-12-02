var User = require("../models/user"),
    generatePassword = require('password-generator'),
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
    User.findOne({_id : token}, function(err, user){
      if(!err && user != null){
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
      } else {
        cb(null);
      }
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
  /* here we check if registered */
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
  /* user verifies*/
  userVerified: function (id, cb) {
    User.findOne({_id : id}, function(err, user){
      if(!err && user != null){
        user.verified = 2;
        user.save(function(err,result){
          if (!err) {
            cb(result);
          } else {
            //return page with errors
            console.log(err)
            cb(null);
          }
        });
      } else {
        cb(null);
      }
    });
  },
  /* get  */
  verify: function (id, cb) {
    User.findOne({_id : id}, function(err, user){
      if(!err && user != null){
        cb(user.verified);
      } else {
        cb(null);
      }
    });
  },
  
  /* hasEmail  */
  hasEmail: function (email, cb) {
    User.findOne({email : email},'_id', function(err, id){
      if(!err && id != null){
        cb(id);
      } else {
        console.log(err);
        cb(null);
      }
    });
  },

  /* here we add a new user to the system */
  changePassword: function (id, cb) {
    var salt = easyPbkdf2.generateSalt(), //we generate a new salt for every new user
        password = generatePassword(10,false); //we generate a new password for every new user
    easyPbkdf2.secureHash(password, salt, function( err, passwordHash, originalSalt ) {
      var obj={
        password : passwordHash,
        salt : originalSalt,
      };
      User.findOne({_id : id}, function(err, user){
        if(!err && user != null){
          user.password = passwordHash;
          user.salt = originalSalt;
          user.save(function(err,result){
            if (!err) {
              cb(password);
            } else {
              //return page with errors
              console.log(err)
              cb(null);
            }
          });
        } else {
          cb(null);
        }
      });
    });
  },

  /*add Admin*/
  /* here we add a new user to the system */
  addAdmin: function (body, cb) {
    var salt = easyPbkdf2.generateSalt(); //we generate a new salt for every new user
    easyPbkdf2.secureHash( body.password, salt, function( err, passwordHash, originalSalt ) {
      var obj={
        name: body.name,
        admin: true,
        email : body.email,
        phone: body.phone,
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
  /* here get all students */
  getAllAdmins: function (cb) {
    User.find({admin : true}, '_id name email phone createdAt activated', function(err, admins){
      if (!err) {
        cb(admins);
      } else {
        // return page with errors
        console.log(err)
        cb(null);
      }
    });
  },

  /* here get all students */
  removeAdmin: function (id,cb) {
    User.remove({_id : id}, '_id name email phone createdAt activated', function(err, admins){
      if (!err) {
        cb(true);
      } else {
        // return page with errors
        console.log(err)
        cb(null);
      }
    });
  },
}



