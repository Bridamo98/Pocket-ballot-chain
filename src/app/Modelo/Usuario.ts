import { Voto } from './Voto';


export class Usuario{
    nombre : String;
    saldo : Number;
    correo : String;
    idValidador : String;
    bloqAprobados : Number;
    bloqPropuestos : Number;
    bloqRevisados : Number;
    bloqValidados : Number;
    genera : Voto[];

    constructor(nombre: String, saldo: Number, correo : String, IdValidador : String){
        this.nombre = nombre;
        this.saldo = saldo;
        this.correo = correo;
        this.idValidador = IdValidador;
    }
}









