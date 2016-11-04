var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*router.get('/get_views', function(req, res, next) {
    var view = new dMVC.View('menu');
    console.log('view: ', view);
    res.json([view]);
});*/

module.exports = router;
