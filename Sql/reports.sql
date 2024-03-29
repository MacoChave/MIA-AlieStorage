-- LISTADO DE TODOS LOS USUARIO NACIDOS DE X AÑO EN ADELANTE
SELECT 
    COD_USUARIO ,
    NOMBRE ,
    APELLIDO ,
    USERNAME ,
    PASS ,
    EMAIL ,
    TELEFONO ,
    DIRECCION ,
    FOTOGRAFIA ,
    GENERO ,
    FECHA_NACIMIENTO ,
    FECHA_REGISTRO ,
    FECHA_VALIDACION ,
    ESTADO ,
    COD_TIPO  
FROM USUARIO
WHERE 
    EXTRACT(YEAR FROM (FECHA_NACIMIENTO)) > :año;
-- LISTADO DE CARPETAS Y ARCHIVOS EN FORMA DE ÁRBOL

-- LISTADO DE CLIENTES QUE HAN REALIZADO UNA MODIFICACION EN X CARPETA EN UN RANGO DE FECHAS DE Y HASTA Z
SELECT 
    U.COD_USUARIO, 
    U.USERNAME AS USUARIO, 
    DV.COD_DISCO, 
    DV.NOMBRE AS DISCO, 
    P.COD_PARTICION, 
    P.NOMBRE AS PARTICION, 
    J.STRING1 AS CARPETA, 
    J.DATE_WRITTER
FROM 
    USUARIO U, 
    DISCOVIRTUAL DV, 
    DETALLEDISCO DD, 
    PARTICION P, 
    JOURNAL J
WHERE 
    U.COD_USUARIO = DD.COD_USUARIO AND 
    DD.COD_DISCO = DV.COD_DISCO AND 
    DV.COD_DISCO = P.COD_DISCO AND 
    P.COD_PARTICION = J.COD_PARTICION AND 
    J.DATE_WRITTER > TIMESTAMP ':y' AND 
    J.DATE_WRITTER < TIMESTAMP ':z';

-- BITACORA DE CAMBIOS REALIZADOS
SELECT 
    U.COD_USUARIO, 
    U.USERNAME AS USUARIO, 
    DV.COD_DISCO, 
    DV.NOMBRE AS DISCO, 
    P.COD_PARTICION, 
    P.NOMBRE AS PARTICION, 
    J.STRING1 AS CARPETA, 
    J.DATE_WRITTER
FROM 
    USUARIO U, 
    DISCOVIRTUAL DV, 
    DETALLEDISCO DD, 
    PARTICION P, 
    JOURNAL J
WHERE 
    U.COD_USUARIO = DD.COD_USUARIO AND 
    DD.COD_DISCO = DV.COD_DISCO AND 
    DV.COD_DISCO = P.COD_DISCO AND 
    P.COD_PARTICION = J.COD_PARTICION;

-- LISTADO DE CLIENTES REGISTRADOS EN UNA FECHA Y 
-- EL NÚMERO DE CARPETAS Y ARCHIVOS A LOS CUALES TIENE ACCESO
SELECT 
    COD_USUARIO ,
    NOMBRE ,
    APELLIDO ,
    USERNAME ,
    PASS
    FECHA_NACIMIENTO ,
    FECHA_REGISTRO, 
    FECHA_VALIDACION
FROM 
    USUARIO 
WHERE 
    trunc(FECHA_REGISTRO) = '10/11/19';

SELECT 
    U.COD_USUARIO COD_USUARIO, 
    U.FECHA_REGISTRO FECHA_REGISTRO, 
    C.COD_DISCO COD_DISCO,
    P.COD_PARTICION COD_PARTICION,
    P.NOMBRE PARTICION, 
    COUNT(C.COD_CARPETA) CARPETAS
FROM 
    USUARIO U, 
    DETALLEDISCO DD, 
    DISCOVIRTUAL C, 
    PARTICION P, 
    CARPETA C
WHERE 
    U.COD_USUARIO = DD.COD_USUARIO AND 
    DD.COD_DISCO = C.COD_DISCO AND
    C.COD_DISCO = P.COD_DISCO AND
    P.COD_PARTICION = C.COD_PARTICION AND 
    TRUNC(U.FECHA_REGISTRO)  = '15/11/19' 
group by 
    U.COD_USUARIO, U.FECHA_REGISTRO, C.COD_DISCO, P.COD_PARTICION, P.NOMBRE;