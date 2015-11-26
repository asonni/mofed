var express = require('express');
var router = express.Router();
var login = require('../controller/login')(router);


router.get('/',function(req, res, next) {
  res.render('index', { title: 'شاشة الدخول' });
});

module.exports = router;
