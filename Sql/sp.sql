create or replace PROCEDURE SP_DELETEFOLDER(
    in_codigo IN NUMBER
) IS
BEGIN 
    DELETE CARPETA 
    WHERE 
        COD_CARPETA = in_codigo;

    COMMIT;

    DBMS_OUTPUT.PUT_LINE(1);
EXCEPTION WHEN OTHERS THEN 
    DBMS_OUTPUT.PUT_LINE(-2);
END;

create or replace PROCEDURE SP_MOVEFOLDER(
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
        DBMS_OUTPUT.PUT_LINE('SE SUPONE QUE SE MOVIÓ');
    ELSE 
        DBMS_OUTPUT.PUT_LINE('NO SE MOVIO NADA :(');
    END IF;
EXCEPTION WHEN OTHERS THEN
    DBMS_OUTPUT.PUT_LINE('HUBO UN ERROR :/');
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

create or replace PROCEDURE SP_NEWFILE2 (
    in_cod_carpeta OUT NUMBER, 
    in_cod_particion IN NUMBER, 
    in_cod_padre IN NUMBER, 
    in_nombre IN VARCHAR2, 
    in_contenido IN VARCHAR2, 
    in_permiso IN NUMBER, 
    in_bloque IN NUMBER
) IS 
BEGIN 
    INSERT INTO CARPETA 
        (cod_particion, cod_padre, nombre, contenido, permiso, tipo)
    VALUES 
        (in_cod_particion, in_cod_padre, in_nombre, in_contenido, in_permiso, 1);

    in_cod_carpeta := SEQ_CARPETA.CURRVAL;
END;

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

create or replace PROCEDURE SP_NEWFOLDER2 (
    in_cod_carpeta OUT NUMBER, 
    in_cod_particion IN NUMBER, 
    in_cod_padre IN NUMBER, 
    in_nombre IN VARCHAR2, 
    in_permiso IN NUMBER, 
    in_bloque IN NUMBER
) IS 
BEGIN 
    INSERT INTO CARPETA 
        (COD_PARTICION, COD_PADRE, NOMBRE, PERMISO, TIPO)
    VALUES 
        (in_cod_particion, in_cod_padre, in_nombre, in_permiso, 0);

    in_cod_carpeta := SEQ_CARPETA.CURRVAL;
END;

create or replace PROCEDURE SP_NEWFS(
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
    cod_disco NUMBER; 
    cod_particion NUMBER;
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
        
        sp_newfs(cod_disco, cod_particion, i_username, i_username);
        
        i := SQL%ROWCOUNT;
    END IF;

    i_out_result := i;
    DBMS_OUTPUT.PUT_LINE(i_out_result);
END;

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
        INSERT INTO USUARIO (USERNAME, PASS, cod_tipo) 
        VALUES (in_user, in_pass, 3);
    END IF;
END;

create or replace PROCEDURE SP_SETTINGPASS (
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

    IF (EXTRACT(MINUTE FROM actual) - EXTRACT(MINUTE FROM creacion) < 2) THEN 
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
            estado = 'A', 
            fecha_validacion = CURRENT_TIMESTAMP
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

create or replace PROCEDURE SP_UPDATECONTENTFILE(
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

create or replace PROCEDURE SP_UPDATENAMEFOLDER(
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

create or replace PROCEDURE SP_UPDATEROL (
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

create or replace PROCEDURE SP_UPDATEUSER(
    i_codigo IN NUMBER, 
    i_nombre IN VARCHAR2, 
    i_apellido IN VARCHAR2, 
    i_email IN VARCHAR2, 
    i_telefono IN NUMBER, 
    i_direccion IN VARCHAR2, 
    i_genero IN VARCHAR2, 
    i_nacimiento IN VARCHAR2, 
    i_out_result OUT NUMBER 
) IS 
    i NUMBER;
BEGIN 
    UPDATE USUARIO 
    SET
        NOMBRE = i_nombre, 
        APELLIDO = i_apellido, 
        EMAIL = i_email, 
        DIRECCION = i_direccion, 
        TELEFONO = i_telefono, 
        GENERO = i_genero, 
        FECHA_NACIMIENTO = i_nacimiento
    WHERE 
        cod_usuario = i_codigo;
    i := SQL%ROWCOUNT;

    i_out_result := i;
    DBMS_OUTPUT.PUT_LINE('USUARIO ACTUALIZADO');
END;

