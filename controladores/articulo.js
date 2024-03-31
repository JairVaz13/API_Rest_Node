    const validator = require('validator');
    const Articulo = require('../modelo/Articulo');


    const prueba = (req, res) => {
        return res.status(200).json({
            mensaje:"Soy una accion de prubea en mi controlador articulo"
        });
    }


    const articulo = (req, res) => {


    let parametros = req.body;

        // Validar datos

        try {
            var validar_titulo = !validator.isEmpty(parametros.titulo) && validator.isLength(parametros.titulo, {min:5, max:undefined});
            var validar_contenido = !validator.isEmpty(parametros.contenido) && validator.isLength(parametros.contenido);
            if (!validar_titulo || !validar_contenido){
                throw new Error("No se ha validado la informacion")
            }
        } catch (error) {
            return res.status(400).json({
                status:"error",
                mensaje:"Faltan datos por enviar "
            })
        }

    
        // Crear el objeto a guardar

        const articulo = new Articulo(parametros);

        articulo.save().then((articuloGuardado) => {
            return res.status(200).json({
                status:"success",
                articuloGuardado,
                mensaje:"Articulo guardado con exito"
            })
        }).catch((error) => {
            return res.status(500).json({
                status:"error",
                error,
                mensaje:"Error al guardar el articulo " + error.mensaje
            });
        });
    }

    const listar = (req, res) => {
        Articulo.countDocuments({})
            .then((count) => {
                if (count === 0) {
                    return res.status(404).json({
                        status: "error",
                        mensaje: "No hay artículos para mostrar"
                    });
                }
                return Articulo.find({}).sort({ fecha: -1 })
                    .then((articulos) => {
                        return res.status(200).json({
                            count,
                            status: "success",
                            articulos
                        });
                    });
            })
            .catch((error) => {
                return res.status(500).json({
                    status: "error",
                    error: error.message,
                    mensaje: "Error al listar los artículos"
                });
            });
    }
    
const uno = (req, res) => {
    // Recoger un id por la url
    let id = req.params.id;
    // Buscar artículo
    Articulo.findById(id)
        .then((articulo) => {
            // Si no existe, devolver error
            if (!articulo) {
                return res.status(400).json({
                    status: "Error",
                    mensaje: "No se ha encontrado el artículo",
                });
            }
            // Devolver resultado
            return res.status(200).json({
                status: "Success",
                articulo,
            });
        })
        .catch((error) => {
            return res.status(400).json({
                status: "Error",
                mensaje: "Ha ocurrido un error al buscar el artículo",
            });
        });
};

const eliminar = (req, res) => {
    const id = req.params.id;
    Articulo.findOneAndDelete({ _id: id }) // Usamos _id como filtro
        .then((articuloEliminado) => {
            if (!articuloEliminado) {
                return res.status(404).json({
                    status: "Error",
                    message: "Articulo no encontrado",
                });
            }
            return res.status(200).json({
                status: "Success",
                id,
                message: "Articulo eliminado con éxito: " + id
            });
        })
        .catch((error) => {
            return res.status(500).json({
                status: "Error",
                message: "Error al eliminar el artículo: " + error.message,
            });
        });
};

const fs = require("fs");
const subir = async (req, res) => {
// Recoger el fichero de la imagen y comprobar que existe
if (!req.file) {
return res.status(404).send({
status: 'error',
message: 'Image not found'
})
}
// Conseguir el nombre del archivo
let image = req.file.originalname
// Sacar la extension del archivo
const imageSplit = image.split('\.')
const extension = imageSplit[1]
// Comprobar si la extension es correcta
if (extension != 'png' &&
extension != 'jpg' && extension != 'jpeg'
&& extension != 'gif') {
// Ruta donde esta el archivo
const filePath = req.file.path
// Si no es correcto borrar archivo
const fileDelete = fs.unlinkSync(filePath)
// Devolver respuesta
return res.status(400).send({
status: 'error',
message: 'File with unsupported extension.'
})
}

try {
// Si es correcto guardar imagen en bbdd
let updatedUser = await Articulo.findByIdAndUpdate({_id:req.params.id,},{ imagen:
req.file.filename }, { new: true });
// Devolver respuesta
return res.status(200).send({
status: 'success',
message: 'Image uploaded',
user: updatedUser
})

} catch (error) {
return res.status(400).send({
status: 'error',
message: 'Error while updating image',
})
}
}


    // En este exports voy a pasar el nombre de todos los controlladores
    module.exports = {
        prueba,
        articulo,
        listar,
        uno,
        eliminar,
subir
    }