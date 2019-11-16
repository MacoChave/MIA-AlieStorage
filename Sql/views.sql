CREATE VIEW VIEW_USUARIO AS 
SELECT 
    COD_USUARIO, NOMBRE, APELLIDO, USERNAME, PASS, EMAIL, 
    TELEFONO, DIRECCION, FOTOGRAFIA, GENERO, FECHA_NACIMIENTO, 
    FECHA_REGISTRO, FECHA_VALIDACION, ESTADO, DESCRIPCION AS TIPO
FROM 
    USUARIO U, TIPO T
WHERE 
    U.COD_TIPO = T.COD_TIPO;

CREATE OR REPLACE VIEW VIEW_CARPETA AS 
    SELECT 
        P.COD_PARTICION COD_PARTICION,
        P.COD_DISCO COD_DISCO, 
        C.COD_CARPETA COD_CARPETA,
        C.COD_PADRE COD_PADRE,
        C.NOMBRE NOMBRE,
        C.PERMISO PERMISO,
        C.NO_BLOQUE NO_BLOQUE,
        c.tipo, 
        c.contenido, 
        C.FECHA_CREACION FECHA_CREACION 
    FROM 
        CARPETA C,  
        PARTICION P 
    WHERE 
        c.cod_particion = p.cod_particion;

CREATE OR REPLACE VIEW VIEW_DISCO AS
SELECT 
    DD.COD_USUARIO,
    HD.COD_DISCO,
    HD.NOMBRE,
    HD.SIZE_DISCO, 
    HD.UNIT
FROM 
    detalledisco DD, 
    discovirtual HD, 
    usuario U 
WHERE 
    dd.cod_usuario = u.cod_usuario AND 
    dd.cod_disco = hd.cod_disco;
