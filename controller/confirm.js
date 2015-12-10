var Confirm = require("../models/confirm"),
    User = require("../models/user");


module.exports = {
  /* here we add a new user to the system */
  addConfirmation: function (body,userId, cb) {
    var obj = {
      user : userId,
      mofednid : body.nid,
      mofedbase : body.sid
    };
    var confirm = new Confirm(obj);
    confirm.save(function(err,result){
      if (!err) {
        cb(result);
      } else {
        // return page with errors
        console.log(err);
        cb(null);
      }
    });
  },
  getConfirmations: function(limit,page,cb) {
    page-=1;
    Confirm.count({},function(err,count){
      Confirm.find({
    },'createdAt user mofedbase admin').limit(limit).skip(page*10)
      .populate('user', 'email _id name nid regnum lawnum country verified')
      .populate('mofedbase', 'sid _id name country lawnum')
      .populate('admin', '_id name')
      .exec(function(err, students){
        cb({students:students, count:count});
      });
    });
  },
  getMatchConfirmations: function(limit,page,cb) {
    page-=1;
    Confirm.count({verified:2},function(err,count){
      Confirm.find({
      verified:2
    },'createdAt user  mofedbase admin').limit(limit).skip(page*10)
      .populate('user', 'email _id name nid regnum lawnum country verified')
      .populate('mofedbase', 'sid _id name country lawnum')
      .populate('admin', '_id name')
      .exec(function(err, students){
        cb({students:students, count:count});
      });
    });
  },
  getUnMatchConfirmations: function(limit,page,cb) {
    page-=1;
    Confirm.count({verified:1},function(err,count){
      Confirm.find({
      verified:1
    },'createdAt user mofednid mofedbase').limit(limit).skip(page*10)
      .populate('user', 'email _id name nid regnum lawnum country verified')
      .populate('mofedbase', 'sid _id name country lawnum')
      .exec(function(err, students){
        cb({students:students, count:count});
      });
    });
  },
  verify: function(id,admin, cb){
    Confirm.findOne({_id : id}, function(err, confirmation){
      if(!err && confirmation != null){
        confirmation.verified = 2;
        confirmation.admin=admin;
        confirmation.save(function(err,result){
          if (!err) {
            User.findOne({_id : confirmation.user}, function(err, user){
              if(!err && user != null){
                user.verified = 3;
                user.save(function(err,result){
                  if (!err) {
                    cb(user.email);
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
  unVerify: function(id,admin, cb){
    Confirm.findOne({_id : id}, function(err, confirmation){
      if(!err && confirmation != null){
        var userId = confirmation.user;
          User.findOne({_id : confirmation.user}, function(err, user){
            if(!err && user != null){
              user.verified = 1;
              user.save(function(err,result){
                if (!err) {
                  confirmation.remove(function(err, result){
                    if (!err) {
                      cb(user.email);
                    }  else {
                      //TODO: return page with errors
                      console.log(err)
                      cb(null);
                    }
                  })
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
      } else {
        //TODO: return page with errors
        console.log(err)
        cb(null);
      }
    });
  },

  getAllStudents: function(cb) {
    Confirm.find({},'createdAt user mofedbase admin')
    .populate('user', 'email  name nid regnum lawnum country verified')
    .populate('mofedbase', 'sid name country lawnum')
    .populate('admin', '_id name')
    .exec(function(err, students){
      cb(students);
    });
  },

  getAllMatch: function(cb) {
    Confirm.find({verified:2},'createdAt user mofedbase admin')
    .populate('user', 'email  name nid regnum lawnum country verified')
    .populate('mofedbase', 'sid name country lawnum')
    .populate('admin', '_id name')
    .exec(function(err, students){
      cb(students);
    });
  },

  getAllNotMatch: function(cb) {
    Confirm.find({verified:1},'createdAt user mofedbase admin')
    .populate('user', 'email  name nid regnum lawnum country verified')
    .populate('mofedbase', 'sid name country lawnum')
    .populate('admin', '_id name')
    .exec(function(err, students){
      cb(students);
    });
  }
}