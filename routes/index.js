var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/get_views', function(req, res, next) {
    res.json([{name: 'test'}]);
});

module.exports = router;
