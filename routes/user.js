var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'الرئيسية' });
});

router.get('/confirm', function(req, res, next) {
  res.render('confirm', { title: 'مطابقة البيانات' });
});

module.exports = router;
