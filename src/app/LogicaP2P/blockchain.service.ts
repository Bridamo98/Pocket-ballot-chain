import { VotacionService } from './../Servicios/votacion.service';
import { Injectable } from '@angular/core';
import { Blockchain } from '../Modelo/Blockchain/blockchain';

@Injectable({
  providedIn: 'root',
})
export class BlockchainService {
  blockchain: Blockchain = new Blockchain();
  constructor(private votacionService: VotacionService) {}

  retornarBlockchain(): Blockchain{
    return this.blockchain;
  }

  ordenarTransacciones(): void {
    this.blockchain.ordenarTransacciones();
  }
}
