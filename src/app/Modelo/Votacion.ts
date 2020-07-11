import { Credencial } from './Credencial';
import { Usuario } from './Usuario';
import { Voto } from './Voto';
import { Opcion } from './Opcion';

export class Votacion{
    titulo: string;
    autor: string;
    id : Number;
    fechaLimite : Date;
    plantillaAsociada : String;
    tipoDeVotacion : Number;
    descripcion : String;
    votos : number;
    participantes : Usuario[];
    almacena : Voto[];
    opcionDeVotacion : Opcion[];
    accesosExtra : Credencial[];
}
