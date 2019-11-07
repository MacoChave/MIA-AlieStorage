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
    tipo IN VARCHAR2
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

    dbms_output.put_line(i);
END;

-- ACTUALIZAR CONTRASEÑA
CREATE OR REPLACE PROCEDURE SP_UPDATEPASS (
    in_username IN VARCHAR2, 
    in_pass IN VARCHAR2
) IS 
    creacion TIMESTAMP;
    actual TIMESTAMP;
    i NUMBER;
BEGIN 
    SELECT FECHA_REGISTRO 
    INTO creacion 
    FROM USUARIO 
    WHERE USERNAME = in_username;
    
    SELECT SYSTIMESTAMP INTO actual 
    FROM DUAL;
    
    IF (EXTRACT(MINUTE FROM actual) - EXTRACT(MINUTE FROM creacion) < 1) THEN 
        UPDATE USUARIO 
        SET 
            pass = in_pass, 
            estado = 'C'
        WHERE username = in_username;
        i := SQL%ROWCOUNT;
        
        COMMIT;
        dbms_output.put_line(i);
    ELSE 
        UPDATE USUARIO 
        SET 
            estado = 'A'
        WHERE username = in_username;
        dbms_output.put_line(0);
    END IF;
END;

-- MODIFICAR USUARIO 
CREATE OR REPLACE PROCEDURE SP_UPDATEUSER(
    codigo IN NUMBER, 
    nombre IN VARCHAR2, 
    apellido IN VARCHAR2, 
    pass IN VARCHAR2, 
    telefono IN NUMBER, 
    direccion IN VARCHAR2 
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

    dbms_output.put_line(i);
END;

CREATE OR REPLACE PROCEDURE SP_UPDATEROL (
    codigo IN NUMBER, 
    tipo IN VARCHAR2 
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

    dbms_output.put_line(i);
END;