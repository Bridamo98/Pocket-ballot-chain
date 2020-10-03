import { Injectable } from '@angular/core';
import { sha512 } from 'js-sha512';
import { environment } from 'src/environments/environment';
import { Blockchain } from '../Modelo/Blockchain/blockchain';
import { Bloque } from '../Modelo/Blockchain/bloque';
import { Mensaje } from '../Modelo/Blockchain/mensaje';
import { Validador } from '../Modelo/Validador';
import { BlockchainService } from './blockchain.service';

declare var enviarMensaje: any;

@Injectable({
  providedIn: 'root'
})
export class SyncBlockchainP2pService {

  blockchain: Blockchain;
  validadoresActivos = new Array<Validador>();
  hashGanador: string = null;
  ultHashGanador: Map<number, string> = null;

  //Contar votos
  conteoVotos = new Map<string, number>();
  votosBuffer = new Map<string, Map<number, Map<string, Bloque>>>();

  constructor(
    private blockchainService: BlockchainService
  ) {
    this.blockchain = blockchainService.retornarBlockchain();
  }

  // TO-DO: BlockchainRecibida debe indicar si la blockchain fue modificada
  sincronizarBlockchain(
    hash: string,
    blockchain: Map<number, Map<string, Bloque>>,
    ultHash: Map<number, string>,
    peerId: string
  ) {
    if (this.hashGanador == null && this.comprobarValidador(peerId) && this.comprobarBlockchain(hash, blockchain, ultHash)) {
      // Insertar voto
      if (this.conteoVotos.has(hash)) {
        this.conteoVotos.set(hash, this.conteoVotos.get(hash) + 1);
      } else {
        this.conteoVotos.set(hash, 1);
      }
      this.votosBuffer.set(hash, blockchain);
      this.calcularGanador();
      if (this.hashGanador != null){
        this.actualizarBlockchain();
      }
    }
  }

  // TO-DO: Comprobar que el peerId de quien recibe la blockchain es de un validador activo
  comprobarValidador(peerId: string): boolean{
    return true;
  }

  actualizarBlockchain() {
    let blockchain: Map<number, Map<string, Bloque>> = this.votosBuffer.get(this.hashGanador);
    this.blockchain.actualizarBlockchain(blockchain);
  }

  calcularGanador() {
    const umbral: number = (this.validadoresActivos.length + 1) * 0.6;

    for (const hash of this.conteoVotos.keys()) {
      if (this.conteoVotos.get(hash) >= umbral) {
        this.hashGanador = hash;
        break;
      }
    }
  }

  comprobarBlockchain(
    hash: string,
    blockchain: Map<number, Map<string, Bloque>>,
    ultHash: Map<number, string>
  ): boolean {
    const keys = Array.from(blockchain.keys()).sort();
    let hashTmp = '';
    for (const i of keys) {
      let subBlockchain: Map<string, Bloque> = blockchain.get(i);
      let hashSubBCH = ultHash.get(i);
      if (this.comprobarUltHash(hashSubBCH, subBlockchain)) {
        hashTmp += hashSubBCH;
      } else {
        return false;
      }
    }
    hashTmp = sha512.create().update(hashTmp).hex();
    if (hashTmp === hash) {
      return true;
    }
    return false;
  }

  comprobarUltHash(hash: string, subBlockchain: Map<string, Bloque>): boolean {
    if (subBlockchain.has(hash)) {
      const keys = Array.from(subBlockchain.keys()).sort();
      for (const i of keys) {
        if (subBlockchain.get(i).hashBloqueAnterior === hash) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
}
