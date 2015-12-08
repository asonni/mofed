var express = require('express');
var router = express.Router();
var csv = require('express-csv');
var json2csv = require('json2csv');

var user = require("../controller/user"),
    mofednid = require('../controller/mofednid'),
    mofedbase = require('../controller/mofedbase'),
    confirm = require('../controller/confirm'),
    helpers = require('../controller/userHelpers'),
    mailer = require('../controller/mailer');
    config = require('../config'); // get our config file

/* GET admins listing. */
router.get('/', helpers.isAdmin, function(req, res, next) {
  res.render('admin', { title: 'الرئيسية' });
});

/* GET students listing. */
router.get('/students/:limit/:page', helpers.isAdmin, function(req, res, next) {
  confirm.getConfirmations(req.params.limit,req.params.page, function (results){
    res.send(results);
  });
});

/* GET students with confirmations. */
router.post('/matching/:limit/:page', helpers.isAdmin, function(req, res, next) {
  confirm.getMatchConfirmations(req.params.limit,req.params.page, function (results){
    res.send(results);
  });
});

/* GET students with no confirmations. */
router.post('/notMatching/:limit/:page', helpers.isAdmin, function(req, res, next) {
  confirm.getUnMatchConfirmations(req.params.limit,req.params.page, function (results){
    res.send(results);
  });
});


/* GET all students csv. */
router.get('/all2csv', helpers.isAdmin, function(req, res, next) {
  var fields = ['admin.name', 'user.name','user.email', 'user.email' ,'mofedbase.name', 'mofedbase.sid'];
  confirm.getAllStudents(function (results){
    json2csv({ data: results, fields: fields }, function(err, csv) {
      if (err) console.log(err);
      res.attachment('data.csv');
      res.send(csv);
    });
  });
});



/* GET students listing. */
router.post('/verify', helpers.isAdmin, function(req, res, next) {
  confirm.verify(req.body.id,req.user.id, function(email){
    if(email){
      var obj = {
        template : "verified",
        subject : "Mofed app Verification",
        locals : {
          email : email,
          host: config.host,
          user : {
            email : email,
          }
        }
      }
      mailer.send(obj); // 
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
router.get('/isRegistered', helpers.isAdmin,  function (req, res, next){
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
router.get('/users/:limit/:page', helpers.isAdmin, function (req, res, next) {
  user.getAllAdmins(req.params.limit,req.params.page, function (results){
    res.send(results);
  });
});

/* add new admin. */
router.post('/addUser', helpers.isAdmin, function(req, res, next) {
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
router.post('/remove', helpers.isAdmin, function(req, res, next) {
  user.removeAdmin(req.body.id, function (result){
    if(result){
      res.send({remove: true});
    } else {
      res.send({remove: false});  
    }
  });
});

module.exports = router;