export interface Content {
    NO_INODO ?: number;
    NOMBRE ?: string;
    PADRE ?: number; 
    PERMISO ?: number; 
    TIPO ?: number;
    TEXTO ?: string;
    CONTENIDO ?: Content[];
}