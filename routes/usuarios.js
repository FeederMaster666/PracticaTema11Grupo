const router = require('express').Router();//importamos el modulo de express para definir las rutas
const passport = require('passport');//importamos el modulo de passport para la autenticacion
const Usuario = require('../models/usuario');

//definimos la ruta de inicio
router.get('/', (req, res, next) => {
  res.render('index');
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
    if (err) { return next(err); }
    res.redirect('/');
  });
});

//Ruta para ver usuarios
router.get('/usuarios', isAuthenticated, async (req, res, next) =>{
  const usuario = new Usuario(); // Instancia correcta del modelo
  const usuarios = await usuario.findAll(); // Llamar al método 
  res.render('usuarios', { usuarios });
});

// Para añadir usuarios sin usar el signup
router.post('/usuario/add', async (req, res) => {
  const usuario= new Usuario();
  try {
    const { email, password, rol, nombre, apellido } = req.body;

    // Verificar si el email ya está registrado
    const existingUser = await Usuario.findOne({ email });

    if (existingUser) {
      req.flash('signupMessage', 'El correo ya está en uso.');
      return res.redirect('/usuario/add'); // O redirigir a una página de error
    }

    // Crear nuevo usuario
    const newUser = new Usuario({
      email,
      password: usuario.encryptPassword(password), // Asegúrate de que sea un método estático
      rol,
      nombre,
      apellido,
    });

    // Guardar usuario
    await newUser.insert();

    console.log('Usuario agregado con éxito:', newUser);

    return res.redirect('/usuarios'); // Ruta corregida con '/'
  } catch (error) {
    console.error('Error al agregar usuario:', error);
    return res.status(500).send('Error en el servidor');
  }
});


//Ruta  para mostrar el formulario de edicion de un usuario
router.get('/usuarios/editUsuarios/:id', isAuthenticated, async function (req, res, next) {
  var usuario = new Usuario();
  usuario = await usuario.findById(req.params.id);
  res.render('editUsuarios', { usuario });
});

//Ruta POST para actualizar un usuario
router.post('/usuarios/editUsuarios/:id', isAuthenticated, async function(req, res, next) {
  const usuario = new Usuario();
  const { id } = req.params;
  await usuario.update({_id : id}, req.body);
  res.redirect('/usuarios');
});

//Ruta para eliminar un usuario por su id
router.get('/usuarios/delete/:id', isAuthenticated, async (req, res, next) =>{
  const usuario = new Usuario();
  let {id} = req.params;
  await usuario.delete(id);
  res.redirect('/usuarios');
});




//funcion para verificar si el usuario esta autenticado
function isAuthenticated(req, res, next){
  if(req.isAuthenticated()){//si esta autenticado
    return next();//continua con la siguiente funcion
  }
  res.redirect('/');//sino redirige a la pagina de inicio
}

module.exports = router;