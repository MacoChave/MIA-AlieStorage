const { Router } = require('express');
const oracledb = require('oracledb');
const path = require('path');
const multer = require('multer');
const executor = require('../db/exec');
const fs = require('fs');

const router = new Router();


let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './res/sync')
    }, 
    filename: (req, file, callback) => {
        callback(null, req.params.filename + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

function flatten(disco, particion, content) {
    try {
        let no_inodo = content.no_inodo;
        let nombre = content.nombre;
        let padre = content.padre;
        let permiso = content.permiso;
        let tipo = content.tipo;
        let texto = '';

        let contenido = content.contenido;

        if (tipo == 0) {
            // TODO: SP_NEWFOLDER
            console.log(`SP_NEWFOLDER(cod_carpeta, ${particion}, ${padre}, ${nombre}, ${permiso}, ${no_inodo})`)
            executor.sp(
                `BEGIN
                    SP_NEWFOLDER(:cod_carpeta, :cod_particion, :inodo_padre, :nombre, :permiso, :no_inodo);
                END`, 
                {
                    cod_carpeta: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }, 
                    cod_particion: particion, 
                    inodo_padre: padre, 
                    nombre: nombre, 
                    permiso: permiso, 
                    no_inodo: no_inodo
                }
            )
            .then(folderResult => {                
                contenido.forEach(element => {
                    if (content.tipo == 0) {
                        flatten(disco, particion, element);
                    }
                    else 
                        texto += element;
                })
            })
        }

        if (tipo == 1)
        {
            contenido.forEach(element => {
                if (content.tipo == 0) {
                    flatten(disco, particion, element);
                }
                else 
                    texto += element;
            })
            // TODO: SP_NEWARCHIVO
            console.log(`SP_NEWFILE(cod_archivo, ${padre}, ${nombre}, ${texto}, ${permiso}, ${no_inodo})`)
            executor.sp(
                `BEGIN 
                    SP_NEWFILE(:cod_archivo, :cod_carpeta, :nombre, :contenido, :permiso, :bloque);
                END`,
                {
                    cod_archivo: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }, 
                    cod_carpeta: padre, 
                    nombre: nombre, 
                    contenido: texto, 
                    permiso: permiso, 
                    bloque: no_inodo
                }
            )
        }
    } catch (error) {
        return;
    }
}

router.post('/', (req, res) => {
    const { disco, particion, contenido,  usuarios} = req.body;

    const { nombre, pass } = usuarios[1];

    // TODO: SP_NEWUSER(user.nombre, user.pass)
    console.log(`SP_NEUSER_FS(${nombre}, ${pass})`)
    executor.sp(
        `BEGIN 
            sp_newuser_fs(:user, :pass);
        END`, 
        {
            user: nombre, 
            pass: pass
        }
    )
    .then(userResult => {
        // TODO: SP_NEWFS(codigo_disco, codigo_particion, path_disco, nombre_particion)
        console.log(`SP_NEWFS(out_disco, out_particion, ${disco}, ${particion})`)
        executor.sp(
            `BEGIN 
                SP_NEWFS(:cod_disco, :cod_part, :disco, :part);
            END`, 
            {
                cod_disco: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }, 
                cod_part: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }, 
                disco: disco, 
                part: particion
            }
        )
        .then(fsResult => {
            const cod_disco = fsResult.outBinds.cod_disco;
            const cod_part = fsResult.outBinds.cod_part;
            console.log({
                cod_disco: cod_disco, 
                cod_part: cod_part
            })
            contenido.forEach(element => {
                flatten(cod_disco, cod_part, element);
            });
        })
        .catch(fsErr => {
            res.json({
                MESSAGE: fsErr
            })
        })

        res.json({
            MESSAGE: 'Filesystem uploaded successfull'
        });
    })
    .catch(userErr => {
        res.json({
            MESSAGE: userErr
        })
    })
})

module.exports = router;