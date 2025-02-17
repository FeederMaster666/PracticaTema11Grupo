const express = require('express');
const router = express.Router();
const Asignatura = require('../models/asignatura'); 


router.get('/asignaturas',isAuthenticated, async (req, res) => {
  //const asignatura = new Asignatura();
  //const asignaturas = await asignatura.findAllFromUsuario(req.usuario._id);
  //res.render('asignaturas', {
    //tasks: asignaturas
  //});
  res.render('asignaturas'); //comprobar primero que se ve 
});

//Añadir métodos después


//middleware de autenticacion
function isAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
  
    res.redirect('/')
}


module.exports = router;
