var express = require('express');
var router = express.Router();
// var test = require('../controller/mongo.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'شاشة الدخول' });
});

module.exports = router;
