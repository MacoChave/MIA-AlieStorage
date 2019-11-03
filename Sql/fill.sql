-- INSERT ON TIPO
INSERT ALL 
    INTO Tipo (descripcion) VALUES ('Administrador')
    INTO Tipo (descripcion) VALUES ('Root')
    INTO Tipo (descripcion) VALUES ('Cliente')
SELECT 1 FROM DUAL;
SELECT * FROM Tipo;

-- INSERT ON USUARIO
INSERT ALL 
    INTO Usuario (username, pass, cod_tipo) VALUES ('Admin', 'Admin', 1)
    INTO Usuario (username, pass, cod_tipo) VALUES ('Root', 'Root', 2)
SELECT 1 FROM DUAL;
SELECT username, pass, descripcion
FROM Usuario U, Tipo T
WHERE U.cod_tipo = T.cod_tipo;

INSERT INTO Info (
    nombre, 
    eslogan, 
    logo, 
    mision, 
    vision, 
    about
    )
VALUES (
    'Alie-Storage', 
    'Haz lo que quieras, hazlo con respaldo.', 
    'Logo.svg', 
    'Nuestra misión es diseñar una forma de trabajo más inteligente.', 
    'Reducir la cantidad de tiempo que la gente pasa gestionando sus archivos.', 
    'Alie-Storage te permite guardar tus archivos de forma segura y abrirlos o editarlos desde cualquier dispositivo.'
    );