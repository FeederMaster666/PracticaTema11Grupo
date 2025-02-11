const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const usuario = require('../models/usuario');





passport.use('local-signup', new LocalStrategy({
  usuarionameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  var usuario = new Usuario();
  usuario = await usuario.findEmail( email)
  if(usuario) {
    return done(null, false, req.flash('signupMessage', 'The Email is already Taken.'));
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
