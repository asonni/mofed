var Mofedbase = require("../models/mofedbase");

module.exports = {
  /* here we add a new user to the system */
  getStudents: function (name, lawnum, cb) {
    Mofedbase.find({lawnum : { "$regex": lawnum, "$options": "i" }, $text : {$search: name}}, {score: {$meta: "textScore"}})
    .sort({score : {$meta: 'textScore'}})
    .limit(20)
    .exec(function(err, students){
      if (!err) {
        cb(students);
      } else {
        // return page with errors
        console.log(err)
        cb(null);
      }
    });
  }
}
