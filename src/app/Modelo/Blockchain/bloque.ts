import { Transaccion } from './transaccion';
import { sha512 } from 'js-sha512';

export class Bloque {
  hashBloqueAnterior: string;
  hash: string;
  transacciones: Transaccion[];
  constructor(hashBloqueAnterior: string, transacciones: Transaccion[]) {
    this.hashBloqueAnterior = hashBloqueAnterior;
    this.transacciones = transacciones;
    this.hash = sha512.create().update(this.transacciones + this.hashBloqueAnterior).hex();
  }
}
