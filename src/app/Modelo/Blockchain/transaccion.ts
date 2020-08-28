import { sha512 } from 'js-sha512';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
export class Transaccion {
  hash: string;
  tipoTransaccion: number;
  idVotacion: number;
  hashIn: string;
  mensaje: string[];
  message: string;

  constructor(tipoTransaccion: number, idVotacion: number, hashIn: string, mensaje: string[]){
    this.tipoTransaccion = tipoTransaccion;
    this.idVotacion = idVotacion;
    this.hashIn = hashIn;
    this.mensaje = mensaje;
    this.message = this.tipoTransaccion + this.idVotacion + this.hashIn + this.mensaje;
    console.log( 'mensaje:' + this.message);
    this.hash = sha512.create().update(this.message).hex();
  }
}
