import { OpcionService } from './../Servicios/Opcion/opcion.service';
import { BlockchainService } from './blockchain.service';
import { Blockchain } from './../Modelo/Blockchain/blockchain';
import { Injectable } from '@angular/core';
import { VotacionService } from '../Servicios/votacion.service';
import { Transaccion } from '../Modelo/Blockchain/transaccion';
import { Votacion } from '../Modelo/Votacion';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VotarP2PService {
  blockchain: Blockchain;

  constructor(
    private votacionService: VotacionService,
    private blockchainService: BlockchainService,
    private opcionService: OpcionService
  ) {
    this.blockchain = this.blockchainService.retornarBlockchain();
  }

  private actualizarVotaciones(transaccion: Transaccion) {
    if (!this.blockchain.votaciones.has(transaccion.idVotacion)) {
      this.votacionService
        .getVotacion(transaccion.idVotacion)
        .subscribe((result) => {
          if (result !== undefined || result != null) {
            this.blockchain.votaciones.set(transaccion.idVotacion, result);
            this.actualizarOpciones(transaccion);
          }
        });
    } else {
      this.validarVoto(transaccion);
    }
  }

  actualizarOpciones(transaccion: Transaccion) {
    this.opcionService.getOpcion(transaccion.idVotacion).subscribe((result) => {
      this.blockchain.votaciones.get(
        transaccion.idVotacion
      ).opcionDeVotacion = result;
      console.log('opciones:');
      console.log(
        this.blockchain.votaciones.get(transaccion.idVotacion).opcionDeVotacion
      );
      this.validarVoto(transaccion);
    });
  }

  validarVoto(transaccion: Transaccion) {
    const votacion: Votacion = this.blockchain.votaciones.get(
      transaccion.idVotacion
    );
    if (
      new Date(votacion.fechaLimite).getTime() > new Date().getTime() &&
      votacion.votos > 0
    ) {
      this.validarFormatoVoto(transaccion, votacion);
    }
  }
  private validarFormatoVoto(transaccion: Transaccion, votacion: Votacion) {
    this.blockchain.transacciones.push(transaccion);
    let isValid: boolean;
    switch (votacion.tipoDeVotacion.valueOf()) {
      case environment.ranking:
        isValid = this.validarRanking(transaccion, votacion);
        break;
      case environment.popular:
        isValid = this.validarPopular(transaccion, votacion);
        break;
      case environment.clasificacion:
        isValid = this.validarClasificacion(transaccion, votacion);
        break;
      default:
        isValid = false;
        break;
    }
    if (isValid) {
      transaccion.hashIn = this.blockchain.buscarTxInicioVotacion(
        transaccion.idVotacion
      ).hash;
      console.log(
        'ohai' + this.blockchain.buscarTxInicioVotacion(transaccion.idVotacion)
      );
      if (
        transaccion.hashIn !== null &&
        transaccion.hashIn !== undefined &&
        transaccion.hashIn !== ''
      ) {
        console.log(transaccion);
        this.blockchain.transacciones.push(transaccion);
      }
    }
  }

  validarRanking(transaccion: Transaccion, votacion: Votacion): boolean {
    let set = new Set<string>();
    let esCorrecto = true;
    votacion.opcionDeVotacion.forEach((element) => {
      set.add(element.nombre.valueOf().trim());
    });

    if (set.size !== transaccion.mensaje.length) {
      return false;
    }
    const tamanio = set.size;
    for (let index = 1; index <= tamanio; index++) {
      const voto = transaccion.mensaje[index - 1];
      const opcion = voto.substring(voto.indexOf(' ') + 1).trim();
      if (voto.split(' ')[0] === index.toString()) {
        if (set.has(opcion)) {
          set.delete(opcion);
        } else {
          esCorrecto = false;
        }
      } else {
        esCorrecto = false;
      }
    }
    return esCorrecto;
  }

  validarClasificacion(transaccion: Transaccion, votacion: Votacion): boolean {
    let set = new Set<string>();
    if (transaccion.mensaje.length < 0) {
      return false;
    }
    votacion.opcionDeVotacion.forEach((element) => {
      set.add(element.nombre.valueOf().trim());
    });
    for (const voto of transaccion.mensaje) {
      if (set.has(voto.trim())) {
        set.delete(voto.trim());
      } else {
        return false;
      }
    }
    return true;
  }

  validarPopular(transaccion: Transaccion, votacion: Votacion): boolean {
    let answer = true;
    if (transaccion.mensaje.length !== 1) {
      return false;
    }
    transaccion.mensaje.forEach((element) => {
      const votaciones = element.split(' ');
      const opcion = element.substring(element.indexOf(' ') + 1).trim();
      if (votaciones[0] === 'Voto') {
        let isValid = false;
        votacion.opcionDeVotacion.forEach((element) => {
          if (element.nombre.valueOf().trim() === opcion) {
            isValid = true;
          }
        });
        if (!isValid) {
          answer = isValid;
        }
      } else {
        answer = false;
      }
    });
    return answer;
  }

  votar(transaccion: Transaccion) {
    this.actualizarVotaciones(transaccion);
  }

  imprimirTransacciones() {
    console.log(this.blockchain.transacciones);
  }
}