//DEBUG=myapp:* npm start
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/dmvc');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('DB connected');
});
var usersSchema = mongoose.Schema({
    login: String,
    pwd: String
});
/*var tasksSchema = mongoose.Schema({
    userID: String,
    task: String,
    done: Boolean
});
var Task = mongoose.model('Tasks', tasksSchema);*/
var User = mongoose.model('Users', usersSchema);

var dMVC = require('dmvc');
dMVC.init(mongoose);

//SOCKETS
/*var io = require('socket.io').listen(3333);
io.sockets.on('connection', function (socket) {

    // Посылаем клиенту сообщение о том, что он успешно подключился и его имя
    socket.json.send({'event': 'connected', 'someData': 'test'});
    // Навешиваем обработчик на входящее сообщение
    socket.on('message', function (msg) {
        var time = (new Date).toLocaleTimeString();
        // Уведомляем клиента, что его сообщение успешно дошло до сервера
        socket.json.send({'event': 'messageSent', 'name': ID, 'text': msg, 'time': time});
    });
    // При отключении клиента - уведомляем остальных
    socket.on('disconnect', function() {
        var time = (new Date).toLocaleTimeString();
        io.sockets.json.send({'event': 'userSplit', 'name': ID, 'time': time});
    });
});*/

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'some secret',
    cookie: {}
}));

app.use('/', routes);
app.use('/users', users);

app.get('/get_views', function(req, res, next) {
    var views = dMVC.getViews();
    console.log('views: ', views);
    res.json(views);
});

app.get('/register', function(req, res, next) {
    res.render('register', { title: 'Express' });
});

app.post('/register', function(req, res, next) {
    var user = new User({
        login: req.body.login,
        pwd: req.body.pwd
    });
    user.save(function (err, user) {
        if (err) {
            res.redirect('/register');
            //return console.error(err);
        } else {
            res.redirect('/');
        }
    });
});

app.post('/', function(req, res, next) {
    User.find({login: req.body.login, pwd: req.body.pwd}, function (err, users) {
        if (err) return console.error(err);
        if(users.length == 1) {
            req.session.userID = users[0]._id;
            res.redirect('/app');
        } else {
            res.redirect('/');
        }
        //res.json(users);
        //console.log(kittens);
    });

});

app.get('/app', function(req, res, next) {
    if(req.session.userID) {
        //res.json({userID: req.session.userID});
        res.render('app', { title: 'Express' });
    } else {
        res.redirect('/');
    }
});

app.post('/del_task', function(req, res, next) {
    res.json({user: req.session.userID, body: req.body.id});
});

app.post('/add_task', function(req, res, next) {

    dMVC.Controller.addModel(req, res, next);

    /*var task = dMVC.Controller.addModel({
        userID: req.session.userID,
        task: req.body.task
    });*/

    /*var task = new Task({
        userID: req.session.userID,
        task: req.body.task,
        done: false
    });
    task.save(function (err, task) {
        if (err) {
            res.json({error: err});
        } else {
            res.json({done: task});
        }
    });*/

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
