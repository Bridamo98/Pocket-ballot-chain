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
import { serialize } from 'v8';
import { VotarService } from '../Servicios/votar.service';
import { Router } from '@angular/router';

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

  constructor(
    private blockchainService: BlockchainService,
    private votarService: VotarService
    ) {}

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
    //console.log('Iniciando validacion del validador:', posicion);

    console.log('Esperando el inicio del validador en la posición', this.miPosicion);
    console.log('Comenzando timer', Math.floor((this.inicio - Date.now()) / 1000));
    // TO-DO: Validar tiempo
    setTimeout(this.crearBloque, (duracion * posicion) + (this.inicio - Date.now()), this);
    setTimeout(this.vaciarBuffer, duracion - 100, this, 0);
    setTimeout(this.confirmarBlockchain, (duracion * (this.validadoresActivos.length + 1)) + (this.inicio - Date.now()), this);
    // TO-DO: reiniciar los votos
  }

  confirmarBlockchain(servicio: AlgoritmoConsensoP2pService) {
    servicio.votarService.confirmarBlockchain(servicio.blockchain.obtenerHashBlockchain());
  }

  vaciarBuffer(servicio: AlgoritmoConsensoP2pService, contador: number) {
    servicio.conteoVotos = new Map<string, number>();
    servicio.votosBuffer = new Map<string, Array<Bloque>>();
    servicio.bloqueRecibido = false;
    if (contador < servicio.validadoresActivos.length) {
      setTimeout(servicio.vaciarBuffer, servicio.duracion, servicio, contador++);
    }
  }

  // s = t/step.duration
  obtenerStep() {
    this.step = Math.floor((Date.now() - this.inicio) / this.duracion);
  }

  obtenerLider(): number {
    return this.step % this.validadoresActivos.length;
  }
  crearBloque(servicio: AlgoritmoConsensoP2pService) {
    console.log('Transacciones en la blockchain en crear:', servicio.blockchain.transacciones);
    console.log('Tiempo transcurrido:', Math.floor((Date.now() - servicio.inicio) / 1000));
    if (servicio.blockchain.transacciones.length > 0) {
      servicio.blockchain.ordenarTransacciones();
      let transacciones = servicio.blockchain.transacciones.filter(
        (element) => Date.now() - element.timestamp > servicio.tiempoMin
      );
      let ulthash: string;
      let idVotacion: number;
      let bloques = new Array<Bloque>();
      while (transacciones.length > 0) {
        idVotacion = transacciones[0].idVotacion;
        ulthash = servicio.blockchain.obtenerHashUltimoBloque(idVotacion);
        const newBloque = new Bloque(
          ulthash,
          transacciones.filter(
            (transaccion) => transaccion.idVotacion == idVotacion
          )
        );
        if (Bloque.estaBienConstruido(newBloque) > -1) {
          bloques.push(newBloque);
          transacciones = transacciones.filter(
            (transaccion) => transaccion.idVotacion !== idVotacion
          );
        }
      }
      servicio.proponerBloque(bloques, servicio);
    }
    // TO-DO: Enviar msg con null
  }

  // usar servicio para enviar el bloque a los validadores
  proponerBloque(
    bloques: Array<Bloque>,
    servicio: AlgoritmoConsensoP2pService
  ) {
    servicio.aprobarBloque2(bloques, 1);
    servicio.bloqueRecibido = true;
    let mensaje = new Mensaje(environment.ofrecerBloque, bloques);
    console.log('Proponiendo bloques:', bloques);
    servicio.enviarBloques(servicio, mensaje);
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
    this.enviarBloques(this, mensaje);
    this.aprobarBloque2(this.bloquesPropuestos, 2);
  }

  enviarBloques(servicio: AlgoritmoConsensoP2pService, mensaje: Mensaje) {
    for (let i = 0; i < servicio.validadoresActivos.length; i++) {
      if (i !== servicio.miPosicion) {
        enviarMensaje(mensaje, servicio.validadoresActivos[i].peerId);
      }
    }
  }

  validarLider(peerId): boolean {
    this.obtenerStep();
    let lider = this.obtenerLider();
    if (this.validadoresActivos[lider].peerId === peerId) {
      return true;
    }
    return false;
  }

  aprobarBloque(bloques: Array<Bloque>): void {
    // NICE TO HAVE: Ver si los bloques corresponden al step
    // Bloques estan bien construidos, tienen los hash bien
    console.log('Aprobar bloques:', bloques);
    for (let bloque of bloques) {
      if (Bloque.estaBienConstruido(bloque) === -1) {
        return;
      }
    }
    console.log('Bloques bien construìdos');
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
    console.log('Aprobar bloques 2:', bloques);
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
    console.log('Blockchain:', this.blockchain.blockchain);
    console.log('Transacciones', this.blockchain.transacciones);
    this.conteoVotos = new Map<string, number>();
    this.votosBuffer = new Map<string, Array<Bloque>>();
    this.bloqueRecibido = false;
  }

  compararIdVotacion(a: Bloque, b: Bloque) {
    const x = a.idVotacion;
    const y = b.idVotacion;
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
