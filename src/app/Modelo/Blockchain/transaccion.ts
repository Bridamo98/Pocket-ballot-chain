import { sha512 } from 'js-sha512';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
export class Transaccion {
  hash: string;
  tipoTransaccion: number;
  idVotacion: number;
  hashIn: string;
  timestamp: number;
  mensaje: string[];



  constructor(tipoTransaccion: number, idVotacion: number, hashIn: string, mensaje: string[], timestamp: number){
    this.tipoTransaccion = tipoTransaccion;
    this.idVotacion = idVotacion;
    this.hashIn = hashIn;
    this.mensaje = mensaje;
    this.timestamp = timestamp;
    if (hashIn != null && hashIn !== undefined){
      this.hash = sha512.create().update(this.tipoTransaccion + this.idVotacion + this.hashIn + this.mensaje + this.timestamp).hex();
    }
  }

  static igual(transaccion1: Transaccion, transaccion2 : Transaccion): boolean{
    const keys1 = Object.keys(transaccion2);
    const keys2 = Object.keys(transaccion1);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (let key of keys1) {
      if (transaccion1[key] !== transaccion2[key] && key !== 'mensaje') {
        return false;
      }
    }
    return true;
  }

}
