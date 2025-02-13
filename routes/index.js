var express = require('express');  // Importa Express
var router = express.Router();  // Crea un enrutador de Express

/* GET home page. */
router.get('/', function(req, res, next) {  // Define una ruta GET en "/"
  res.render('index', { title: 'Express' });  // Renderiza la vista "index.ejs"
});

module.exports = router;  // Exporta el enrutador para su uso en `app.js`

/*
Importa Express: Se carga el framework Express, que permite manejar rutas y peticiones HTTP.
Crea un enrutador: express.Router() facilita la gestión de rutas en módulos separados.
Define la ruta GET /:
Cuando un usuario accede a /, se ejecuta la función que recibe req (request) y res (response).
res.render('index', { title: 'Express' }) indica que se renderiza la vista index.ejs y se le pasa el objeto { title: 'Express' }.
Exporta el enrutador: Esto permite usar esta ruta en app.js.
*/