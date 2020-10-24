import { Injectable } from '@angular/core';
import { Blockchain } from '../Modelo/Blockchain/blockchain';

@Injectable({
  providedIn: 'root',
})
export class BlockchainService {
  estatus = false; // valor de verdad de si es validador
  blockchain: Blockchain = new Blockchain();
  constructor() {}

  retornarBlockchain(): Blockchain{
    return this.blockchain;
  }

  ordenarTransacciones(): void {
    this.blockchain.ordenarTransacciones();
  }

  resetearBlockchain(): void {
    this.blockchain.resetearBlockchain();
  }

  activarValidador(): void{
    this.estatus = true;
  }

  cerrarValidador(): void{
    this.estatus = false;
  }
}
