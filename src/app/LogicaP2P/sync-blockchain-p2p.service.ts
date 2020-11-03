import { ConvertersService } from './../Utils/converters.service';
import { environment } from 'src/environments/environment';
import { Mensaje } from './../Modelo/Blockchain/mensaje';
import { ConverterToObjectService } from './../Utils/converter-to-object.service';
import { Injectable } from '@angular/core';
import { sha512 } from 'js-sha512';
import { Blockchain } from '../Modelo/Blockchain/blockchain';
import { Bloque } from '../Modelo/Blockchain/bloque';
import { Validador } from '../Modelo/Validador';
import { BlockchainService } from './blockchain.service';
import { Transaccion } from '../Modelo/Blockchain/transaccion';
import { VotarService } from '../Servicios/votar.service';

declare var enviarMensaje: any;

@Injectable({
  providedIn: 'root',
})
export class SyncBlockchainP2pService {
  blockchain: Blockchain;
  validadoresActivos = new Array<Validador>();
  inicioStep: number = -1;
  duracionStep: number = -1;

  hashGanador: string = null;
  ultHashGanador: Map<number, string> = null;

  //Contar votos
  peerIdHash = new Map<string, string>();
  conteoVotos = new Map<string, number>();
  votosBuffer = new Map<string, Map<number, Map<string, Bloque>>>();

  constructor(
    private blockchainService: BlockchainService,
    private votarService: VotarService
  ) {
    this.blockchain = blockchainService.retornarBlockchain();
  }

  prepararSync(
    validadoresActivos: Array<Validador>,
    inicioStep: number,
    duracionStep: number
  ) {
    this.validadoresActivos = validadoresActivos;
    this.inicioStep = inicioStep;
    this.duracionStep = duracionStep;
    console.log('Preparando la sincronizacion');
    console.log('Blockchain al iniciar', this.blockchain);
    // Planear final de sync
    this.vaciarBuffer();
  }

  obtenerStep() {
    return Math.floor((Date.now() - this.inicioStep) / this.duracionStep);
  }

  vaciarBuffer() {
    this.hashGanador = null;
    this.peerIdHash = new Map<string, string>();
    this.conteoVotos = new Map<string, number>();
    this.votosBuffer = new Map<string, Map<number, Map<string, Bloque>>>();
  }

  sincronizarBlockchain(
    hash: string,
    blockchain: Map<number, Map<string, Bloque>>,
    ultHash: Map<number, string>,
    peerId: string
  ) {
    console.log('Recibida actualización con hash', hash);
    if (
      this.hashGanador == null &&
      this.comprobarValidador(peerId) &&
      this.comprobarBlockchain(hash, blockchain, ultHash)
    ) {
      // Insertar voto
      if (this.conteoVotos.has(hash)) {
        this.conteoVotos.set(hash, this.conteoVotos.get(hash) + 1);
      } else {
        this.conteoVotos.set(hash, 1);
      }
      this.peerIdHash.set(hash, peerId);
      this.votosBuffer.set(hash, blockchain);
      this.calcularGanador(ultHash);

      if (this.hashGanador != null) {
        this.actualizarBlockchain();
      }
    }
  }

  // TO-DO: Comprobar que el peerId de quien recibe la blockchain es de un validador activo
  comprobarValidador(peerId: string): boolean {
    return true;
  }

  actualizarBlockchain() {
    let estaActualizada: boolean = false;
    const blockchain: Map<number, Map<string, Bloque>> = this.votosBuffer.get(
      this.hashGanador
    );
    if (blockchain !== undefined){
      if (blockchain.size !== 0){
        estaActualizada = this.blockchain.actualizarBlockchain(
          blockchain,
          this.ultHashGanador
        );
      }
    }
    if (estaActualizada) {
      // Notificar al servidor
      this.confirmarBlockchain();
      this.vaciarBuffer();
    } else {
      console.log('Solicitando blockchain');
      const mensaje: Mensaje = new Mensaje(environment.solicitarBCH, null);
      enviarMensaje(mensaje, this.peerIdHash.get(this.hashGanador));
    }
  }

  calcularGanador(ultHash: Map<number, string>) {
    const umbral: number = this.validadoresActivos.length * 0.6;

    for (const hash of this.conteoVotos.keys()) {
      if (this.conteoVotos.get(hash) >= umbral) {
        this.hashGanador = hash;
        this.ultHashGanador = ultHash;
        break;
      }
    }
  }

  comprobarBlockchain(
    hash: string,
    blockchain: Map<number, Map<string, Bloque>>,
    ultHash: Map<number, string>
  ): boolean {
    if (blockchain.size === 0 || blockchain === undefined || blockchain == null){
      return true;
    }
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

  enviarBlockChainCompleta(peerId) {
    const contenido = {
      ultHash: ConverterToObjectService.convertUltHashToObject(
        this.blockchain.ultHash
      ),
      blockchain: ConverterToObjectService.convertirBlockchainToObject(
        this.blockchain.blockchain
      ),
      transacciones: this.blockchain.transacciones,
    };
    const mensaje: Mensaje = new Mensaje(
      environment.syncCompleteBlockchain,
      contenido
    );
    enviarMensaje(mensaje, peerId);
  }

  syncBlockchainCompleta(contenido: any) {
    this.blockchainService.resetearBlockchain();
    ConvertersService.convertirActualizacion(
      contenido,
      '',
      this.blockchain.blockchain,
      this.blockchain.ultHash
    );
    this.blockchain.eliminarTxInsertadas();
    const transaccionesNuevas: Array<Transaccion> = ConvertersService.convertirTransacciones(contenido['transacciones']);
    this.blockchain.actualizarTransacciones(transaccionesNuevas);

    console.log('Blockchain luego de la sincronización completa', this.blockchain);

    //Notificar al servidor
    this.confirmarBlockchain();
    this.vaciarBuffer();
  }

  confirmarBlockchain() {
    this.votarService.confirmarBlockchain(this.blockchain.obtenerHashBlockchain());
  }
}
