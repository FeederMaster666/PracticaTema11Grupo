const express = require('express');
const router = express.Router();
const Asignatura = require('../models/asignatura');
const Software = require('../models/software');


//Obtener software
// Ruta para obtener todos los softwares de una asignatura específica
router.get('/software/:id', async (req, res) => {
    //Primero pillar la asignatura
    const asignaturaId = req.params.id;
    const asignatura = await Asignatura.findById(asignaturaId); // Buscar en la BD
    console.log("Esta es la asignatura que encuentra: "+asignatura.id+" "+asignatura.nombre) //Traza 1
    const software = new Software();
    const softwares = await software.findAllFromAsignatura(asignatura); // Usamos req.params.id en lugar de req.asignatura
    console.log("Este es el software de la asignatura: " + softwares); //Traza 2
    res.render('software', { softwares, asignatura }); // Pasamos 'asignaturas' al renderizado para consistencia
});

// Para añadir software sin usar el signup
router.post('/software/add', async (req, res) => {
    try {
        //let asignatura = req.params.id;//No se lo estamos pasando por ruta, sino por el body
        const { link, descripcion,asignaturaId } = req.body;

        // Crear nuevo software
        const newSoftware = new Software({
            link,
            descripcion,
            asignatura: asignaturaId // Guardamos el ID de la asignatura, en el campo 'asignatura' de softwareSchema
        });

        // Guardar software
        await newSoftware.insert();

        console.log('Contenido agregado con éxito:', newSoftware);

        return res.redirect('/asignaturas');
    } catch (error) {
        console.error('Error al agregar contenido:', error);
        return res.status(500).send('Error en el servidor');
    }
});

//Ruta para eliminar un software por su id
router.get('/software/delete/:id', async (req, res, next) => {
    const software = new Software();
    let { id } = req.params;
    await software.delete(id);
    res.redirect('/software');
});


module.exports = router;