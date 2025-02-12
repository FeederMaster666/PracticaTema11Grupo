//local-auth

//Importacion de módulos
const passport = require('passport'); //middleware de autenticación
const LocalStrategy = require('passport-local').Strategy; //permite autenticación con usuario y contraseña.

const usuario = require('../models/usuario'); //modelo usuario

//Estrategia de registro de usuario
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email', //Es un nombre de configuración propio del modulo passport.js, se debe llamar user y no usuario
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  var usuario = new usuario();
  usuario = await usuario.findEmail( email)
  //Si usuario existe da error
  if(usuario) {
    return done(null, false, req.flash('signupMessage', 'The Email is already Taken.'));
  //Sino existe, crea el nuevo usuario
  } else {
    const newusuario = new Usuario();
    newusuario.email = email;
    newusuario.password = newusuario.encryptPassword(password);
    await newusuario.insert()
    .then(result => console.log(result))
    .catch(error => console.log(error));
    done(null, newusuario);
  }
}));

//Estrategia de login
passport.use('local-signin', new LocalStrategy({
  usuarionameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  var usuario = new Usuario();
  usuario = await usuario.findEmail( email);
  if(!usuario) {
    return done(null, false, req.flash('signinMessage', 'No usuario Found'));
  }
  if(!usuario.comparePassword(password)) {
    return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
  }
  return done(null, usuario);
}));
