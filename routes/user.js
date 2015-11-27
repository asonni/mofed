var express = require('express');
var router = express.Router();
var user = require("../controller/user"),
    mofednid = require('../controller/mofednid'),
    mofedbase = require('../controller/mofedbase');
var helpers = require('../controller/userHelpers'),
    mailer = require('../controller/mailer');



/* GET users listing. */
router.get('/', function(req, res, next) {
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
          user : {
            email : result.email,
            token : result._id
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
router.get('/activate/:token', function(req, res, next) {
  user.activate(req.params.token,function(result){
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
router.get('/isRegistered', function(req, res, next) {
  user.isRegistered(req.query.value,function(result){
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
  mofedbase.getStudents(req.body.lawnum, function(students){
    mofednid.getPerson(req.body.nid,req.body.regnum, function(person){
      res.render('confirm', {students: students,person: person});
    })
    // res.send({check:true});
  });
});

router.get('/confirm', function(req, res, next) {
  res.render('confirm', { title: 'مطابقة البيانات' });
});

module.exports = router;
