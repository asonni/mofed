var express = require('express');
var router = express.Router();
var user = require("../controller/user"),
    mofednid = require('../controller/mofednid'),
    mofedbase = require('../controller/mofedbase'),
    confirm = require('../controller/confirm'),
    helpers = require('../controller/userHelpers'),
    mailer = require('../controller/mailer');
    config = require('../config'); // get our config file

/* GET admins listing. */
router.get('/', function(req, res, next) {
  res.render('admin', { title: 'الرئيسية' });
});

/* GET students listing. */
router.post('/students',helpers.isAdmin, function(req, res, next) {
  confirm.getConfirmations(function (students){
    res.send(students);
  });
});

/* GET students listing. */
router.post('/verify', function(req, res, next) {
  confirm.verify(req.body.id, function(result){
    if(result){
      res.send({verify : true});
    } else {
      res.send({verify : false});
    }
  })
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
router.get('/isRegistered',  function (req, res, next){
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

/* GET admins listing. */
router.post('/users', function(req, res, next) {
  user.getAllAdmins(function (admins){
    res.send(admins);
  });
});

/* add new admin. */
router.post('/addUser', function(req, res, next) {
  user.addAdmin(req.body,function(result){
    if(result){
      var obj = {
        template : "newadmin",
        subject : "Mofed app administration",
        locals : {
          email : result.email,
          host: config.host,
          user : {
            email : result.email,
            token : result._id
          }
        }
      }
      mailer.send(obj); // 
      //send email with activation link
      res.send({addUser:true});
    } else {
      //something went wrong
      res.send({addUser:false});
    }
  });
});

/* GET admins listing. */
router.post('/remove', function(req, res, next) {
  user.removeAdmin(function (result){
    if(result){
      res.send({remove: true});
    } else {
      res.send({remove: false});  
    }
  });
});

module.exports = router;