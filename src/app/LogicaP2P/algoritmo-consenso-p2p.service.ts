import { Injectable } from '@angular/core';
import { BlockchainService } from './blockchain.service';
import { Bloque } from '../Modelo/Blockchain/bloque';
import { Transaccion } from '../Modelo/Blockchain/transaccion';
import { Blockchain } from '../Modelo/Blockchain/blockchain';
import { Validador } from '../Modelo/Validador';
import { Mensaje } from '../Modelo/Blockchain/mensaje';
import { environment } from '../../environments/environment';

declare var enviarMensaje: any;

@Injectable({
  providedIn: 'root'
})
export class AlgoritmoConsensoP2pService {

  validadores;
  miPosicion: number;
  step: number;
  inicio: number;
  duracion: number;
  transacciones: Array<Transaccion>;
  bloquePropuesto: Bloque;
  blockchain: Blockchain;
  tiempoMin: number = 5000;

  constructor(private blockchainService: BlockchainService) { }

  inicializarValidador(validadores, posicion: number, inicio: number, duracion: number) {
    this.validadores = validadores;
    this.miPosicion = posicion;
    this.inicio = inicio;
    this.duracion = duracion;
    this.blockchain = this.blockchainService.retornarBlockchain();

    console.log("Iniciando validacion del validador:", posicion);

    setTimeout(this.crearBloque, duracion * posicion, this.blockchain, this.tiempoMin, this.proponerBloque, this.validadores);
  }

  // s = t/step.duration
  obtenerStep() {
    this.step = (Date.now() - this.inicio) / this.duracion;
  }

  obtenerLider(): number {
    return this.step % this.validadores.length;
  }

  crearBloque(blockchain: Blockchain, tiempoMin, proponerBloque, validadores) {
    if (blockchain.transacciones.length > 0){
      blockchain.ordenarTransacciones();
      let ulthash: string;
      if (blockchain.ultHash !== undefined){
        ulthash = blockchain.ultHash;
      }
      let transacciones = blockchain.transacciones.filter(element =>
        (element.timestamp - Date.now()) < tiempoMin);
      let bloque = new Bloque(ulthash, transacciones);
      proponerBloque(bloque, validadores);
    }
    //TO-DO: Enviar msg con null
  }

  // usar servicio para enviar el bloque a los validadores
  proponerBloque(bloque: Bloque, validadores) {
    let mensaje = new Mensaje(environment.ofrecerBloque, bloque);
    validadores.forEach(validador => {
      enviarMensaje(mensaje, validador.peerId);
    });
  }

  //TO-DO: Validar tiempo
  //TO-DO: Validar 60%
  //TO-DO: Enviar mensajes de aprobación o reporte
  validarBloque(bloque: Bloque, peerId) {
    this.bloquePropuesto = bloque;
    this.validarLider(peerId);
  }

  validarLider(peerId): Boolean{
    this.obtenerStep();
    let lider = this.obtenerLider();
    if(this.validadores[lider].peerId === peerId){
      return true;
    }
    return false;
  }
}
