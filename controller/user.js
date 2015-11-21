var User = require("../models/user"),
    user = null;

module.exports = {

  /* here we add a new user to the system */
  register: function (body, cb) {
    user = new User(body);
    user.save(function(err,result){
      if (!err) {
        cb(result);
      } else {
        //TODO: return page with errors
        console.log(err)
        cb(null);
      }
    })
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

