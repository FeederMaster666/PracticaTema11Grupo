const router = require('express').Router();//importamos el modulo de express para definir las rutas
const passport = require('passport');//importamos el modulo de passport para la autenticacion
const Usuario = require('../models/usuario');//importamos el modelo de usuario


//definimos la ruta de inicio
router.get('/', (req, res, next) => {
  res.render('index');
});

//ruta para la pagina de usuarios
router.get('/usuarios',isAuthenticated, async function(req, res, next) {
  const usuario = new Usuario();
  const usuarios = await usuario.findAll();
  res.render('usuarios', {usuarios});

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



//para editar usuarios por id
router.get('/usuarios/editUsuario/:id', isAuthenticated, async function (req, res, next) {
  var usuario = new Usuario();
  usaurio = await usuario.findById(req.params.id);
  res.render('edit', {usuario});
});

router.post('/usuarios/editUsuario/:id', isAuthenticated,async function(req, res, next) {
  var usuario = new Usuario();
  usuario.nombre = req.body.nombre;
  await usuario.updateById(req.params.id);
  res.redirect('/usuarios');
});


//para eliminar usuarios por id
router.get('/usuarios/delete/:id', isAuthenticated, async function(req, res, next) {
  const usuario = new Usuario();
  let {id} = req.params;
  await usuario.delete(id);
  res.redirect('/usuarios');
});

router.post('/usuarios/delete/:id', isAuthenticated, async function(req, res, next) { 
  const usuario = new Usuario();
  let {id} = req.params;
  await usuario.delete(id);
  res.redirect('/usuarios');
});

//ruta para cerrar sesion
router.get('/logout', function(req, res, next) {
  req.logout(function(err){
    if (err) { return next(err); }
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