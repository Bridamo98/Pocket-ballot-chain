import { Bloque } from './../Modelo/Blockchain/bloque';
import { Blockchain } from './../Modelo/Blockchain/blockchain';
import { BlockchainService } from './blockchain.service';
import { Injectable } from '@angular/core';
import { Votacion } from '../Modelo/Votacion';
import { Transaccion } from '../Modelo/Blockchain/transaccion';

@Injectable({
  providedIn: 'root',
})
export class CrearVotacionP2PService {
  blockchain: Blockchain;

  constructor(private blockchainService: BlockchainService) {
    this.blockchain = this.blockchainService.retornarBlockchain();
  }

  crearVotacion(votacion: Votacion, timestamp: number) {
    const transaccion: Transaccion = new Transaccion(
      0,
      votacion.id.valueOf(),
      '',
      [votacion.votos.toString()],
      timestamp
    );
    this.blockchain.transacciones.push(transaccion); //queda en el ultimo elemento de la lista
    this.blockchain.votaciones.set(votacion.id.valueOf(), votacion);
    return transaccion.hash;
  }
}
