var User = require("../models/user"),
    Confirm = require("../models/confirm"),
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
          delete result.password;
          delete result.salt;
          delete result.admin;
          delete result.password;
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
            delete result.password;
            delete result.salt;
            delete result.admin;
            delete result.password;
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
  /* here we check if nid is used */
  hasNid: function (nid, cb) {
    User.findOne({nid : nid, verified:3}, function(err, user){
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
  userVerified: function (id,country, cb) {
    User.findOne({_id : id}, function(err, user){
      if(!err && user != null){
        user.verified = 2;
        user.country = country;
        user.save(function(err,result){
          if (!err) {
            delete result.password;
            delete result.salt;
            delete result.admin;
            delete result.password;
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
  /* user verifies*/
  enteredData: function (id,body, cb) {
    User.findOne({_id : id}, function(err, user){
      if(!err && user != null){
        user.lawnum = body.lawnum;
        user.name = body.name;
        user.nid= body.nid;
        user.regnum = body.regnum;
        user.save(function(err,result){
          if (!err) {
            delete result.password;
            delete result.salt;
            delete result.admin;
            delete result.password;
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
              delete result.password;
              delete result.salt;
              delete result.admin;
              delete result.password;
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
          delete result.password;
          delete result.salt;
          delete result.admin;
          delete result.password;
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
  getAllAdmins: function (limit,page,cb) {
    page-=1;
    User.count({admin: true},function(err,count){
      User.find({admin : true}, '_id name email phone createdAt activated', function(err, admins){
        if (!err) {
          cb({admins:admins, count:count});
        } else {
          // return page with errors
          console.log(err)
          cb(null);
        }
      });
    });
  },

  /* here get all students */
  removeAdmin: function (id,cb) {
    User.remove({_id : id}, function(err, admins){
      if (!err) {
        cb(true);
      } else {
        // return page with errors
        console.log(err)
        cb(null);
      }
    });
  },

  findNids: function(cb) {
    User
    .find({verified:3})
    .sort({nid : 1})
    .select('_id nid regnum name email country')
    .exec(function(err, students){
      cb(students);
    });
  },

  /* here we get all users with this NID */
  getUsersByNid: function (nid,id,cb) {
    User.find({nid : nid, _id: {$ne : id}}, function(err, users){
      if (!err) {
        cb(users);
      } else {
        //TODO: return page with errors
        console.log(err)
        cb(null);
      }
    });
  },

  /* here we add a new user to the system */
  searchStudents: function (query,cb) {
    var obj = null,
        sort = '';
    var lst = [];
    if(!isNaN(query)){
      sort = 'nid';
      obj = { nid : { "$regex": query, "$options": "i" } };
    } else {
      sort = 'name';
      obj = { name : { "$regex": query, "$options": "i" } };
    }
    User.find(obj, '_id')
    .limit(20)
    .sort(sort)
    .exec(function(err, students){
      if (!err) {
        for (inx in students){
          lst.push(students[inx]._id);
        }
        Confirm.find({
        },'createdAt user mofedbase admin')
          .where ('user').in(lst)
          .populate('user', 'email _id name nid regnum lawnum country verified')
          .populate('mofedbase', 'sid _id name country lawnum')
          .populate('admin', '_id name')
          .sort('user')
          .exec(function(err, students){
            cb({students:students});
          });
      } else {
        // return page with errors
        console.log(err)
        cb(null);
      }
    });
  }
};



