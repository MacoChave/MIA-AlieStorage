-- CREAR USUARIO
CREATE OR REPLACE PROCEDURE SP_NEWUSER(
    nombre IN VARCHAR2, 
    apellido IN VARCHAR2, 
    username IN VARCHAR2, 
    pass IN VARCHAR2, 
    email IN VARCHAR2, 
    telefono IN NUMBER, 
    fotografia IN VARCHAR2, 
    genero IN VARCHAR2, 
    nacimiento IN TIMESTAMP, 
    direccion IN VARCHAR2, 
    tipo IN VARCHAR2, 
    out_result OUT NUMBER
) IS 
    codigo_tipo NUMBER;
    i NUMBER;
BEGIN 
    SELECT COD_TIPO INTO codigo_tipo 
    FROM TIPO 
    WHERE DESCRIPCION LIKE INITCAP(tipo);

    INSERT INTO USUARIO 
        (NOMBRE, APELLIDO, USERNAME, PASS, EMAIL, TELEFONO, FOTOGRAFIA, GENERO, FECHA_NACIMIENTO, DIRECCION, COD_TIPO) 
    VALUES 
        (nombre, apellido, username, pass, email, telefono, fotografia, genero, nacimiento, direccion, codigo_tipo);
    i := SQL%ROWCOUNT;
    
    out_result := i;
    DBMS_OUTPUT.PUT_LINE(out_result);
END;

-- ACTUALIZAR CONTRASEÑA
CREATE OR REPLACE PROCEDURE SP_SETTINGPASS (
    in_username IN VARCHAR2, 
    in_pass IN VARCHAR2, 
    in_genpass IN VARCHAR2, 
    out_result OUT NUMBER
) IS 
    creacion TIMESTAMP;
    actual TIMESTAMP;
    counting NUMBER;
    i NUMBER;
BEGIN 
    SELECT FECHA_VALIDACION 
    INTO creacion 
    FROM USUARIO 
    WHERE 
        USERNAME LIKE in_username AND 
        ROWNUM = 1;
    
    SELECT SYSTIMESTAMP INTO actual 
    FROM DUAL;

    SELECT COUNT(USERNAME) INTO counting 
    FROM USUARIO 
    WHERE 
        USERNAME LIKE in_username AND 
        PASS LIKE in_genpass AND 
        ROWNUM = 1;
    
    IF (EXTRACT(MINUTE FROM actual) - EXTRACT(MINUTE FROM creacion) < 1) THEN 
        IF (counting > 0) THEN 
            UPDATE USUARIO 
            SET 
                pass = in_pass, 
                estado = 'C'
            WHERE username = in_username;
            i := SQL%ROWCOUNT;
            
            COMMIT;
            out_result := i;
        ELSE
            out_result := -1;
        END IF;
        DBMS_OUTPUT.PUT_LINE(out_result);
    ELSE 
        UPDATE USUARIO 
        SET 
            estado = 'A'
        WHERE username = in_username;
        out_result := 0;
        DBMS_OUTPUT.PUT_LINE(out_result);
    END IF;
EXCEPTION 
    WHEN NO_DATA_FOUND THEN
          out_result := -2;
          DBMS_OUTPUT.PUT_LINE(out_result);
END;

-- MODIFICAR USUARIO 
CREATE OR REPLACE PROCEDURE SP_UPDATEUSER(
    codigo IN NUMBER, 
    nombre IN VARCHAR2, 
    apellido IN VARCHAR2, 
    pass IN VARCHAR2, 
    telefono IN NUMBER, 
    direccion IN VARCHAR2, 
    out_result OUT NUMBER 
) IS 
    i NUMBER;
BEGIN 
    UPDATE USUARIO 
    SET
        NOMBRE = nombre, 
        APELLIDO = apellido, 
        PASS = pass, 
        DIRECCION = direccion, 
        TELEFONO = telefono
    WHERE 
        cod_usuario = codigo;
    i := SQL%ROWCOUNT;

    out_result := i;
    DBMS_OUTPUT.PUT_LINE(out_result);
END;

-- MODIFICAR ROL
CREATE OR REPLACE PROCEDURE SP_UPDATEROL (
    codigo IN NUMBER, 
    tipo IN VARCHAR2, 
    out_result OUT NUMBER  
) IS 
    codigo_tipo NUMBER; 
    i NUMBER;
BEGIN 
    SELECT cod_tipo INTO codigo_tipo
    FROM TIPO 
    WHERE descripcion LIKE INITCAP(tipo);

    UPDATE USUARIO 
    SET cod_tipo = codigo_tipo 
    WHERE cod_usuario = codigo;

    i := SQL%ROWCOUNT;

    out_result := i;
    DBMS_OUTPUT.PUT_LINE(out_result);
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