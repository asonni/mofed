var express = require('express');
var router = express.Router();
var user = require("../controller/user"),
    mofednid = require('../controller/mofednid'),
    mofedbase = require('../controller/mofedbase'),
    confirm = require('../controller/confirm'),
    helpers = require('../controller/userHelpers'),
    mailer = require('../controller/mailer'),
    mofedarea = require('../controller/mofedarea'),
    config = require('../config'); // get our config file



/* GET users listing. */
router.get('/', helpers.isLogin,function(req, res, next) {
  res.render('home', { title: 'الرئيسية', name: req.user.name });
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
      res.send({isValid: false});
    } else {
      //send false if we didn't find a match
      res.send({isValid: true});
    }
  });
});

/* check if NID is used. */
router.get('/hasNid', helpers.isLogin, function (req, res, next){
  user.hasNid(req.query.value,function (result){
    if(result){
      //send true if we find a match
      res.send({isValid: false});
    } else {
      //send false if we didn't find a match
      res.send({isValid: true});
    }
  });
});

router.post('/check', function(req, res, next) {
  if(req.body.name && req.body.lawnum && req.body.nid && req.body.regnum){
    mofedbase.getStudents(req.body.name,req.body.lawnum, function (students){
      user.enteredData(req.user.id,req.body,function(person){
        res.send({person, students});
      })
      // res.send({check:true});
    });
  } else {
    res.send(null);
  }
});

router.post('/confirm', function (req, res, next) {
  if(req.body.sid){
    confirm.addConfirmation(req.body,req.user,function (result){
      if(result) {
        user.userVerified(req.user._id, req.body.country, function (verified){
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
  } else {
    res.send({verify : 3});
  }
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

router.get('/getJobInfo', helpers.isLogin, function (req, res, next) {
  mofedarea.getJobInfo(req.user.nid, function(result){
    console.log(result);
    res.send({job:result.job, area:result.area,salary : req.user.salary});
  })
});

router.post('/addJobInfo', helpers.isLogin, function (req, res, next) {
  console.log("hello");

});

module.exports = router;