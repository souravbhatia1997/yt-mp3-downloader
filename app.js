var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

var indexRouter = require('./routes/index');
// var googleDriveRouter = require('./routes/googledrive');

// require("./googledrive");
// const scanFolderForFiles = require('./upload');

// let mp3FolderPath = path.join(__dirname, "public", "static", "mp3");
// console.log("mp3FolderPath:  ", mp3FolderPath);
// scanFolderForFiles(mp3FolderPath).then(() => {
//   console.log('🔥 All files have been uploaded to Google Drive successfully!');
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/ytdownload', indexRouter);
// app.use('/api/v1/drive', googleDriveRouter);

app.get('/', (req, res) => {
  res.render('index');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
