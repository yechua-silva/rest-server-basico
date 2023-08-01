const { Schema, model } = require('mongoose')

/*MODELO OBJETO DE INFORMACION
    nombre: '',
    correo: '',
    password: '',
    img: url,
    rol: '',
    estado: si esta o no disponible en la DB ya que no se eliminara de la DB,
    google: true- si fue creado por google, y false si fue creado por mi propio sistema
*/

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'], // Se le puede asignar un arreglo con el valor de si es requerido, y en caso de no ingresarlo se manda un segundo parametro como el error
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE',] //En teoria valida que el rol sea uno de esos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});


UsuarioSchema.methods.toJSON = function() {
    // Extaer de la instacia de Usuario el __v y el password y se crea la intancioa usuario sin esos datos - Esto sirve en el caso en que la respuesta sea el usuario, no se mandara el password del mismo 
    const {__v, password,_id, ...usuario } = this.toObject(); 
    usuario.uid = _id; 

    return usuario;
};    


module.exports = model( 'Usuario', UsuarioSchema );