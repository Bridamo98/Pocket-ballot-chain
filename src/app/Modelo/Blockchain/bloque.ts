import { Transaccion } from './transaccion';
import { sha512 } from 'js-sha512';

export class Bloque {
  constructor(hashBloqueAnterior: string, transacciones: Transaccion[]) {
    this.hashBloqueAnterior = hashBloqueAnterior;
    this.transacciones = transacciones;
    this.hash = sha512
      .create()
      .update(this.transacciones + this.hashBloqueAnterior)
      .hex();
  }
  hashBloqueAnterior: string;
  hash: string;
  transacciones: Transaccion[];
  idVotacion: number = -1;
  // Retorna -1 si esta mal construido, si esta bien construido regresa el id de votacion.
  static estaBienConstruido(bloque: Bloque): number {
    if (bloque.transacciones.length === 0) {
      return -1;
    }
    const respuesta: number = bloque.transacciones[0].idVotacion;
    for (const transaccion of bloque.transacciones) {
      if (
        transaccion.idVotacion !== respuesta ||
        bloque.hash !== bloque.obtenerHash()
      ) {
        return -1;
      }
    }
    bloque.idVotacion = respuesta;
    return respuesta;
  }
  buscarTxInicioVotacion(idVotacion: number): Transaccion {
    for (const transaccion of this.transacciones) {
      if (transaccion.idVotacion === idVotacion && transaccion.tipoTransaccion === 0) {
        return transaccion;
      }
    }
    return null;
  }
  obtenerHash() {
    return sha512
      .create()
      .update(this.transacciones + this.hashBloqueAnterior)
      .hex();
  }

  validarIntegridad( subBlockchain: Map<string, Bloque>): boolean{
    if (this.hashBloqueAnterior === '' || this.hashBloqueAnterior === undefined){
      return true;
    }else{
      const bloqueAnterior: Bloque = subBlockchain.get(this.hashBloqueAnterior);
      if (bloqueAnterior != null || bloqueAnterior != undefined){
        return bloqueAnterior.validarIntegridad(subBlockchain);
      }
      return false;
    }
  }

}
