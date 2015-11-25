var express = require('express');
var router = express.Router();
var user = require("../controller/user");
var login = require('../controller/login')(router);



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

/* activate new user. */
router.get('/activate', function(req, res, next) {
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
      //send true if we find a match
      res.send(true);
    } else {
      //send false if we didn't find a match
      res.send(false);
    }
  });
});


router.get('/confirm', function(req, res, next) {
  res.render('confirm', { title: 'مطابقة البيانات' });
});

module.exports = router;
