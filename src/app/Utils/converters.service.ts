import { Injectable } from '@angular/core';
import { Bloque } from '../Modelo/Blockchain/bloque';
import { Transaccion } from '../Modelo/Blockchain/transaccion';

@Injectable({
  providedIn: 'root'
})
export class ConvertersService {

  constructor() { }
  // Lógica de convertir
  static convertirBloques(contenido: any): Array<Bloque> {
    const bloques = new Array<Bloque>();
    for (const bloque of contenido) {
      const b = new Bloque(bloque['hashBloqueAnterior'], this.convertirTransacciones(bloque['transacciones']));
      b.idVotacion = bloque['idVotacion'];
      bloques.push(b);
    }
    return bloques;
  }

  // Revisar por qué no es el mismo hash de la tx
  static convertirTransacciones(contenido: any): Array<Transaccion> {
    const transacciones = new Array<Transaccion>();
    for (const tx of contenido) {
      const mensaje: string[] = [];
      for (const msj of tx.mensaje) {
        mensaje.push(msj);
      }
      const transaccion = new Transaccion(
        tx.tipoTransaccion,
        tx.idVotacion,
        tx.hashIn,
        mensaje,
        tx.timestamp
      );
      transaccion.hash = tx.hash;
      transacciones.push(transaccion);
    }
    return transacciones;
  }

  static convertirActualizacion(
    contenido: any,
    hash: string,
    blockchain: Map<number, Map<string, Bloque>>,
    ultHash: Map<number, string>,
  ) {
    hash = contenido['hash'];
    for (const i of contenido['ultHash']) {
      ultHash.set(i['idVotacion'], i['hash']);
    }

    for (const i of contenido['blockchain']) {
      const sBlockchain = new Map<string, Bloque>();
      for (const j of i['subBlockchain']) {
        const bloque = this.convertirBloque(j['bloque']);
        sBlockchain.set(j['hash'], bloque);
      }
      blockchain.set(i['idVotacion'], sBlockchain);
    }
  }

  static convertirBloque(contenido: any): Bloque {
    const bloque = new Bloque(contenido['hashBloqueAnterior'], this.convertirTransacciones(contenido['transacciones']));
    bloque.idVotacion = contenido['idVotacion'];
    return bloque;
  }
}
