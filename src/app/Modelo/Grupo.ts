import { Usuario } from './Usuario';
import { Votacion } from './Votacion';

export class Grupo{
    descripcion : String;
    creacion : Date;
    id : String;
    nombre : String;
    creador : Usuario;
    miembros : Usuario[];
    pendientes: Usuario[];
    historial : Votacion[];
}