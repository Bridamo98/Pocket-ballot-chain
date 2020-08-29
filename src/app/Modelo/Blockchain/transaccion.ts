import { sha512 } from 'js-sha512';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
export class Transaccion {
  hash: string;
  tipoTransaccion: number;
  idVotacion: number;
  hashIn: string;
  mensaje: string[];


  constructor(tipoTransaccion: number, idVotacion: number, hashIn: string, mensaje: string[]){
    this.tipoTransaccion = tipoTransaccion;
    this.idVotacion = idVotacion;
    this.hashIn = hashIn;
    this.mensaje = mensaje;
    this.hash = sha512.create().update(this.tipoTransaccion + this.idVotacion + this.hashIn + this.mensaje).hex();
  }
}
