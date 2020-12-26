import { environment } from '../../environments/environment'

const base_url = environment.base_url;

export class Usuario {
    constructor(
        public nombre: string,
        public email: string,
        public password?: string,
        public img?: string,
        public google?: boolean,
        public role?: string,
        public _id?: string
    ) {}

    get imagenUrl() {

        if (!this.img) {
            return `${base_url}/upload/usuarios/no-image`;
        }

        if( this.img.includes("https") ) {
            return this.img;
        }
        
        return `${base_url}/upload/usuarios/${this.img}`;
    }
}