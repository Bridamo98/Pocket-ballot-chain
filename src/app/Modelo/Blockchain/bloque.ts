import { Transaccion } from './transaccion';

export class Bloque {
  hashBloqueAnterior: string;
  hash:string;
  transacciones: Transaccion[];
}
