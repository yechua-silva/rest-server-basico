const { request, response } = require("express");
const {Categoria, Usuario} = require("../models");

// Obtener categorias - paginado - total - populate
const obtenerCategorias = async ( req = request, res = response ) => {
    // Desestructurar el limite
    const { limit = 5, desde = 0 } = req.query;

    // Obtener el total 
    const query = { estado: true };
    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments( query ),
        Categoria.find( query )
            .skip( Number( desde ) )
            .limit( Number( limit) )
            .populate( 'usuario', 'nombre')
            .exec()
    ])

    res.status(200).json({
        total,
        categorias
    })
}

// Obtener categorias -  populate {}
const obtenerCategoriaPorId = async ( req = request, res = response ) => {
    const { id } = req.params;

    const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');

    res.json(categoria)
}


const crearCategoria = async (req = request, res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    // Verificar si la categoria existe
    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id // Se puede acceder en el req.usuario por que lo instancia y lo coloca en req en la validacion de JWT
    }

    // Crear instancia
    const categoria = new Categoria( data );

    // Guardar en DB
    await categoria.save();

    res.status(201).json(categoria);// 201 - Se creo correctamente
}


// Actualizar categoria - cambiar nombre
const categoriasPut = async ( req = request, res = response ) => {
    const { id } = req.params;
    // Extraer id, estado y usuario para que no se pueda modficar
    const {_id, usuario, estado, ...resto } = req.body;
    
    // Validar si nombre ya existe
    resto.nombre = resto.nombre.toUpperCase();

    const existeNombre = await Categoria.findOne({ nombre: resto.nombre }) 
    if ( existeNombre && ( existeNombre._id != id ) ) {
        return res.status(400).json({
            msg: `El nombre: ${resto.nombre}, ya existe, pruebe con otro`
        })
    }

    // Actualizar usuario
    resto.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id, resto, { new: true } ); // New: true, para que mande la data nueva

    res.status(200).json(categoria);
}


// Borrar categoria - estado: false
const categoriasDelete = async ( req = request, res = response ) => {
    const { id } = req.params;

    // Actualizar usuario que hizo el cambio
    const newUsuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false, usuario: newUsuario }, { new: true});

    res.status(200).json(categoria)
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorId,
    categoriasPut,
    categoriasDelete
}