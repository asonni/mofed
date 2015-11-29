var Confirm = require("../models/confirm");


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
        console.log(err)
        cb(null);
      }
    });
  },
  getConfirmations: function(cb) {
    Confirm.find({
    },'createdAt user mofednid mofedbase').populate('user', 'email _id verified')
      .populate('mofednid', 'nid _id name')
      .populate('mofedbase', 'sid _id name')
     .exec(function(err, students){
        cb(students);
     });
  }
}