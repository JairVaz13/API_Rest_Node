const express = require("express");
const router = express.Router();
const ArticuloControlador = require('../controladores/articulo');

const bodyParser = require('body-parser');

const multer = require('multer');

router.use(bodyParser.urlencoded({extended: true}));

const almacenamiento = multer.diskStorage({
    destination: function (req, file, cb) { 
    cb(null, "./imagenes/articulos/"); 
    },
    filename: function (req, file, cb) { 
    
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.')[1]); 
    }
    });
    const subidas = multer({ storage: almacenamiento });
// Rutas de prueba

router.get('/ruta-de-prueba', ArticuloControlador.prueba);

router.post('/crear', ArticuloControlador.articulo);

router.get('/articulos', ArticuloControlador.listar);

router.get('/articulo/:id', ArticuloControlador.uno);

router.delete('/borrar/:id', ArticuloControlador.eliminar);

router.post("/subir-imagen/:id",[subidas.single("Myfile")],
ArticuloControlador.subir);

module.exports = router;
