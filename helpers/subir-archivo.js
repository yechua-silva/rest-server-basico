const path = require('path');
const { v4: uuidv4 } = require('uuid');


const subirArchivo = ( files, extensionesValidas = [ 'png', 'jpg', 'jpeg', 'gif' ], carpeta = '' ) => {

    return new Promise((resolve, reject) => {

        const { archivo } = files;
        // Establecer el archivo
        const nombreCortado = archivo.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ]

        // Validar extension

        if ( !extensionesValidas.includes( extension )) {
            return reject(`Archivo con extension: ${extension}, no soportado. Pruebe con  extesiones: ${ extensionesValidas}`)
        }

        // Establecer nombre del archivo - para que no se repita
        const nombreTemp = uuidv4() + '.' + extension

        // Construccion del path, en donde se quiere colocar dicho archivo
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp ) // el __dirname apunta al controllers - por eso el ../uploads - y dps el nombre del archivo donde lo quiero subir, con el archivo, la variable de files, y el name que viene con expres-uploadfile. Cambie el nombre, por nombre temporal, para evitar nombres repetidos
        
        // Aca se toma el archivo que tiene la funcion mv, de mover y se le manda el path, en donde quiero colocar el archivo
        archivo.mv(uploadPath, function(err) {
            if (err) { // Por lo general de deberia de poner el log para ver el error en cosola pero expres-uploadfile, no dice que tipo de error, asi que por esta ocasion no va
                reject(err)
            }
        
            resolve( nombreTemp )
        });
    })
}


module.exports = {
    subirArchivo
}