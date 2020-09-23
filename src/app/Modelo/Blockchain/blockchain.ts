import { Bloque } from './bloque';
import { Transaccion } from './transaccion';
import { Votacion } from '../Votacion';

export class Blockchain {
  blockchain: Map<string, Bloque> = new Map();
  transacciones: Array<Transaccion> = new Array();
  votaciones: Map<number, Votacion> = new Map();
  ultHash: string;

  buscarTxInicioVotacion(idVotacion: number):Transaccion{
    this.blockchain.forEach(element => {
      let transaccion: Transaccion = element.buscarTxInicioVotacion(idVotacion);
      if(transaccion != null){
        return transaccion;
      }
    });
    return null;
  }

  insertarBloque(bloque: Bloque) {
    this.blockchain.set(bloque.hash, bloque);
    this.ultHash = bloque.hash;
  }

  ordenarTransacciones(): void {
    this.transacciones.sort(this.compararTimestamps);
  }

  compararTimestamps(a: Transaccion, b: Transaccion) {
    let x = a.timestamp;
    let y = b.timestamp;
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    // a must be equal to b
    return 0;
  }
}
