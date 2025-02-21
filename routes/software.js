const express = require('express');
const router = express.Router();
const Asignatura = require('../models/asignatura');
const Software = require('../models/software');


//Obtener software
// Ruta para obtener todos los softwares de una asignatura específica
router.get('/software/:id', async (req, res) => {
    const software = new Software();
    const softwares = await software.findAllFromAsignatura(req.params.id); // Usamos req.params.id en lugar de req.asignatura
    console.log("Debería encontrar cosas de asignaturas: " + softwares);
    const asignaturas = await Asignatura.find(); // Obtiene todas las asignaturas
    
    res.render('software', { softwares, asignaturas }); // Pasamos 'asignaturas' al renderizado para consistencia
});

// Para añadir software sin usar el signup
router.post('/software/add', async (req, res) => {
    try {
        let asignatura = req.params.id;
        const { link, descripcion } = req.body;

        // Crear nuevo software
        const newSoftware = new Software({
            link,
            descripcion,
            asignatura
        });

        // Guardar usuario
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