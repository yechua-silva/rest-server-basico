const { request, response } = require("express")


const validarArchivoSubir = ( req = request, res = response, next) => {
        // Verfica si viene algun archivo en la peticion 
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) {
        return res.status(400).json({
        msg:'No hay archivos en la peticion - archivo'
        });
    }
    next()    
}

module.exports = {
    validarArchivoSubir
}