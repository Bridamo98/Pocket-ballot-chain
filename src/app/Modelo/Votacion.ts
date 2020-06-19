import { Credencial } from './Credencial';
import { Usuario } from './Usuario';
import { Voto } from './Voto';
import { Opcion } from './Opcion';

export class Votacion{
    fechaLimite : Date;
    plantillaAsociada : String;
    tipoDeVotacion : String;
    participantes : Usuario[];
    almacena : Voto[];
    opcionDeVotacion : Opcion[];
    acesosExtra : Credencial[];
}