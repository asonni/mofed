var express = require('express');
var router = express.Router();
var user = require("./controller/user"),


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'الرئيسية' });
});

/* Register new user. */
router.post('/register', function(req, res, next) {
  user.register(req.body,function(result){
    if(result){
      //send email with activation link
      res.render('home', { title: 'الرئيسية', msg: 1 });
    } else {
      //something went wrong
      res.render('home', { title: 'الرئيسية', msg: 2 });
    }
  });
});

module.exports = router;
