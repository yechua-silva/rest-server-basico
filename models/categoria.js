
const { Schema, model } = require('mongoose')

const CategoriaSchema = Schema({
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
    }
})

CategoriaSchema.methods.toJSON = function() {
    const {__v, estado, ...categoria } = this.toObject(); 

    return categoria;
};  


module.exports = model('Categoria', CategoriaSchema)