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

module.exports = router;