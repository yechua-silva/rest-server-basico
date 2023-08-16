const { request } = require('express')
const { 
    Producto, 
    Categoria, 
    Usuario, 
    Role 
} = require('../models')



const existeCategoria = async ( id ) => {
    // Verificar si el correo existe
    const existeCategoria = await Categoria.findById( id ) 
    if ( !existeCategoria ) { // Si no existe lo anula para que entre y mande el error
        throw new Error(`El id: ${id}, no existe`)
    } 

    if ( existeCategoria.estado == false ) { 
        throw new Error(`La categoria: ${existeCategoria.nombre}, fue eliminada`)
    }
}

const existeProducto = async ( id ) => {
    // Verificar si categoria existe
    const productoDB = await Producto.findById( id );
    if ( !productoDB ) {
        throw new Error(`El id: ${id}, no existe`)
    }

    if ( productoDB.estado == false ) {
        throw new Error(`El producto: ${productoDB.nombre}, fue eliminado`)
    }
}




const esRolValido = async ( rol = '' ) => {
    const existeRol = await Role.findOne({ rol });
    if ( !existeRol ) { // Si no encuentra nada, entra al errors
        throw new Error(`El rol: ${rol}, no esta regitrado en la DB`);
    }
}
const existeEmail = async ( correo = '') => {
    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo }) 
    if ( existeEmail ) {
        throw new Error(`El correo: ${correo},ya esta registrado`)
    }
}

const existeUsuarioPorId = async ( id ) => {
    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById( id ) 
    if ( !existeUsuario ) { // Si no existe lo anula para que entre y mande el error
        throw new Error(`El id: ${id}, no existe`)
    } 
}

const sonNumeros = async ( { limit = 5, desde = 0 } = request) => {
    // Desestructurar parametro de la URL
    // const { limit = 5, desde = 0 } = request; // Por default, en caso de no entregrar ese parametro sera de 5
    Number(limit);
    Number(desde);
    // VAlidar que lo parametro sean efectivamente numeros
    if ( isNaN( limit ) ) {
        throw new Error('Los parametros deben de ser numeros');
    } 
    if ( isNaN( desde )) {
        throw new Error('Los parametros deben de ser numeros');
    }
}

// Validar colecciones permitidas
const coleccionesPermitidas = ( coleccion = '', colecciones = [] ) => {
    const incluida = colecciones.includes( coleccion );

    if ( !incluida ) {
        throw new Error(`La coleccion: ${coleccion}, no es permitida. - ${colecciones}`)
    }

    return true;
}

module.exports = {
    esRolValido,
    existeEmail,
    existeUsuarioPorId,
    sonNumeros,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}