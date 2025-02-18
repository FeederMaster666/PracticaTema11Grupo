const express = require('express');
const router = express.Router();
const Asignatura = require('../models/asignatura'); 
const Usuario = require('../models/usuario'); // Modelo de usuarios
const Estudio = require('../models/estudio'); // Modelo de estudios

//Obtener asignaturas
router.get('/asignaturas',isAuthenticated, async (req, res) => {
    const asignatura = new Asignatura();
  const asignaturas = await asignatura.findAllFromUsuario(req.user);
  console.log("Lo que encuentra enfindAllFromUsuario"+asignatura)
  const usuarios = await Usuario.find(); // Obtiene todos los usuarios
  // Filtrar profesores y alumnos
  const profesores = usuarios.filter(user => user.rol === 'profesor');
  const alumnos = usuarios.filter(user => user.rol === 'alumno');
  const estudios = await Estudio.find(); // Obtiene todos los estudios
  res.render('asignaturas', {asignaturas,profesores, alumnos, estudios});
});


//Con este enviamos a la BDD cuando clicamos en añadir del formulario
router.post('/asignatura/add', async (req, res) => {
    try {
        const { nombre, curso, alumnos, profesores, estudio } = req.body;

        // Crear la asignatura con los datos del formulario
        const nuevaAsignatura = new Asignatura({
            nombre,
            curso,
            alumnos: Array.isArray(alumnos) ? alumnos : [alumnos], // Asegurar que sea un array
            profesores: Array.isArray(profesores) ? profesores : [profesores],
            estudio
        });

        await nuevaAsignatura.save();
        res.redirect('/asignaturas'); // Redirigir tras guardar
    } catch (error) {
        console.error('Error al guardar asignatura:', error);
        res.status(500).send('Error al guardar la asignatura');
    }
});

//Ruta para eliminar un usuario por su id
router.get('/asignaturas/delete/:id', isAuthenticated, async (req, res, next) =>{
  const asignatura = new Asignatura();
  let {id} = req.params;
  console.log("Intentando eliminar asignatura con ID:", id); //Trazas para pruebas 
  await asignatura.delete(id);
  res.redirect('/asignaturas');
});


//middleware de autenticacion
function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
  
    res.redirect('/')
}


module.exports = router;
