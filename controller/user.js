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
  /* here get all students */
  getAllStudents: function (cb) {
    User.find({admin : false, verified : {$gte:2} }, function(err, users){
      if (!err) {
        // Map the docs into an array of just the _ids
        var ids = users.map(function(doc) { return doc._id; });
        cb(students);
      } else {
        // return page with errors
        console.log(err)
        cb(null);
      }
    });
  }
}



