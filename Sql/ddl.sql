/* *****************************************************
 * USUARIOS
 * *****************************************************/
-- TIPO USUARIO
CREATE TABLE Tipo (
    cod_tipo INT,
    descripcion VARCHAR2(15)
);
ALTER TABLE Tipo 
ADD CONSTRAINT PK_TIPO PRIMARY KEY (cod_tipo);

CREATE SEQUENCE SEQ_TIPO;
CREATE TRIGGER TRG_PKTIPO 
    BEFORE INSERT ON Tipo
    FOR EACH ROW 
BEGIN 
    SELECT SEQ_TIPO.NEXTVAL 
    INTO :new.cod_tipo
    FROM dual;
END;

-- TABLA USUARIO
CREATE TABLE Usuario (
    cod_usuario INT,
    nombre VARCHAR2(15),
    apellido VARCHAR2(15),
    username VARCHAR2(15), 
    pass VARCHAR2(15),
    email VARCHAR2(30),
    telefono INT,
    fotografia VARCHAR2(200),
    genero VARCHAR2(1),
    fecha_nacimiento TIMESTAMP,
    fecha_registro TIMESTAMP,
    estado VARCHAR2(1)
    cod_tipo INT
);
-- N NUEVO C CONFIRMADO A ANULADO
ALTER TABLE Usuario 
ADD CONSTRAINT PK_USUARIO PRIMARY KEY (cod_usuario);
ALTER TABLE Usuario 
ADD CONSTRAINT FK_USUARIO_TIPO FOREIGN KEY (cod_tipo) REFERENCES Tipo(cod_tipo);
ALTER TABLE Usuario 
MODIFY fecha_registro DEFAULT CURRENT_TIMESTAMP;

CREATE SEQUENCE SEQ_USUARIO;
CREATE TRIGGER TRG_PKUSUARIO 
    BEFORE INSERT ON Usuario
    FOR EACH ROW 
BEGIN 
    SELECT SEQ_USUARIO.NEXTVAL 
    INTO :new.cod_usuario
    FROM dual;
END;

/* *****************************************************
 * CHAT
 * *****************************************************/
-- TABLA CHAT
CREATE TABLE Chat (
    cod_chat INT,
    cod_cliente INT,
    fecha TIMESTAMP
);
ALTER TABLE Chat 
ADD CONSTRAINT PK_CHAT PRIMARY KEY (cod_chat);
ALTER TABLE Chat 
ADD CONSTRAINT FK_CHAT_USUARIO FOREIGN KEY (cod_cliente) REFERENCES Usuario(cod_usuario);

CREATE SEQUENCE SEQ_CHAT;
CREATE TRIGGER TRG_PKCHAT
    BEFORE INSERT ON Chat
    FOR EACH ROW 
BEGIN 
    SELECT SEQ_CHAT.NEXTVAL 
    INTO :new.cod_chat
    FROM dual;
END;

-- TABLA DETALLECHAT
CREATE TABLE DetalleChat (
    cod_chat INT,
    cod_root INT, 
    log_chat VARCHAR2(200)
);
ALTER TABLE DetalleChat 
ADD CONSTRAINT PK_DETALLECHAT PRIMARY KEY (cod_chat, cod_root);
ALTER TABLE DetalleChat 
ADD CONSTRAINT FK_CHATUSUARIO FOREIGN KEY (cod_root) REFERENCES Usuario(cod_usuario);
ALTER TABLE DetalleChat 
ADD CONSTRAINT FK_DETALLECHATUSUARIO FOREIGN KEY (cod_chat) REFERENCES Chat(cod_chat);

/* *****************************************************
 * FILESYSTEM
 * *****************************************************/
--  TABLA DISCO
CREATE TABLE DiscoVirtual (
    cod_disco INT, 
    nombre VARCHAR2(30), 
    size_disco INT, 
    unit VARCHAR2(1) 
);
ALTER TABLE DiscoVirtual 
ADD CONSTRAINT PK_DISCO PRIMARY KEY (cod_disco);
ALTER TABLE DiscoVirtual 
MODIFY (
    size_disco DEFAULT 10, 
    unit DEFAULT 'm'
);

CREATE SEQUENCE SEQ_DISCO;
CREATE TRIGGER TRG_PKDISCO 
    BEFORE INSERT ON DiscoVirtual
    FOR EACH ROW 
BEGIN 
    SELECT SEQ_DISCO.NEXTVAL 
    INTO :new.cod_disco
    FROM dual;
END;

-- TABLA PARTICION
CREATE TABLE Particion (
    cod_particion INT, 
    cod_disco INT, 
    nombre VARCHAR2(30), 
    size_particion INT, 
    unit VARCHAR2(1) 
)
ALTER TABLE Particion 
ADD CONSTRAINT PK_PARTICION PRIMARY KEY (cod_particion);
ALTER TABLE Particion 
ADD CONSTRAINT FK_PARTITIONDISCO FOREIGN KEY (cod_disco) REFERENCES DiscoVirtual(cod_disco);
ALTER TABLE Particion 
MODIFY (
    size_particion DEFAULT 10, 
    unit DEFAULT 'm'
);

CREATE SEQUENCE SEQ_PARTICION;
CREATE TRIGGER TRG_PKTIPO 
    BEFORE INSERT ON Particion
    FOR EACH ROW 
BEGIN 
    SELECT SEQ_PARTICION.NEXTVAL 
    INTO :new.cod_particion
    FROM dual;
END;

-- TABLA CARPETA
CREATE TABLE Carpeta (
    cod_carpeta INT, 
    cod_particion INT, 
    cod_padre INT, 
    nombre VARCHAR2(15), 
    permiso INT 
);
ALTER TABLE Carpeta 
ADD CONSTRAINT PK_CARPETA PRIMARY KEY (cod_particion, cod_carpeta);
ALTER TABLE Carpeta 
ADD CONSTRAINT FK_PARTICIONCARPETA FOREIGN KEY (cod_particion) REFERENCES Particion(cod_particion);
ALTER TABLE Carpeta 
ADD CONSTRAINT FK_CARPETAPADRE FOREIGN KEY (cod_padre) REFERENCES Carpeta(cod_carpeta)
                ON DELETE CASCADE;

CREATE SEQUENCE SEQ_CARPETA;
CREATE TRIGGER TRG_PKCARPETA 
    BEFORE INSERT ON Carpeta
    FOR EACH ROW 
BEGIN 
    SELECT SEQ_CARPETA.NEXTVAL 
    INTO :new.cod_carpeta
    FROM dual;
END;

-- TABLA ARCHIVO
CREATE TABLE Archivo (
    cod_archivo INT, 
    cod_carpeta INT, 
    nombre VARCHAR2(15), 
    contenido VARCHAR2(800), 
    permios INT 
);
ALTER TABLE Archivo 
ADD CONSTRAINT PK_ARCHIVO PRIMARY KEY (cod_archivo);
ALTER TABLE Archivo 
ADD CONSTRAINT FK_ARCHIVOCARPETA FOREIGN KEY (cod_carpeta) REFERENCES Archivo(cod_archivo)
                ON DELETE CASCADE;

CREATE SEQUENCE SEQ_ARCHIVO;
CREATE TRIGGER TRG_PKARCHIVO 
    BEFORE INSERT ON Archivo
    FOR EACH ROW 
BEGIN 
    SELECT SEQ_ARCHIVO.NEXTVAL 
    INTO :new.cod_archivo
    FROM dual;
END;

-- TABLA JOURNAL
CREATE TABLE Journal (
    cod_journal INT, 
    cod_particion INT, 
    operation INT, 
    string1 VARCHAR2(200), 
    string2 VARCHAR2(200), 
    string3 VARCHAR2(200), 
    date_writter TIMESTAMP,
    permission VARCHAR2(3), 
    owner_action VARCHAR2(15), 
    size_journal INT, 
    estado VARCHAR2(30) 
);
ALTER TABLE Journal 
ADD CONSTRAINT PK_JOURNAL PRIMARY KEY (cod_journal);
ALTER TABLE Journal 
ADD CONSTRAINT FK_JOURNALPARTICION FOREIGN KEY (cod_particion) REFERENCES Particion(cod_particion);

CREATE SEQUENCE SEQ_JOURNAL;
CREATE TRIGGER TRG_PKJOURNAL 
    BEFORE INSERT ON Journal
    FOR EACH ROW 
BEGIN 
    SELECT SEQ_JOURNAL.NEXTVAL 
    INTO :new.cod_journal
    FROM dual;
END;

-- TABLA DETALLE DISCO
CREATE TABLE DetalleDisco (
    cod_usuario INT, 
    cod_disco INT
);
ALTER TABLE DetalleDisco 
ADD CONSTRAINT PK_DETALLEDISCO PRIMARY KEY (cod_usuario, cod_disco);
ALTER TABLE DetalleDisco
ADD CONSTRAINT FK_DETALLEDISCO FOREIGN KEY (cod_disco) REFERENCES DiscoVirtual(cod_disco);
ALTER TABLE DetalleDisco 
ADD CONSTRAINT FK_DETALLEUSUARIO FOREIGN KEY (cod_usuario) REFERENCES Usuario(cod_usuario);

/* *****************************************************
 * LOG
 * *****************************************************/
-- TABLA LOG 
CREATE TABLE Bitacora (
    cod_usuario INT, 
    cod_journal INT 
);

-- TABLA INFORMACION
CREATE TABLE Info (
    nombre VARCHAR2(30), 
    eslogan VARCHAR2(100), 
    logo VARCHAR2(200), 
    video VARCHAR2(200), 
    mision VARCHAR2(300), 
    vision VARCHAR2(300), 
    about VARCHAR2(300) 
);