import { Injectable } from '@angular/core';
import { BlockchainService } from './blockchain.service';
import { Bloque } from '../Modelo/Blockchain/bloque';
import { Transaccion } from '../Modelo/Blockchain/transaccion';

@Injectable({
  providedIn: 'root'
})
export class AlgoritmoConsensoP2pService {

  validadores: string[];
  miPosicion: number;
  step: number;
  inicio: number;
  duracion: number;
  transacciones: Array<Transaccion>;
  hBloquePropuesto: string;

  constructor(private blockchainService: BlockchainService) { }

  inicializarValidador(validadores: string[], posicion: number, inicio: number, duracion: number) {
    this.validadores = validadores;
    this.miPosicion = posicion;
    this.inicio = inicio;
    this.duracion = duracion;

    setTimeout(this.proponerBloque, duracion * posicion);
  }

  // s = t/step.duration
  verificarStep() {
    this.step = Date.now() - this.inicio / this.duracion;
  }

  verificarLider() {
    const lider = this.step % this.validadores.length;
  }

  crearBloque() {
    let blockchain = this.blockchainService.retornarBlockchain();
    this.transacciones = blockchain.transacciones;
    let bloque = new Bloque(blockchain.ultHash, this.transacciones);
    this.proponerBloque(bloque);
  }

  // usar servicio para enviar el bloque a los validadores
  proponerBloque(bloque: Bloque) {
/*     if(this.servicioEnviar(bloque)) {
      this.transacciones = new Array<Transaccion>();
    } */
  }

  validarBloque() {

  }
}
