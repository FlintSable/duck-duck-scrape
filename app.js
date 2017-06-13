var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var mongoose = require('mongoose');

var index = require('./controllers/controller.js');

var app = express();

var duckduckScrape = '127.0.0.1:27017/duckuckScrape';

if(process.env.MONGODB_URI){
	console.log("Heroku MONGODB URI" + process.env.MONGODB_URI);
	mongoose.connect(process.env.MONGODB_URI);
} else {
	mongoose.connect(duckduckScrape);
}

const db = mongoose.connection;

// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);


// mongo connection methods
db.on('error', function(err){
	console.log('Database Error: ', err);
});

db.once('open', function(){
	console.log('connected: ' + duckduckScrape);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
