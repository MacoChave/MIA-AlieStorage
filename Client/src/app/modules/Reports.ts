export interface Modified {
    COD_USUARIO ?: number 
    USUARIO ?: string 
    COD_DISCO ?: number 
    DISCO ?: string 
    COD_PARTICION ?: number 
    PARTICION ?: string 
    CARPETA ?: string 
    DATE_WRITTER ?: string 
};

export interface FolderLog {
    COD_USUARIO ?: number 
    USERNAME ?: string
    FECHA_REGISTRO ?: string 
    COD_DISCO ?: number 
    COD_PARTICION ?: number 
    PARTICION ?: string 
    CARPETAS ?: number 
};