var express = require('express');
var router = express.Router();
var user = require("../controller/user"),
    mofednid = require('../controller/mofednid'),
    mofedbase = require('../controller/mofedbase'),
    confirm = require('../controller/confirm'),
    helpers = require('../controller/userHelpers'),
    mailer = require('../controller/mailer');

/* GET admins listing. */
router.get('/',function(req, res, next) {
  res.render('admin', { title: 'الرئيسية' });
});

/* GET students listing. */
router.post('/students',function(req, res, next) {
  confirm.getConfirmations(function (students){
    res.send(students);
  });
});

/* GET students listing. */
router.post('/verify',function(req, res, next) {
  confirm.verify(req.body.id, function(result){
    if(result){
      res.send({verify : true});
    } else {
      res.send({verify : false});
    }
  })
});

module.exports = router;