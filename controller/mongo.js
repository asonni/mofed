var User = require("./user");

var us= {
  name: "احمد الفيتوري",
  password: "pss", 
  salt: "String",
  email: "String",
  status: true,
  verified: 1
}
User.addUser(us,function(result){
  console.log(result)
})