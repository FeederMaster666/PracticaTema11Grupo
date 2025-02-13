const express = require('express');
const router = require('express').Router();//importamos el modulo de express para definir las rutas
const passport = require('passport');//importamos el modulo de passport para la autenticacion

//definimos la ruta de inicio
router.get('/', function(req, res, next) {
  res.send('index');
});


//DESDE LAS VISTAS, SE LLAMAN A ESTOS METODOS (GET,POST) QUE RENDERIZAN NUEVAS VISTAS EN LA PÁGINA WEB
//Parámetros de los get,post,etc -> req:solicitud del cliente, res:respuesta del servidor, next: para pasar el control a otro middleware

//ruta para la pagina de usuarios
router.get('/usuarios', function(req, res, next) {
  if (req.usuario && req.usuario.rol == 0) { // Verifica que req.usuario exista antes de acceder a rol
    res.render('usuarios'); // Renderiza la vista de usuarios
  } else {
    res.redirect('/'); // Redirige al usuario si no tiene el rol adecuado
  }
});

//ruta para mostrar el (SIGNUP)
router.get('/signup', function(req, res, next) {
  res.render('signup');//renderizamos la pagina de signup
});

//ruta para procesar el formulario de (SIGNUP)
router.post('/signup', passport.authenticate('local-signup', {//utilizamos el pasport para autenticar el signup
  successRedirect: '/profile',//si es exitoso pa profile
  failureRedirect: '/signup',//sino pa signup
  failureFlash: true //Habilita mensajes flash para errores
}));


//ruta para mostrar el (SIGNIN)
router.get('/signin', function(req, res, next) {
  res.render('signin');//renderizamos la pagina de signin
});


//ruta para procesar el formulario de (SIGNIN)
router.post('/signin', passport.authenticate('local-signin', {//utilizamos el pasport para autenticar el signin
  successRedirect: '/profile',//si es exitoso pa profile
  failureRedirect: '/signin',//sino pa signin
  failureFlash: true //Habilita mensajes flash para errores
}));


//ruta para mostrar el perfil del admin
router.get('/profile', isAuthenticated, function(req, res, next) {
  res.render('profile');//renderizamos la pagina de profile
});

//ruta para cerrar sesion
router.get('/logout', function(req, res, next) {
  req.logout(function(err){
    if(err){
      return next(err);
    }
    res.redirect('/');
  });
});

//funcion para verificar si el usuario esta autenticado
function isAuthenticated(req, res, next){
  if(req.isAuthenticated()){//si esta autenticado
    return next();//continua con la siguiente funcion
  }
  res.redirect('/');//sino redirige a la pagina de inicio
}

module.exports = router;