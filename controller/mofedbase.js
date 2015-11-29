var Mofedbase = require("../models/mofedbase");

module.exports = {
  /* here we add a new user to the system */
  getStudents: function (lawnum, cb) {
    Mofedbase.find({lawnum : lawnum}, function(err, person){
      if (!err) {
        cb(person);
      } else {
        // return page with errors
        console.log(err)
        cb(null);
      }
    });
  }
}