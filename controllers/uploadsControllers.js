const { request, response } = require("express");
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
// Autenticarse en cloudinary
cloudinary.config( process.env.CLOUDINARY_URL )


const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require('../models');
const { validarArchivoSubir } = require("../middleware");


const cargarArchivo = async  ( req = request, res = response ) => {
    try {
        // textos
        // const nombre = await subirArchivo( req.files, ['txt', 'md'], 'texto' );

        const nombre = await subirArchivo( req.files, undefined, 'imgs'); // undefined para usar los argumentos por defecto
    
        res.json({
          nombre
        })
      
    } catch (msg) {
        res.status(400).json({ msg })
    }


}


const actualizarImagen = async ( req = request, res = response ) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })    
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                })    
            }
        break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            })
    }

    // Limpiar imagenes previa
    if ( modelo.img ) { // Verificar si el modelo tiene la propiedad img establecida
        //hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if ( fs.existsSync( pathImagen ) ) { // Verificar si existe la imagen el uploads
            // Borrar archivo
            fs.unlinkSync( pathImagen );
        }
    }


    // Guardar img
    const nombre = await subirArchivo( req.files, undefined, coleccion); // Extrae el archivo del reques, el indefined para usar lo paramentros por defecto que son img, y el nombre de la carpeta a crear, o a guardar en caso de que exista
    modelo.img = nombre

    // Guardar en DB
    modelo.save()

    res.json({ modelo }) 
}

const actualizarImagenCloudinary = async ( req = request, res = response ) => {
    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })    
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                })    
            }
        break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            })
    }

    // Limpiar imagenes previa
    if ( modelo.img ) { // Verificar si el modelo tiene la propiedad img establecida
        // Extraer el nombre del archivo del URl
        const nombreArr = modelo.img.split('/')
        const nombre = nombreArr[ nombreArr.length - 1 ];
        const [ public_id ] = nombre.split('.');

        // Eliminar imagen anterior
        cloudinary.uploader.destroy( public_id );
    }

    // Desesctructurar temFilePath
    const { tempFilePath } = req.files.archivo

    const { secure_url } = await cloudinary.uploader.upload( tempFilePath )

    modelo.img = secure_url
    await modelo.save()

    res.json( modelo ) 
}

const mostrarImagenes = async (req = request, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch ( coleccion ) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id: ${id}`
                })    
            }
        break;
        case 'productos':
            modelo = await Producto.findById(id);
            if ( !modelo ) {
                return res.status(400).json({
                    msg: `No existe un producto con el id: ${id}`
                })    
            }
        break;
    
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            })
    }

    // Limpiar imagenes previa
    if ( modelo.img ) { // Verificar si el modelo tiene la propiedad img establecida
        //hay que borrar la imagen del servidor
        const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img );
        if ( fs.existsSync( pathImagen ) ) { // Verificar si existe la imagen el uploads
            // Retornar img
            return res.sendFile( pathImagen );
        }
    }

    // Retornar no-image
    const pathNoImage = path.join( __dirname, '../assets/no-image.jpg')
    if ( !fs.existsSync(  pathNoImage) ) {
        return res.status(400).json({
            msg: 'No existe imagen - no image'
        })
    }

    // Enviar placeholder - no image
    res.sendFile( pathNoImage );
}




module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagenes,
    actualizarImagenCloudinary
}