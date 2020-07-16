var createError = require('http-errors');  // 404检测错误页
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');  // 解析cookie
var logger = require('morgan');  // 生成日志

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var blogRouter = require('./routes/blog');
// var uploadRouter = require('./routes/upload');
// var bannerRouter = require('./routes/banner');

const bodyParser = require('body-parser');


var app = express();

// view engine setup  注册前端模板视图
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));  // 注册日志
app.use(express.json()); // post请求参数JSON格式，req.body获取
app.use(express.urlencoded({ extended: false }));  // 类似表单提交参数获取
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));  // 注册静态文件
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// 设置跨域访问
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('X-Powered-By', '3.2.2');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
})

// 注册路由
app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/blog', blogRouter);
// app.use('/upload', uploadRouter);
// app.use('/banner', bannerRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
