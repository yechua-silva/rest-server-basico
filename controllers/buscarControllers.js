const { request, response } = require("express");
const { ObjectId } = require('mongoose').Types;
const {
    Usuario,
    Categoria,
    Producto
} = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]

const buscarUsuarios = async ( termino = '', res = response ) => {

    // Si es un id de mongo es true, si no, es false
    const esMongoId = ObjectId.isValid( termino );

    if ( esMongoId ) {
        const usuario = await Usuario.findById( termino );
        return res.json({
            results: ( usuario ) ? [ usuario ] : [] // Verifica la existecia de un usuario 
        })
    }

    const regex = new RegExp( termino, 'i' ); // Hace que se sea insensible las mayuscular y minisculas

    const total = await Usuario.count( {
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });
    
    const usuarios = await Usuario.find( {
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    });

    res.json({
        results: total, usuarios
    })
}

const buscarCategorias = async ( termino = '', res = response ) => {
    // Si se busca por id
    const esMongoId = ObjectId.isValid( termino );

    // Buscar por id en caso de
    if ( esMongoId ) {
        const categoria = await Categoria.findById( termino )
                            .populate( 'usuario', 'nombre' );
        return res.json({
            results: ( categoria ) ? [ categoria ] : []
        })
    }

    // En caso de busar por nombre
    const regex = new RegExp( termino , 'i');

    const total = await Categoria.count({ nombre: regex, estado: true })

    const categoria = await Categoria.find({ nombre: regex, estado: true })
                        .populate( 'usuario', 'nombre' )

    res.json({
        results: total, categoria
    })
}

const buscarProductos = async ( termino = '', res = response ) => {
    // Si se busca por id
    const esMongoId = ObjectId.isValid( termino );

    if ( esMongoId ) {
        // Buscar por id - producto
        const productoId = await Producto.findById( termino ).populate( 'categoria', 'nombre' ).populate( 'usuario', 'nombre' );

        if ( productoId ) {
            return res.json({
                results: productoId
            })
        }
        
        // Buscar por id - categoria
        const categoriaId = await Producto.find({ categoria: termino }).populate( 'categoria', 'nombre' ).populate( 'usuario', 'nombre' );

        if ( categoriaId ) {
            const total = await Producto.count({ categoria: termino }).populate( 'categoria', 'nombre' ).populate( 'usuario', 'nombre' );
            return res.json({
                results: total, categoriaId
            })
        }
    }


    // En caso de buscar por nombre
    const regex = new RegExp( termino, 'i' );

    const total = await Producto.count({ nombre: regex, estado: true })

    const producto = await Producto.find({ nombre: regex, estado: true })
                        .populate( 'categoria', 'nombre' )
                        .populate( 'usuario', 'nombre' );

    res.json({
        results: total, producto
    })
}

const buscar = (req = request, res = response ) => {
    const { coleccion, termino } = req.params;

    // Verificar si la coleccion esta permitida
    if ( !coleccionesPermitidas.includes( coleccion ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch ( coleccion ) {
        case 'usuarios':
            buscarUsuarios( termino, res );
        break;

        case 'categorias':
            buscarCategorias( termino, res );
        break;

        case 'productos':
            buscarProductos( termino, res );
        break;
    
        default:
            res.status(500).json({
                msg: 'Se le olvido hacer esta busqueda'
            })
    }

}


module.exports = {
    buscar
}