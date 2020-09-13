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
}
