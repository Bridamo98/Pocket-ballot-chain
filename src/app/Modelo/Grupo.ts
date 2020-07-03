import { Usuario } from './Usuario';
import { Votacion } from './Votacion';

export class Grupo{
    id: number;
    nombre: string;
    descripcion : string;
    creacion : Date; 
    creador : string;
    miembros : Usuario[];
    pendientes: Usuario[];
    historial : Votacion[];
}

export class Relacion {
    idUsuario: string;
    idGrupo: number;
}

export class Respuesta {
    status: string;
    id: number;
}
