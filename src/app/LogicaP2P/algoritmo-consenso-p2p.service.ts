import { Validador } from './../Modelo/Validador';
import { environment } from './../../environments/environment';
import { element } from 'protractor';
import { Injectable } from '@angular/core';
import { sha512 } from 'js-sha512';

import { BlockchainService } from './blockchain.service';

import { Bloque } from '../Modelo/Blockchain/bloque';
import { Transaccion } from '../Modelo/Blockchain/transaccion';
import { Blockchain } from '../Modelo/Blockchain/blockchain';
import { Mensaje } from '../Modelo/Blockchain/mensaje';

declare var enviarMensaje: any;

@Injectable({
  providedIn: 'root',
})
export class AlgoritmoConsensoP2pService {
  validadoresActivos = new Array<Validador>();
  validadores = null;
  miPosicion: number;
  step: number;
  inicio: number;
  duracion: number;
  transacciones: Array<Transaccion>;
  bloquesPropuestos: Array<Bloque>;
  blockchain: Blockchain;
  tiempoMin: number = 5000;

  nombreUsuario: string = localStorage.getItem('nombre');

  //Contar votos
  conteoVotos = new Map<string, number>();
  votosBuffer = new Map<string, Array<Bloque>>();
  bloqueRecibido = false;

  constructor(private blockchainService: BlockchainService) {}

  inicializarValidador(
    validadoresActivos,
    validadores,
    posicion: number,
    inicio: number,
    duracion: number
  ) {
    this.validadoresActivos = validadoresActivos;
    this.validadores = validadores;
    this.miPosicion = posicion;
    this.inicio = inicio;
    this.duracion = duracion;
    this.blockchain = this.blockchainService.retornarBlockchain();
    //("IT'S ME MARIO IN THE PS4")
    //console.log(this.validadoresActivos);

    //console.log('Iniciando validacion del validador:', posicion);

    setTimeout(this.crearBloque, duracion * posicion, this);
    // TO-DO: reiniciar los votos
  }

  // s = t/step.duration
  obtenerStep() {
    this.step = Math.floor((Date.now() - this.inicio) / this.duracion);
  }

  obtenerLider(): number {
    return this.step % this.validadoresActivos.length;
  }
  crearBloque(servicio: AlgoritmoConsensoP2pService) {
    if (servicio.blockchain.transacciones.length > 0) {
      servicio.blockchain.ordenarTransacciones();
      let transacciones = servicio.blockchain.transacciones.filter(
        (element) => Date.now() - element.timestamp < servicio.tiempoMin
      );
      let ulthash: string;
      let idVotacion: number;
      let bloques = new Array<Bloque>();
      while (transacciones.length > 0) {
        idVotacion = transacciones[0].idVotacion;
        ulthash = servicio.blockchain.obtenerHashUltimoBloque(idVotacion);
        bloques.push(
          new Bloque(
            ulthash,
            transacciones.filter(
              (transaccion) => transaccion.idVotacion == idVotacion
            )
          )
        );
        transacciones = transacciones.filter(
          (transaccion) => transaccion.idVotacion !== idVotacion
        );
      }
      servicio.proponerBloque(bloques, servicio.validadoresActivos, servicio);
    }
    // TO-DO: Enviar msg con null
  }

  // usar servicio para enviar el bloque a los validadores
  proponerBloque(
    bloques: Array<Bloque>,
    validadoresActivos,
    servicio: AlgoritmoConsensoP2pService
  ) {
    servicio.aprobarBloque2(bloques, 1);
    servicio.bloqueRecibido = true;
    let mensaje = new Mensaje(environment.ofrecerBloque, bloques);
    servicio.validadoresActivos.forEach((validador) => {
      enviarMensaje(mensaje, validador.peerId);
    });
  }

  // TO-DO: Validar tiempo
  // TO-DO: Validar bloque
  // TO-DO: Enviar mensajes de aprobación o reporte
  validarBloque(bloques: Array<Bloque>, peerId) {
    this.bloquesPropuestos = bloques;
    this.validarLider(peerId);
    for (const bloque of this.bloquesPropuestos) {
      if (!this.blockchain.validadorBloque(bloque)) {
        return;
      }
    }
    this.bloqueRecibido = true;
    const mensaje = new Mensaje(environment.aprobarBloque, bloques);
    for (const validador of this.validadoresActivos) {
      enviarMensaje(mensaje, validador.peerId);
    }
    this.aprobarBloque2(this.bloquesPropuestos, 2);
  }

  validarLider(peerId): Boolean {
    this.obtenerStep();
    let lider = this.obtenerLider();
    //console.log("holaaaaaaaaaaaaaaaaaaaaaaaaaa")
    //console.log(lider);
    //console.log(this.validadoresActivos);
    if (this.validadoresActivos[lider].peerId === peerId) {
      return true;
    }
    return false;
  }

  aprobarBloque(bloques: Array<Bloque>): void {
    // NICE TO HAVE: Ver si los bloques corresponden al step
    // Bloques estan bien construidos, tienen los hash bien
    console.log('holaaaaaaaaaaaaaaaaaaaaaaaaa jej');
    for (let bloque of bloques) {
      if (Bloque.estaBienConstruido(bloque) === -1) {
        return;
      }
    }
    console.log('está bien construido');
    this.aprobarBloque2(bloques, 1);
  }
  aprobarBloque2(bloques: Array<Bloque>, votosIniciales: number): void {
    // Reorganizar bloques
    bloques = bloques.sort(this.compararIdVotacion);
    // Sacarle hash a todos los hashes en orden
    let hash: string = '';
    for (const bloque of bloques) {
      hash += bloque.hash;
    }
    hash = sha512.create().update(hash).hex();

    // Insertar voto
    this.votosBuffer.set(hash, bloques);
    if (this.conteoVotos.has(hash)) {
      this.conteoVotos.set(hash, this.conteoVotos.get(hash) + 1);
    } else {
      this.conteoVotos.set(hash, votosIniciales);
    }
    console.log('LAL');
    console.log(this.conteoVotos);
    //comprobar 60%
    if (this.bloqueRecibido) {
      this.calcularGanador();
    }
  }

  calcularGanador(): boolean {
    let hashGanador: string = null;
    const umbral: number = (this.validadoresActivos.length + 1) * 0.6;

    for (const hash of this.conteoVotos.keys()) {
      if (this.conteoVotos.get(hash) >= umbral) {
        hashGanador = hash;
      }
    }
    if (hashGanador == null) {
      return;
    }
    // if(60%) insertar bloques en la blockchain y eliminar transacciones de la cola.
    for (const bloque of this.votosBuffer.get(hashGanador)) {
      this.blockchain.insertarBloque(bloque, bloque.idVotacion);
      this.blockchain.eliminarTransacciones(bloque);
    }
    console.log('GANADOR');
    console.log(this.conteoVotos);
    console.log(this.votosBuffer);
    this.conteoVotos = new Map<string, number>();
    this.votosBuffer = new Map<string, Array<Bloque>>();
    this.bloqueRecibido = false;
  }

  compararIdVotacion(a: Bloque, b: Bloque) {
    let x = a.idVotacion;
    let y = b.idVotacion;
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    // a must be equal to b
    return 0;
  }
}
