import { Bloque } from './bloque';
import { Transaccion } from './transaccion';
import { Votacion } from '../Votacion';

export class Blockchain {
  blockchain: Map<number, Map<string, Bloque>> = new Map();
  transacciones: Array<Transaccion> = new Array();
  votaciones: Map<number, Votacion> = new Map();
  ultHash: Map<number, string> = new Map();

  buscarTxInicioVotacion(idVotacion: number): Transaccion {
    const subBlockchain = this.blockchain.get(idVotacion);
    if (subBlockchain != null && subBlockchain !== undefined) {
      subBlockchain.forEach((element) => {
        const transaccion: Transaccion = element.buscarTxInicioVotacion(
          idVotacion
        );
        if (transaccion != null) {
          return transaccion;
        }
      });
    }
    return this.buscarTxInicioVotacionColaTxs(idVotacion);
  }

  buscarTxInicioVotacionColaTxs(idVotacion: number): Transaccion {
    const transaccion = this.transacciones.filter((transaccion) =>
      transaccion.idVotacion === idVotacion &&
        transaccion.tipoTransaccion === 0
    );
    if (transaccion.length > 0) {
      return transaccion[0];
    }
    return null;
  }

  insertarBloque(bloque: Bloque, idVotacion: number) {
    const subBlockchain = this.blockchain.get(idVotacion);
    if (subBlockchain == null || subBlockchain === undefined){
      this.inicializarVotacion(idVotacion);
    }
    subBlockchain.set(bloque.hash, bloque);
    this.ultHash.set(idVotacion, bloque.hash);
  }
  inicializarVotacion(idVotacion: number) {
    this.blockchain.set(idVotacion, new Map());
  }

  validadorBloque(bloque: Bloque): boolean {
    const transacciones = bloque.transacciones;

    for (const transaccionPendiente of transacciones) {

      const resultado = this.transacciones.filter((transaccionEnLista) => {
        return Transaccion.igual(transaccionPendiente, transaccionEnLista);
      }
      );
      if (resultado.length === 0) {
        return false;
      }
    }
    return true;
  }

  eliminarTransacciones(bloque:Bloque){
    for (const transaccion of bloque.transacciones) {
      this.transacciones = this.transacciones.filter( tx => transaccion.hash !== tx.hash );
    }
  }

  obtenerHashUltimoBloque(idVotacion) {
    return this.ultHash.get(idVotacion);
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
