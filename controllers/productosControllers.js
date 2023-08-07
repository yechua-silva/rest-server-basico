
const { request, response } = require('express');
const { Categoria, Usuario, Producto } = require('../models');

// Obtener categorias - todas
const obtenerProducto = async ( req = request, res = response ) => {
    // Desectructurar los parametros
    const { limit = 5, desde = 0 } = req.query;

    // Obtener el total
    const query = { estado: true };
    const [total, productos] = await Promise.all([
        Producto.countDocuments( query ),
        Producto.find( query )
            .skip( Number( desde ) )
            .limit( Number( limit ) )
            .populate( 'usuario', 'nombre')
            .populate( 'categoria', 'nombre')
            .exec()
    ])

    res.status(200).json({
        total,
        productos
    })
}

// Obtener producto por id
const obtenerProductoPorId = async ( req = request, res = response ) => {
    const { id } = req.params;

    const producto = await Producto.findById(id)
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');


    res.status(200).json(producto)
}

// Crear producto
const crearProducto = async ( req = request, res = response ) => {
    const { precio, descripcion, categoria } = req.body
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDb = categoria.toUpperCase();
    // Verificar si categoria existe
    const categoriaDB = await Categoria.findOne({ nombre: categoriaDb });
    if ( !categoriaDB ) {
        res.status(400).json({
            msg: `La Categoria: ${categoria}, no existe`
        })
    }

    // VErificar si existe en DB
    const productoDB = await Producto.findOne({ nombre });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto: ${productoDB.nombre}, ya existe `
        })
    }

    
    // Generar data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id,
        precio,
        categoria: categoriaDB._id,
        descripcion
    }

    // Crear instancia
    const producto = new Producto( data );

    // Guardar en DB
    await producto.save();

    res.status(201).json(producto);
}

// Actualizar producto
const actualizarProducto = async ( req = request, res = response ) => {
    const { id } = req.params;

    // Extraer datos que no se modificaran
    const { _id, usuario, estado, ...resto } = req.body;

    // Verificar si quiere cambiar el nombre
    if ( resto.nombre ) {
        // Validar si nombre de producto ya existe
        resto.nombre = resto.nombre.toUpperCase();

        const existeProducto = await Producto.findOne({ nombre: resto.nombre });
        if ( existeProducto && ( existeProducto._id != id ) ) {
            return res.status(400).json({
                msg: `El producto con nombre: ${resto.nombre}, ya existe, pruebe con otro nombre`
            })
        };
    }

    // VAlidar si quiere cambiar la categoria
    if (resto.categoria) {
        // Validar la existencia de la categoria
        resto.categoria = resto.categoria.toUpperCase();

        const existeCategoria = await Categoria.findOne({ nombre: resto.categoria });
        if ( !existeCategoria ) {
            return res.status(400).json({
                msg: `La categoria: ${resto.categoria}, no existe en DB`
            })
        }
        // Actualizar categoria
        resto.categoria = existeCategoria._id;
    }

    // Actualizar usuario
    resto.usuario = req.usuario._id;

    // Actualizar producto en DB
    const producto = await Producto.findByIdAndUpdate( id, resto, { new: true } );

    res.status(200).json( producto );
}

// Eliminar producto
const deleteProducto = async ( req = request, res = response ) => {
    const { id } = req.params;

    // Actualizar usuario que hizo el cambio
    const newUsuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate( id, { estado: false, usuario: newUsuario }, { new: true });

    res.status(200).json(producto)
}



module.exports = {
    obtenerProducto,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    deleteProducto
}