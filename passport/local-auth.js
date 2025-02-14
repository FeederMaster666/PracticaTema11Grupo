//local-auth

//Importacion de módulos
const passport = require('passport'); //middleware de autenticación
const LocalStrategy = require('passport-local').Strategy; //permite autenticación con usuario y contraseña.

const User = require('../models/usuario'); //modelo usuario

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

//Estrategia de registro de usuario
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email', //Es un nombre de configuración propio del modulo passport.js, se debe llamar 'usernameField' y no 'usuarionameField'
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  var user = new User();
  user = await user.findByEmail( email)
  //Si usuario existe da error
  if(user) {
    return done(null, false, req.flash('signupMessage', 'El Email ya ha sido asignado.'));
  //Sino existe, crea el nuevo usuario
  } else {
    const newUser = new Usuario();
    newUser.email = email;
    newUser.password = newUser.encryptPassword(password);
    newUser.rol = req.body.rol;
    newUser.nombre = req.body.nombre;
    newUser.apellido = req.body.apellido;
    await newUser.insert()
    .then(result => console.log(result))
    .catch(error => console.log(error));
    done(null, newUser);
  }
}));

//Estrategia de login
passport.use('local-signin', new LocalStrategy({
  usernameField: 'email', //Objeto propio de passport. No cambiar 'user' a 'usuario'
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  var user = new User();
  user = await user.findByEmail( email);
  if(!user) {
    return done(null, false, req.flash('signinMessage', 'Usuario no encontrado'));
  }
  if(!user.comparePassword(password)) {
    return done(null, false, req.flash('signinMessage', 'Contraseña incorrecta'));
  }
  return done(null, user);
}));
