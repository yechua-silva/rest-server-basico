
const { Schema, model } = require('mongoose')

const productoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: { // Relacion del que creo la categoria
        type: Schema.Types.ObjectId, // Otro objeto de mongo
        ref: 'Usuario', // EL nombre del otro schema
        required: true
    },
    precio: {
        type: Number,
        default: 0
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: { 
        type: String
    },
    disponible: { 
        type: Boolean, 
        default: true
    },
    img: {
        type: String
    }
})

productoSchema.methods.toJSON = function() {
    const {__v, estado, ...data } = this.toObject(); 

    return data;
};  


module.exports = model('Producto', productoSchema)