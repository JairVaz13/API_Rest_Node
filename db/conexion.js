const mongoose = require('mongoose');
const conexion = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mi_blog');
        console.log('Conexión exitosa a la base de datos mi_blog');
    } catch (error) {
        console.log(error);
        throw new Error('Error de conexión a la base de datos mi_blog');
    }
}

module.exports = {
    conexion
}