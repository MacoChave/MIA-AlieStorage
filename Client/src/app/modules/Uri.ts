export class Uri {
    static API_URI: string = 'http://192.168.1.11:3000/api';

    static INFO         : string = `${Uri.API_URI}/info`;
    static USUARIO      : string = `${Uri.API_URI}/usuario`;
    static DISCO        : string = `${Uri.API_URI}/disco`;
    static PARTICION    : string = `${Uri.API_URI}/particion`;
    static JOURNAL      : string = `${Uri.API_URI}/journal`;
    static CARPETA      : string = `${Uri.API_URI}/carpeta`;
    static ARCHIVO      : string = `${Uri.API_URI}/archivo`;
    static DETALLEDISCO : string = `${Uri.API_URI}/detalledisco`;
    static CHAT         : string = `${Uri.API_URI}/chat`;
    static DETALLECHAT  : string = `${Uri.API_URI}/detallechat`;
    static SYNC         : string = `${Uri.API_URI}/sync`;
}