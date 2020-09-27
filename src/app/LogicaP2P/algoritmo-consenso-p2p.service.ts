import { environment } from './../../environments/environment';
import { element } from 'protractor';
import { Injectable } from '@angular/core';
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
  validadoresActivos = null;
  validadores = null;
  miPosicion: number;
  step: number;
  inicio: number;
  duracion: number;
  transacciones: Array<Transaccion>;
  bloquesPropuestos: Array<Bloque>;
  blockchain: Blockchain;
  tiempoMin: number = 5000;
  votosBuffer = [];
  nombreUsuario: string = localStorage.getItem('nombre');

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
    console.log("IT'S ME MARIO IN THE PS4")
    console.log(this.validadoresActivos);

    console.log('Iniciando validacion del validador:', posicion);

    setTimeout(
      this.crearBloque,
      duracion * posicion,
      this
    );
  }

  // s = t/step.duration
  obtenerStep() {
    this.step = Math.floor((Date.now() - this.inicio) / this.duracion);
  }

  obtenerLider(): number {
    return this.step % this.validadoresActivos.length;
  }
  crearBloque(servicio : any
  ) {
    if (servicio.blockchain.transacciones.length > 0) {
      servicio.blockchain.ordenarTransacciones();
      let transacciones = servicio.blockchain.transacciones.filter(
        (element) => element.timestamp - Date.now() < servicio.tiempoMin
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
            transacciones.filter((transaccion) => {
              transaccion.idVotacion === idVotacion;
            })
          )
        );
        transacciones = transacciones.filter((transaccion) => {
          transaccion.idVotacion !== idVotacion;
        });
      }
      servicio.proponerBloque(bloques, servicio.validadoresActivos, servicio);
    }
    // TO-DO: Enviar msg con null
  }

  // usar servicio para enviar el bloque a los validadores
  proponerBloque(bloques: Array<Bloque>, validadoresActivos, servicio:any) {
    let mensaje = new Mensaje(environment.ofrecerBloque, bloques);
    servicio.validadores.forEach((validador) => {
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
    const mensaje = new Mensaje(environment.aprobarBloque, bloques);
    for (const validador of this.validadoresActivos) {
      enviarMensaje(mensaje, validador.peerId);
    }

  }

  validarLider(peerId): Boolean {
    this.obtenerStep();
    let lider = this.obtenerLider();
    console.log("holaaaaaaaaaaaaaaaaaaaaaaaaaa")
    console.log(lider);
    console.log(this.validadoresActivos);
    if (this.validadoresActivos[lider].peerId === peerId) {
      return true;
    }
    return false;
  }
}
