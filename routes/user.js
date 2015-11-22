var express = require('express');
var router = express.Router();
var user = require("../controller/user");


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'الرئيسية' });
});

/* Register new user. */
router.post('/register', function(req, res, next) {
  user.register(req.body,function(result){
    if(result){
      //send email with activation link
      res.render('index', { title: 'الرئيسية', msg: 1 });
    } else {
      //something went wrong
      res.render('index', { title: 'الرئيسية', msg: 2 });
    }
  });
});

/* check if Registered. */
router.get('/isRegistered/:email', function(req, res, next) {
  user.isRegistered(req.params.email,function(result){
    if(result){
      //send email with activation link
      res.send(true);
    } else {
      //something went wrong
      res.send(false);
    }
  });
});


router.get('/confirm', function(req, res, next) {
  res.render('confirm', { title: 'مطابقة البيانات' });
});

module.exports = router;
