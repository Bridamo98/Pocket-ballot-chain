import { Bloque } from './bloque';
import { Transaccion } from './transaccion';
import { Votacion } from '../Votacion';
import { stringify } from 'querystring';
import { sha512 } from 'js-sha512';
import { CalcularResultadoVotacion } from 'src/app/LogicaP2P/ResultadoVotacion/calcular-resultado-votacion';
import { envTipoTx } from '../../../environments/environment';

export class Blockchain {
  blockchain: Map<number, Map<string, Bloque>> = new Map();
  transacciones: Array<Transaccion> = new Array();
  votaciones: Map<number, Votacion> = new Map();
  ultHash: Map<number, string> = new Map();

  buscarTxInicioVotacion(idVotacion: number): Transaccion {
    const subBlockchain = this.blockchain.get(idVotacion);
    if (subBlockchain != null && subBlockchain !== undefined) {
      for (const element of subBlockchain.values()) {
        const transaccion: Transaccion = element.buscarTxInicioVotacion(
          idVotacion
        );
        if (transaccion != null) {
          return transaccion;
        }
      }
    }
    return this.buscarTxInicioVotacionColaTxs(idVotacion);
  }

  buscarTxInicioVotacionColaTxs(idVotacion: number): Transaccion {
    const transaccion = this.transacciones.filter(
      (transaccion) =>
        transaccion.idVotacion === idVotacion &&
        transaccion.tipoTransaccion === 0
    );
    if (transaccion.length > 0) {
      return transaccion[0];
    }
    return null;
  }

  insertarBloque(bloque: Bloque, idVotacion: number) {
    let subBlockchain = this.blockchain.get(idVotacion);
    if (subBlockchain == null || subBlockchain === undefined) {
      this.inicializarVotacion(idVotacion);
      subBlockchain = this.blockchain.get(idVotacion);
    }
    subBlockchain.set(bloque.hash, bloque);
    this.ultHash.set(idVotacion, bloque.hash);
  }

  inicializarVotacion(idVotacion: number) {
    this.blockchain.set(idVotacion, new Map());
  }

  validadorBloque(bloque: Bloque): boolean {
    const transacciones = bloque.transacciones;
    if (bloque.hashBloqueAnterior === undefined &&
      bloque.transacciones[0].tipoTransaccion !== envTipoTx.inicioVotacion){
      return false;
    }
    if (bloque.hashBloqueAnterior !== this.ultHash.get(bloque.transacciones[0].idVotacion)){
      return false;
    }

    for (const transaccionPendiente of transacciones) {
      const resultado = this.transacciones.filter((transaccionEnLista) => {
        return Transaccion.igual(transaccionPendiente, transaccionEnLista);
      });
      if (resultado.length === 0) {
        return false;
      }
    }
    return true;
  }

  eliminarTransacciones(bloque: Bloque) {
    for (const transaccion of bloque.transacciones) {
      this.transacciones = this.transacciones.filter(
        (tx) => transaccion.hash !== tx.hash
      );
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

  obtenerHashBlockchain(): string {
    const keys = Array.from(this.ultHash.keys()).sort();
    let hash = '';
    for (const i of keys) {
      hash += this.ultHash.get(i);
    }
    hash = sha512.create().update(hash).hex();
    return hash;
  }

  obtenerBloque(idVotacion: number, hashBloque: string): Bloque {
    return this.blockchain.get(idVotacion).get(hashBloque);
  }

  actualizarBlockchain(
    blockchain: Map<number, Map<string, Bloque>>,
    ultHashGanador: Map<number, string>
  ): boolean {
    for (const idVotacion of blockchain.keys()) {
      let subBlockchain = blockchain.get(idVotacion);
      for (const hash of subBlockchain.keys()) {
        let bloque = subBlockchain.get(hash);
        this.insertarBloque(bloque, idVotacion);
        this.eliminarTransacciones(bloque);
      }
    }
    this.ultHash = ultHashGanador;
    return this.validarIntegridad();
  }

  validarIntegridad(): boolean {
    for (const idVotacion of this.ultHash.keys()) {
      const subBlockchain: Map<string, Bloque> = this.blockchain.get(
        idVotacion
      );
      if (subBlockchain === undefined){
        return false;
      }
      const ultimoBloque: Bloque = subBlockchain.get(
        this.ultHash.get(idVotacion)
      );
      if (!ultimoBloque.validarIntegridad(subBlockchain)) {
        return false;
      } else {
        return true;
      }
    }
  }

  actualizarTransacciones(transaccionesNuevas: Array<Transaccion>) {
    for (const transaccionNueva of transaccionesNuevas) {
      const res = this.transacciones.filter(
        (transaccion) => transaccion.hash === transaccionNueva.hash
      );
      if (res.length === 0){
        this.transacciones.push(transaccionNueva);
      }
    }
    this.ordenarTransacciones();
  }

  resetearBlockchain(): void {
    this.blockchain = new Map();
    this.ultHash = new Map();
  }

  reiniciarTransacciones(): void{
    this.transacciones = new Array();
  }

  calcularResultado(idVotacion: number, calcularResultado: CalcularResultadoVotacion): void {
    const subBlockchain = this.blockchain.get(idVotacion);
    for (const bloque of subBlockchain.values()) {
      bloque.calcularResultado(idVotacion, calcularResultado);
    }
  }

  eliminarTxInsertadas(): void{
    for (const tx of this.transacciones) {
      let idVotacion = tx.idVotacion;
      let subBlockchain = this.blockchain.get(idVotacion);
      if (subBlockchain !== undefined){
        for (const bloque of subBlockchain.values()) {
          let longitud = bloque.transacciones.length - 1;
          if (tx.timestamp < bloque.transacciones[0].timestamp || tx.timestamp > bloque.transacciones[longitud].timestamp){
            continue;
          }
          let resultado = bloque.transacciones.filter(transaccion => transaccion.hash === tx.hash);
          if (resultado.length > 0){
            this.transacciones = this.transacciones.filter(transaccion => transaccion.hash !== tx.hash);
            break;
          }
        }
      }
    }
  }

  buscarResultadosEnTx(idVotacion: number): Array<Transaccion> {
    return this.transacciones.filter(tx => tx.idVotacion === idVotacion && tx.tipoTransaccion === envTipoTx.resultado);
  }

  contarVotos(idVotacion: number, longitudParticipantes): number{
    try {
    const bloques = Array.from(this.blockchain.get(idVotacion).values());
    let cantVotos = 0;
    for (const bloque of bloques) {
      const votosBloque = bloque.transacciones.filter( (transaccion) =>  transaccion.tipoTransaccion === envTipoTx.voto).length;
      cantVotos = cantVotos + votosBloque;
    }
    cantVotos = cantVotos + this.transacciones.filter((transaccion) =>  transaccion.tipoTransaccion === envTipoTx.voto).length;
    return cantVotos;
    } catch (error) {
      return 0;
    }
  }
}
