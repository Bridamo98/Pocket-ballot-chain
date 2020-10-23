import { Validador } from './../Modelo/Validador';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { sha512 } from 'js-sha512';

import { BlockchainService } from './blockchain.service';

import { Bloque } from '../Modelo/Blockchain/bloque';
import { Transaccion } from '../Modelo/Blockchain/transaccion';
import { Blockchain } from '../Modelo/Blockchain/blockchain';
import { Mensaje } from '../Modelo/Blockchain/mensaje';
import { VotarService } from '../Servicios/votar.service';
import { ConverterToObjectService } from '../Utils/converter-to-object.service';

declare var enviarMensaje: any;

@Injectable({
  providedIn: 'root',
})
export class AlgoritmoConsensoP2pService {
  estatus = false; // valor de verdad de si es validador

  validadoresActivos = new Array<Validador>();
  validadores: Array<Validador> = null;
  miPosicion: number;
  step: number;
  inicio: number;
  duracion: number;
  transacciones: Array<Transaccion>;
  bloquesPropuestos: Array<Bloque>;
  blockchain: Blockchain;
  tiempoMin: number = 5000;
  probando = true;

  nuevosBloques = new Map<number, Array<string>>();

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
    this.estatus = true;
    this.validadoresActivos = validadoresActivos;
    this.validadores = validadores;
    this.miPosicion = posicion;
    this.inicio = inicio;
    this.duracion = duracion;
    this.blockchain = this.blockchainService.retornarBlockchain();

    // Almacenar estado de recibimiento de la blockchain
    // Comentario para el push

    console.log('Esperando el inicio del validador en la posición', this.miPosicion);
    console.log('Comenzando timer', Math.floor((this.inicio - Date.now()) / 1000));
    console.log('Blockchain al iniciar', this.blockchain);

    // TO-DO: Validar tiempo
    setTimeout(this.crearBloque, (duracion * posicion) + (this.inicio - Date.now()), this);
    setTimeout(this.vaciarBuffer, duracion - 100 + (this.inicio - Date.now()), this, 0);
    setTimeout(this.finalizarEra, (duracion * (this.validadoresActivos.length )) + (this.inicio - Date.now()), this);
    // TO-DO: reiniciar los votos
  }

  cerrarValidador(): void{
    this.estatus = false;
  }

  finalizarEra(servicio: AlgoritmoConsensoP2pService) {
    console.log('Finalizando era luego de', Math.floor((Date.now() - servicio.inicio) / 1000));
    if (servicio.estatus){
      servicio.confirmarBlockchain(servicio);
      servicio.enviarUltimaBlockchain(servicio);
    }
    servicio.nuevosBloques = new Map<number, Array<string>>();
    servicio.estatus = false;
  }

  confirmarBlockchain(servicio: AlgoritmoConsensoP2pService) {
    servicio.votarService.confirmarBlockchain(servicio.blockchain.obtenerHashBlockchain());
  }

  vaciarBuffer(servicio: AlgoritmoConsensoP2pService, contador: number) {
    servicio.conteoVotos = new Map<string, number>();
    servicio.votosBuffer = new Map<string, Array<Bloque>>();
    servicio.bloqueRecibido = false;
    if (contador < servicio.validadoresActivos.length - 1) {
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
    if (!servicio.estatus){
      return;
    }
    console.log('Transacciones en la blockchain en crear:', servicio.blockchain.transacciones);
    console.log('Tiempo transcurrido:', Math.floor((Date.now() - servicio.inicio) / 1000));
    servicio.blockchain.eliminarTxInsertadas();
    if (servicio.blockchain.transacciones.length > 0) {
      servicio.blockchain.ordenarTransacciones();
      let transacciones = servicio.blockchain.transacciones.filter(
          (element) => true //Date.now() - element.timestamp > servicio.tiempoMin
      );
      let ulthash: string;
      let idVotacion: number;
      const bloques = new Array<Bloque>();
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
    servicio.bloqueRecibido = true;
    servicio.aprobarBloque2(bloques, 1);
    const mensaje = new Mensaje(environment.ofrecerBloque, bloques);
    servicio.enviarBloques(servicio, mensaje);
  }

  // TO-DO: Validar tiempo
  // TO-DO: Validar bloque
  // TO-DO: Enviar mensajes de aprobación o reporte
  validarBloque(bloques: Array<Bloque>, peerId) {
    if (!this.estatus){
      return;
    }
    this.bloquesPropuestos = bloques;
    this.validarLider(peerId);
    for (const bloque of this.bloquesPropuestos) {
      if (!this.blockchain.validadorBloque(bloque)) {
        this.votarService.reportarValidador(
          this.validadoresActivos.filter(v => v.peerId === peerId)[0].id);
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
    const lider = this.obtenerLider();
    if (this.validadoresActivos[lider].peerId === peerId) {
      return true;
    }
    return false;
  }

  aprobarBloque(bloques: Array<Bloque>): void {
    // NICE TO HAVE: Ver si los bloques corresponden al step
    // Bloques estan bien construidos, tienen los hash bien
    if (!this.estatus){
      return;
    }
    for (const bloque of bloques) {
      if (Bloque.estaBienConstruido(bloque) === -1) {
        return;
      }
    }
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
    //comprobar 60%
    if (this.bloqueRecibido) {
      this.calcularGanador();
    }
  }

  calcularGanador(): boolean {
    let hashGanador: string = null;
    const umbral: number = this.validadoresActivos.length * 0.6;

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
      this.actualizarNuevosBloques(bloque);
    }
    console.log('--------------GANADOR--------------');
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

  // Lógica de envío de blockchain

  actualizarNuevosBloques(bloque: Bloque) {
    let subBlockchain: Array<string> = [];
    if (this.nuevosBloques.has(bloque.idVotacion)){
      subBlockchain = this.nuevosBloques.get(bloque.idVotacion);
    }
    subBlockchain.push(bloque.hash);
    this.nuevosBloques.set(bloque.idVotacion, subBlockchain);
  }

  enviarUltimaBlockchain(servicio: AlgoritmoConsensoP2pService) {
    const hash: string = servicio.blockchain.obtenerHashBlockchain();
    const blockchain = new Map<number, Map<string, Bloque>>();
    const ultHash: Map<number, string> = servicio.blockchain.ultHash;

    let blockchainArray: Array<object> = [];

    if (servicio.nuevosBloques.size !== 0){
      const keys = Array.from( servicio.nuevosBloques.keys() ).sort();
      for (const i of keys) {
        const subBlockchain = new Map<string, Bloque>();
        for (const hBloque of servicio.nuevosBloques.get(i)) {
          const bloque = servicio.blockchain.obtenerBloque(i, hBloque);
          subBlockchain.set(bloque.hash, bloque);
        }
        blockchain.set(i, subBlockchain);
      }
      blockchainArray = ConverterToObjectService.convertirBlockchainToObject(blockchain);
    }

    const actualizacion = {
      hash: hash,
      ultHash: ConverterToObjectService.convertUltHashToObject(ultHash),
      blockchain: blockchainArray
    };

    console.log('La actualización que se envía es', actualizacion);
    const mensaje = new Mensaje(environment.syncBlockchain, actualizacion);
    servicio.enviarBlockchainAInactivos(servicio, mensaje);
  }

  enviarBlockchainAInactivos(servicio: AlgoritmoConsensoP2pService, mensaje: Mensaje) {
    const validadoresInactivos = new Array<Validador>();
    for (const validador of servicio.validadores) {
      if (servicio.validadoresActivos.filter(v => v.id === validador.id).length === 0){
        validadoresInactivos.push(validador);
      }
    }
    console.log('Notificando a los validadores inactivos', validadoresInactivos);
    for (let i = 0; i < validadoresInactivos.length; i++) {
      enviarMensaje(mensaje, validadoresInactivos[i].peerId);
    }
  }
}
