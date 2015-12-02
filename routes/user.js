var express = require('express');
var router = express.Router();
var user = require("../controller/user"),
    mofednid = require('../controller/mofednid'),
    mofedbase = require('../controller/mofedbase'),
    confirm = require('../controller/confirm'),
    helpers = require('../controller/userHelpers'),
    mailer = require('../controller/mailer'),
    config = require('../config'); // get our config file



/* GET users listing. */
router.get('/', helpers.isLogin,function(req, res, next) {
  res.render('home', { title: 'الرئيسية' });
});

/* Register new user. */
router.post('/register', function(req, res, next) {
  user.register(req.body,function(result){
    if(result){
      var obj = {
        template : "activation",
        subject : "Mofed app registration",
        locals : {
          email : result.email,
          host: config.host,
          user : {
            email : result.email,
            token : result._id,
          }
        }
      }
      mailer.send(obj); // 
      //send email with activation link
      res.render('index', { title: 'الرئيسية', msg: 1 });
    } else {
      //something went wrong
      res.render('index', { title: 'الرئيسية', msg: 2 });
    }
  });
});

/* activate new user. */
router.get('/activate/:token', function (req, res, next) {
  user.activate(req.params.token,function (result){
    if(result){
      //send email with activation link
      res.redirect('/?msg=4');
    } else {
      //something went wrong
      res.redirect('/?msg=5');
    }
  });
});

/* check if Registered. */
router.get('/isRegistered', function (req, res, next){
  user.isRegistered(req.query.value,function (result){
    if(result){
      //send true if we find a match
      res.send({isValid: false, value: result.email});
    } else {
      //send false if we didn't find a match
      res.send({isValid: true, value: result.email});
    }
  });
});

router.post('/check', function(req, res, next) {
  mofedbase.getStudents(req.body.lawnum, function (students){
    mofednid.getPerson(req.body.nid,req.body.regnum, function (person){
      // res.render('confirm', {students: students,person: person});
      res.send({person, students});
    })
    // res.send({check:true});
  });
});

router.post('/confirm', function (req, res, next) {
  confirm.addConfirmation(req.body,req.user,function (result){
    if(result) {
      user.userVerified(req.user._id, function (verified){
        if(verified) {
          res.send({verify : true});
        } else {
          res.send({verify : 2});
        }
      });
    } else {
      res.send({verify : 2});
    }
  });
});

router.post('/verify', function (req, res, next) {
  user.verify(req.user._id,function (result){
    if(result) {
      res.send({verify : result});
    } else {
      res.send({verify : null});
    }
  });
});

router.post('/forgotPassword', function (req, res, next) {
  user.hasEmail(req.body.email,function (result){
    if(result){
      user.changePassword(result.id, function(password){
        if(password){
          console.log(result);
          var obj = {
            template : "forgotpassword",
            subject : "Mofed app new password request",
            locals : {
              email : req.body.email,
              host: config.host,
              user : {
                email : req.body.email,
                password : password
              }
            }
          }
          mailer.send(obj); // 
          //send email with activation link
          res.send({restore:true});
        } else {
          //something went wrong
          res.send({restore:3});
        }
        
      })
    } else {
      res.send({restore:2});
    }
  });
});



router.get('/confirm', function(req, res, next) {
  res.render('confirm', { title: 'مطابقة البيانات' });
});

module.exports = router;
