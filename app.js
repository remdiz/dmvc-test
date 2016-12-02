//DEBUG=myapp:* npm start
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var MemoryStore = session.MemoryStore;      //TODO: dev-app storage only!
var sessionStorage = new MemoryStore();     //to get user ID from session in websockets
var COOKIE_SECRET = 'some secret';

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

var User = mongoose.model('Users', usersSchema);

var dMVC = require('dmvc');
//dMVC.init(mongoose);

//SOCKETS
var io = require('socket.io').listen(3333);
/*io.set('authorization', function (data, accept) {

    // check if there's a cookie header
    if (data.headers.cookie) {

        var parser = cookieParser(COOKIE_SECRET);
        parser(data, null, function(){});

        sessionStorage.get(data.signedCookies['connect.sid'], function(err, session) {
            // session
            console.log('Session: ', session.userID);
        });

    } else {
        // if there isn't, turn down the connection with a message
        // and leave the function.
        return accept('No cookie transmitted.', false);
    }
    // accept the incoming connection
    accept(null, true);
});*/
io.sockets.on('connection', function (socket) {

    // Connection establishment confirmation
    //socket.json.send({'event': 'connected', 'session': socket.upgradeReq});
    if(socket.handshake.headers.cookie) {
        var parser = cookieParser(COOKIE_SECRET);
        parser(socket.handshake, null, function(){
            sessionStorage.get(socket.handshake.signedCookies['connect.sid'], function(err, session) {
                // session
                if(session && session.userID) {    //TODO: check user ID
                    //var userID = session.userID;

                    dMVC.init(socket, session, mongoose);

                    /*// Input message
                    socket.on('message', function (msg) {

                        socket.json.send({'event': 'message echo', 'message': msg, user: userID});
                    });

                    // Client disconnection
                    socket.on('disconnect', function() {
                        *//*var time = (new Date).toLocaleTimeString();
                         io.sockets.json.send({'event': 'userSplit', 'name': ID, 'time': time});*//*
                    });*/
                }
                //console.log('Session: ', session.userID);
            });
        });
    }

    // Input message
    /*socket.on('message', function (msg) {

        socket.json.send({'event': 'message echo', 'message': msg});
    });*/

    // Client disconnection
    /*socket.on('disconnect', function() {
        var time = (new Date).toLocaleTimeString();
        io.sockets.json.send({'event': 'userSplit', 'name': ID, 'time': time});
    });*/

});

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
    secret: COOKIE_SECRET,
    store: sessionStorage,
    cookie: {}
}));

app.use('/', routes);
app.use('/users', users);

app.get('/init', function(req, res, next) {
    dMVC.Controller.getViews(req, res, next);
});

//TODO: /events/click/1234
app.post('/events', function(req, res, next) {

    //console.log('/events: ', req.body.evtType, req.body.evtObject, JSON.parse(req.body.evtObject));
    if(req.body.evtType == 'submit') {
        dMVC.Controller.addModel(req, res, next);
    } else if(req.body.evtType == 'click') {
        req.body.evtObject = JSON.parse(req.body.evtObject);
        dMVC.Controller.removeModel(req, res, next);
    }


    //res.json({body: req.body});
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
    //TODO: stopped here
    dMVC.Controller.removeModel(req, res, next);
    //res.json({user: req.session.userID, body: req.body.id});
});

app.post('/add_task', function(req, res, next) {

    dMVC.Controller.addModel(req, res, next);


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
