create or replace TRIGGER TRG_DELETEFOLDER
    AFTER DELETE ON CARPETA 
    FOR EACH ROW 
BEGIN 
    INSERT INTO JOURNAL
        (cod_particion, string1, permission, operation)
    VALUES 
        (:OLD.COD_PARTICION, :OLD.NOMBRE, :OLD.PERMISO, 3);
END;

create or replace TRIGGER TRG_NEWFOLDER
    AFTER INSERT ON CARPETA 
    FOR EACH ROW 
BEGIN 
    INSERT INTO JOURNAL
        (cod_particion, string1, permission, operation)
    VALUES 
        (:NEW.COD_PARTICION, :NEW.NOMBRE, :NEW.PERMISO, 1);
END;

create or replace TRIGGER TRG_NEWFS 
    AFTER INSERT ON PARTICION 
    FOR EACH ROW 
DECLARE 
    cod_carpeta NUMBER;
BEGIN 
    SP_NEWFOLDER(cod_carpeta, :NEW.COD_PARTICION, 0, '/', 777, 0);
END;

create or replace TRIGGER TRG_NOINODO 
    BEFORE INSERT ON CARPETA 
    FOR EACH ROW
BEGIN
    SELECT 
        MAX(NO_BLOQUE + 1) INTO :NEW.NO_BLOQUE
    FROM 
        CARPETA
    WHERE 
        COD_PARTICION = :NEW.COD_PARTICION
    ORDER BY 
        NO_BLOQUE DESC;
END;

create or replace TRIGGER TRG_UPDATEFOLDER
    AFTER UPDATE ON CARPETA 
    FOR EACH ROW 
BEGIN 
    INSERT INTO JOURNAL
        (cod_particion, string1, permission, operation)
    VALUES 
        (:NEW.COD_PARTICION, :NEW.NOMBRE, :NEW.PERMISO, 2);
END;