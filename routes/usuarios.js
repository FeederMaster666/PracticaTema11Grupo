const router = require('express').Router();//importamos el modulo de express para definir las rutas
const passport = require('passport');//importamos el modulo de passport para la autenticacion

//definimos la ruta de inicio
router.get('/', (req, res, next) => {
  res.render('index');
});

//ruta para la pagina de usuarios
router.get('/usuarios', function(req, res, next) {
  if(req.usuario.rol == "administrador"){//si el rol del usuario es 0 entonces puede ver la pagina de usuarios
    res.render('profile');//renderizamos la pagina de usuarios
  } else {
    res.redirect('/profile');//si no es asi lo redirigimos a la pagina de perfil
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


//ruta para procesar el formulario de (SIGNIN)--> envía la info del formulario a passport.authenticate
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
    if (err) { return next(err); }
    res.redirect('/');
  });
});

//

//funcion para verificar si el usuario esta autenticado
function isAuthenticated(req, res, next){
  if(req.isAuthenticated()){//si esta autenticado
    return next();//continua con la siguiente funcion
  }
  res.redirect('/');//sino redirige a la pagina de inicio
}

module.exports = router;