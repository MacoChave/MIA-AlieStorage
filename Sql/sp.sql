-- CREAR USUARIO
create or replace PROCEDURE SP_NEWUSER(
    i_nombre IN VARCHAR2, 
    i_apellido IN VARCHAR2, 
    i_username IN VARCHAR2, 
    i_pass IN VARCHAR2, 
    i_email IN VARCHAR2, 
    i_telefono IN NUMBER, 
    i_fotografia IN VARCHAR2, 
    i_genero IN VARCHAR2, 
    i_nacimiento IN TIMESTAMP, 
    i_direccion IN VARCHAR2, 
    i_tipo IN VARCHAR2, 
    i_out_result OUT NUMBER
) IS 
    counting NUMBER;
    codigo_tipo NUMBER;
    i NUMBER := 0;
BEGIN 
    SELECT COD_TIPO INTO codigo_tipo 
    FROM TIPO 
    WHERE DESCRIPCION LIKE INITCAP(i_tipo);
    
    SELECT COUNT(cod_usuario) INTO counting
    FROM USUARIO 
    WHERE 
        USERNAME LIKE i_username;

    IF counting = 0 THEN 
        INSERT INTO USUARIO 
            (NOMBRE, APELLIDO, USERNAME, PASS, EMAIL, TELEFONO, FOTOGRAFIA, GENERO, FECHA_NACIMIENTO, DIRECCION, COD_TIPO) 
        VALUES 
            (i_nombre, i_apellido, i_username, i_pass, i_email, i_telefono, i_fotografia, i_genero, i_nacimiento, i_direccion, codigo_tipo);
        i := SQL%ROWCOUNT;
    END IF;

    i_out_result := i;
    DBMS_OUTPUT.PUT_LINE(i_out_result);
END;

-- ACTUALIZAR CONTRASEÑA
CREATE OR REPLACE PROCEDURE SP_SETTINGPASS (
    i_username IN VARCHAR2, 
    i_pass IN VARCHAR2, 
    i_genpass IN VARCHAR2, 
    i_out_result OUT NUMBER
) IS 
    creacion TIMESTAMP;
    actual TIMESTAMP;
    counting NUMBER;
    i NUMBER;
BEGIN 
    SELECT FECHA_VALIDACION INTO creacion 
    FROM USUARIO 
    WHERE 
        USERNAME LIKE i_username AND 
        PASS LIKE i_genpass AND 
        ROWNUM = 1;
    
    SELECT SYSTIMESTAMP INTO actual 
    FROM DUAL;

    IF (EXTRACT(MINUTE FROM actual) - EXTRACT(MINUTE FROM creacion) < 1) THEN 
        UPDATE USUARIO 
        SET 
            pass = i_pass, 
            estado = 'C'
        WHERE 
            username = i_username AND 
            pass = i_genpass;
        i := SQL%ROWCOUNT;
        
        COMMIT;
        i_out_result := i;
        DBMS_OUTPUT.PUT_LINE('CONTRASEÑA CONFIGURADA');
    ELSE 
        UPDATE USUARIO 
        SET 
            estado = 'A'
        WHERE 
            username = i_username AND 
            pass = i_genpass;
        i_out_result := -1;
        DBMS_OUTPUT.PUT_LINE('TIEMPO CADUCADO');
    END IF;
EXCEPTION 
    WHEN NO_DATA_FOUND THEN
          i_out_result := -2;
          DBMS_OUTPUT.PUT_LINE('SIN REGISTROS');
END;

-- MODIFICAR USUARIO 
CREATE OR REPLACE PROCEDURE SP_UPDATEUSER(
    i_codigo IN NUMBER, 
    i_nombre IN VARCHAR2, 
    i_apellido IN VARCHAR2, 
    i_pass IN VARCHAR2, 
    i_telefono IN NUMBER, 
    i_direccion IN VARCHAR2, 
    i_out_result OUT NUMBER 
) IS 
    i NUMBER;
BEGIN 
    UPDATE USUARIO 
    SET
        NOMBRE = i_nombre, 
        APELLIDO = i_apellido, 
        PASS = i_pass, 
        DIRECCION = i_direccion, 
        TELEFONO = i_telefono
    WHERE 
        cod_usuario = i_codigo;
    i := SQL%ROWCOUNT;

    i_out_result := i;
    DBMS_OUTPUT.PUT_LINE('USUARIO ACTUALIZADO');
END;

-- MODIFICAR ROL
CREATE OR REPLACE PROCEDURE SP_UPDATEROL (
    i_codigo IN NUMBER, 
    i_tipo IN VARCHAR2, 
    i_out_result OUT NUMBER  
) IS 
    codigo_tipo NUMBER; 
    i NUMBER;
BEGIN 
    SELECT cod_tipo INTO codigo_tipo
    FROM TIPO 
    WHERE descripcion LIKE INITCAP(i_tipo);

    UPDATE USUARIO 
    SET cod_tipo = codigo_tipo 
    WHERE cod_usuario = i_codigo;

    i := SQL%ROWCOUNT;

    i_out_result := i;
    DBMS_OUTPUT.PUT_LINE('ROL ACTUALIZADO');
END;

-- PRUEBAS
SET SERVEROUTPUT ON;
DECLARE 
    RES NUMBER;
BEGIN 
    SP_SETTINGPASS('MacoChave', 'kY9T80IA6_-0', 'C@nelito10', RES);
    DBMS_OUTPUT.PUT_LINE(RES);
END;

UPDATE USUARIO 
SET 
    PASS = 'kY9T80IA6_-0', 
    FECHA_VALIDACION = CURRENT_TIMESTAMP 
WHERE 
    USERNAME = 'MacoChave' AND 
    PASS = 'C@nelito10';

-- CREAR DISCO Y PARTICIONES
create or replace PROCEDURE SP_NEWUSER_FS(
    in_user IN VARCHAR2, 
    in_pass IN VARCHAR2
) IS
    counting NUMBER;
BEGIN 
    SELECT COUNT(COD_USUARIO) INTO counting
    FROM USUARIO 
    WHERE 
        USERNAME LIKE in_user;

    IF (counting = 0) THEN
        INSERT INTO USUARIO (USERNAME, PASS) 
        VALUES (in_user, in_pass);
    END IF;
END;

CREATE OR REPLACE PROCEDURE SP_NEWFS(
    codigo_disco OUT NUMBER, 
    codigo_particion OUT NUMBER, 
    path_disco IN VARCHAR2, 
    nombre_particion IN VARCHAR2
) IS 
    usuario NUMBER;
BEGIN 
    INSERT INTO discovirtual (NOMBRE, SIZE_DISCO, UNIT) 
    VALUES (path_disco, 10, 'M');
    
    codigo_disco := SEQ_DISCO.CURRVAL;
    
    INSERT INTO particion (COD_DISCO, NOMBRE, SIZE_PARTICION, UNIT) 
    VALUES (codigo_disco, nombre_particion, 10, 'M');
    
    codigo_particion := SEQ_PARTICION.CURRVAL;
    
    SELECT usuario.cod_usuario INTO usuario
    FROM usuario 
    WHERE ROWNUM = 1 
    ORDER BY cod_usuario DESC;
    
    INSERT INTO detalledisco 
    VALUES (usuario, codigo_disco);
END;

-- AGREGAR CARPETA Y ARCHIVO
create or replace PROCEDURE SP_NEWFOLDER (
    in_cod_carpeta OUT NUMBER, 
    in_cod_particion IN NUMBER, 
    in_cod_padre IN NUMBER, 
    in_nombre IN VARCHAR2, 
    in_permiso IN NUMBER, 
    in_bloque IN NUMBER
) IS 
    padre NUMBER;
BEGIN 
    IF in_bloque > 0 THEN
        SELECT COD_CARPETA INTO padre 
        FROM CARPETA 
        WHERE 
            NO_BLOQUE = in_cod_padre AND 
            COD_PARTICION = in_cod_particion AND 
            ROWNUM = 1;

        INSERT INTO CARPETA 
            (COD_PARTICION, COD_PADRE, NOMBRE, PERMISO, NO_BLOQUE, TIPO)
        VALUES 
            (in_cod_particion, padre, in_nombre, in_permiso, in_bloque, 0);
    ELSE 
        INSERT INTO CARPETA 
            (COD_PARTICION, NOMBRE, PERMISO, NO_BLOQUE, TIPO)
        VALUES 
            (in_cod_particion, in_nombre, in_permiso, in_bloque, 0);
    END IF;

    in_cod_carpeta := SEQ_CARPETA.CURRVAL;
END;

create or replace PROCEDURE SP_NEWFILE (
    in_cod_carpeta OUT NUMBER, 
    in_cod_particion IN NUMBER, 
    in_cod_padre IN NUMBER, 
    in_nombre IN VARCHAR2, 
    in_contenido IN VARCHAR2, 
    in_permiso IN NUMBER, 
    in_bloque IN NUMBER
) IS 
    padre NUMBER;
BEGIN 
    SELECT COD_CARPETA INTO padre 
    FROM CARPETA 
    WHERE 
        NO_BLOQUE = in_cod_padre AND 
        COD_PARTICION = in_cod_particion AND 
        ROWNUM = 1;

    INSERT INTO CARPETA 
        (cod_particion, cod_padre, nombre, contenido, permiso, no_bloque, tipo)
    VALUES 
        (in_cod_particion, padre, in_nombre, in_contenido, in_permiso, in_bloque, 1);

    in_cod_carpeta := SEQ_CARPETA.CURRVAL;
END;

CREATE OR REPLACE PROCEDURE SP_DELETEFOLDER(
    in_codigo IN NUMBER
) IS
    i NUMBER;
BEGIN 
    DELETE CARPETA 
    WHERE 
        COD_CARPETA = in_codigo;
    i := SQL%ROWCOUNT;
    COMMIT;

    DBMS_OUTPUT.PUT_LINE(i);
END;

CREATE OR REPLACE PROCEDURE SP_UPDATENAMEFOLDER(
    in_codigo IN NUMBER, 
    in_nombre IN VARCHAR2
) IS 
    i NUMBER;
BEGIN 
    UPDATE CARPETA SET 
        NOMBRE = in_nombre 
    WHERE 
        COD_CARPETA = in_codigo;
    i := SQL%ROWCOUNT;
    COMMIT;

    DBMS_OUTPUT.PUT_LINE(i);
END; 

CREATE OR REPLACE PROCEDURE SP_UPDATECONTENTFILE(
    in_codigo IN NUMBER, 
    in_contenido IN VARCHAR2
) IS 
    i NUMBER;
BEGIN 
    UPDATE CARPETA SET 
        CONTENIDO = in_contenido 
    WHERE 
        COD_CARPETA = in_codigo;
    i := SQL%ROWCOUNT;
    COMMIT;

    DBMS_OUTPUT.PUT_LINE(i);
END; 

CREATE OR REPLACE PROCEDURE SP_MOVEFOLDER(
    in_cod_carpeta IN NUMBER, 
    in_nombre IN VARCHAR2, 
    in_cod_padre IN NUMBER
) IS 
    counting NUMBER;
BEGIN 
    SELECT COD_CARPETA INTO counting 
    FROM CARPETA 
    WHERE NOMBRE LIKE in_nombre;
    
    IF counting = 0 THEN
        UPDATE CARPETA SET 
            COD_PADRE = in_cod_padre 
        WHERE 
            COD_CARPETA = in_cod_carpeta;
        
        DBMS_OUTPUT.PUT_LINE(SQL%ROWCOUNT);
    ELSE 
        DBMS_OUTPUT.PUT_LINE(0);
    END IF;
END;

CREATE OR REPLACE PROCEDURE SP_MOVEFOLDER(
    in_cod_carpeta IN NUMBER, 
    in_nombre IN VARCHAR2, 
    in_cod_padre IN NUMBER
) IS 
    counting NUMBER;
BEGIN 
    SELECT COUNT(COD_CARPETA) INTO counting 
    FROM CARPETA 
    WHERE 
        COD_PADRE = in_cod_padre AND 
        NOMBRE LIKE in_nombre;
    
    IF counting = 0 THEN
        UPDATE CARPETA SET 
            COD_PADRE = in_cod_padre 
        WHERE 
            COD_CARPETA = in_cod_carpeta;
        
        DBMS_OUTPUT.put_line(SQL%ROWCOUNT);
    ELSE 
        DBMS_OUTPUT.PUT_LINE(-1);
    END IF;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE(-2);
END;