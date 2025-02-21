const express = require('express');
const router = express.Router();
const asignatura = require('../models/asignatura');
const software = require('../models/software');
º

//Obtener software
router.get('/software/:id', async (req, res) => {//V
    const software = new Software(); 
    let { id } = req.params;
    const asignatura = new Asignatura();
    asignatura = asignatura.findById(id)
    const softwares = await software.findAllFromAsignatura(asignatura);
    res.render('software', { softwares });
});

// Para añadir software sin usar el signup
router.post('/software/add/:id', async (req, res) => {
    try {
        let asignatura = req.params.id;        
        const { link, descripcion } = req.body;

        // Crear nuevo software
        const newSoftware = new software({
            link,
            descripcion,
            asignatura
        });

        // Guardar usuario
        await newSoftware.insert();

        console.log('Contenido agregado con éxito:', newSoftware);

        return res.redirect('/software/'+asignatura);
    } catch (error) {
        console.error('Error al agregar contenido:', error);
        return res.status(500).send('Error en el servidor');
    }
});

//Ruta para eliminar un software por su id
router.get('/software/delete/:id', isAuthenticated, async (req, res, next) => {
    const software = new Software();
    let { id } = req.params;
    await software.delete(id);
    res.redirect('/software');
});

module.exports = router;