import { Transaccion } from './transaccion';
import { sha512 } from 'js-sha512';

export class Bloque {
  hashBloqueAnterior: string;
  hash: string;
  transacciones: Transaccion[];
  idVotacion: number = -1;
  constructor(hashBloqueAnterior: string, transacciones: Transaccion[]) {
    this.hashBloqueAnterior = hashBloqueAnterior;
    this.transacciones = transacciones;
    this.hash = sha512
      .create()
      .update(this.transacciones + this.hashBloqueAnterior)
      .hex();
  }
  buscarTxInicioVotacion(idVotacion: number): Transaccion {
    this.transacciones.forEach((element) => {
      if (element.idVotacion === idVotacion && element.tipoTransaccion === 0) {
        return element;
      }
    });
    return null;
  }
  obtenerHash(){
    return sha512
      .create()
      .update(this.transacciones + this.hashBloqueAnterior)
      .hex();
  }
  // Retorna -1 si esta mal construido, si esta bien construido regresa el id de votacion.
  estaBienConstruido(): number{
    if (this.transacciones.length === 0){
      return -1;
    }
    const respuesta: number = this.transacciones[0].idVotacion;
    for (const transaccion of this.transacciones) {
      if (transaccion.idVotacion !== respuesta || this.hash !== this.obtenerHash())
      {
        return -1;
      }
    }
    this.idVotacion = respuesta;
    return respuesta;
  }
}
