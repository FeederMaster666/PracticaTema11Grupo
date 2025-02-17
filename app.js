var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const logger = require('morgan');


var app = express();
require('./database');
require('./passport/local-auth');

//Rutas definidas para poder encontrar los end-points (get,put,post...)
var tasksRouter = require('./routes/tasks');
var usersRouter = require('./routes/usuarios');
var indexRouter = require ('./routes/index');

// Configuración vistas
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static(path.resolve(__dirname + '/public')));
app.use(session({
  secret: 'mysecretsession',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


// middlewares
app.use((req, res, next) => {
  app.locals.signinMessage = req.flash('signinMessage');
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.user = req.user;
  next();
});

//routes : 
app.use('/', usersRouter); //rutas de '/' buscan en ./routes/usuarios
app.use('/', tasksRouter); //rutas de '/' buscan en ./routes/index
app.use ('/',indexRouter); // rutas con 'index' buscan en rutes/index

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Manejador de errores
app.use(function(err, req, res, next) {
  // Mostrar error en la consola con detalles
  console.error("❌ Error en la ruta:", req.method, req.url);
  console.error("📌 Mensaje:", err.message);
  console.error("📜 Stack Trace:", err.stack);

  // Set locals, solo proporcionando errores en desarrollo
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Renderizar la página de error
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
