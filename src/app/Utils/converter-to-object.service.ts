import { ConvertersService } from './converters.service';
import { Bloque } from './../Modelo/Blockchain/bloque';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConverterToObjectService {
  constructor() {}

  static convertirBlockchainToObject(
    blockchain: Map<number, Map<string, Bloque>>
  ): Array<object> {
    const respuesta: Array<object> = new Array<object>();
    for (const key of blockchain.keys()) {
      const par = {
        idVotacion: key,
        subBlockchain: this.convertirArrayBloquesToObject(blockchain.get(key)),
      };
      respuesta.push(par);
    }
    return respuesta;
  }

  static convertirArrayBloquesToObject(
    subBlockchain: Map<string, Bloque>
  ): Array<object> {
    const respuesta: Array<object> = new Array<object>();
    for (const key of subBlockchain.keys()) {
      const par = {
        hash: key,
        bloque: subBlockchain.get(key),
      };
      respuesta.push(par);
    }
    return respuesta;
  }

  static convertUltHashToObject(ultHash: Map<number, string>): Array<object> {
    const respuesta: Array<object> = new Array<object>();
    for (const key of ultHash.keys()) {
      const par = {
        idVotacion: key,
        hash: ultHash.get(key),
      };
      respuesta.push(par);
    }
    return respuesta;
  }
}
