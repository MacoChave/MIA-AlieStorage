-- CREAR USUARIO
CREATE OR REPLACE PROCEDURE SP_NEWUSER(
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
    codigo_tipo NUMBER;
    i NUMBER;
BEGIN 
    SELECT COD_TIPO INTO codigo_tipo 
    FROM TIPO 
    WHERE DESCRIPCION LIKE INITCAP(i_tipo);

    INSERT INTO USUARIO 
        (NOMBRE, APELLIDO, USERNAME, PASS, EMAIL, TELEFONO, FOTOGRAFIA, GENERO, FECHA_NACIMIENTO, DIRECCION, COD_TIPO) 
    VALUES 
        (i_nombre, i_apellido, i_username, i_pass, i_email, i_telefono, i_fotografia, i_genero, i_nacimiento, i_direccion, codigo_tipo);
    i := SQL%ROWCOUNT;
    
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