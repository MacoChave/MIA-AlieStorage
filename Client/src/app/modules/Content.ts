export interface Folder {
    COD_CARPETA ?: number, 
    COD_PADRE ?: number, 
    NOMBRE ?: string, 
    PERMISO ?: number, 
    NO_BLOQUE ?: number, 
    FECHA_CREACION ?: string
}

export interface File {
    COD_ARCHIVO ?: number, 
    COD_CARPETA ?: number, 
    NOMBRE ?: string, 
    CONTENIDO ?: string, 
    PERMIOS ?: number, 
    NO_BLOQUE ?: number, 
    FECHA_CREACION ?: string
}