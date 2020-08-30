import { OpcionService } from './../Servicios/Opcion/opcion.service';
import { BlockchainService } from './blockchain.service';
import { Blockchain } from './../Modelo/Blockchain/blockchain';
import { Injectable } from '@angular/core';
import { VotacionService } from '../Servicios/votacion.service';
import { Transaccion } from '../Modelo/Blockchain/transaccion';
import { Votacion } from '../Modelo/Votacion';
import { environment } from 'src/environments/environment';
import { Opcion } from '../Modelo/Opcion';

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
            console.log("votacio: ");
            console.log(result);
            this.actualizarOpciones(transaccion);
          }
        });
    } else {
      this.validarVoto(transaccion);
    }
  }

  actualizarOpciones(transaccion: Transaccion) {
    this.opcionService
      .getOpcion(transaccion.idVotacion)
      .subscribe((result) => {
        this.blockchain.votaciones.get(transaccion.idVotacion).opcionDeVotacion = result;
        console.log("opciones:");
        console.log( this.blockchain.votaciones.get(transaccion.idVotacion).opcionDeVotacion);
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
    console.log('llego');
    switch (votacion.tipoDeVotacion.valueOf()) {
      case environment.ranking:
        break;
      case environment.popular:
        console.log(this.validarPopular(transaccion, votacion));
        break;
      case environment.clasificacion:
        break;
      default:
        break;
    }
  }

  validarPopular(transaccion: Transaccion, votacion: Votacion): boolean{
    let answer: boolean= true;
    transaccion.mensaje.forEach(element => {
      const votaciones = element.split(' ');
      if (votaciones[0] === 'Voto'){
        let isValid: boolean = false;
        votacion.opcionDeVotacion.forEach(element => {
          if (element.nombre.valueOf() === votaciones[1]){
            isValid = true;
          }
        });
        console.log(isValid);
        if (!isValid){
          answer = isValid;
        }
      }
      else{
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
