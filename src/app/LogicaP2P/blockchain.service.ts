import { Transaccion } from './../Modelo/Blockchain/transaccion';
import { VotacionService } from './../Servicios/votacion.service';
import { Votacion } from './../Modelo/Votacion';
import { Bloque } from './../Modelo/Blockchain/bloque';
import { Injectable } from '@angular/core';
import { QueueScheduler } from 'rxjs/internal/scheduler/QueueScheduler';

@Injectable({
  providedIn: 'root',
})
export class BlockchainService {
  votaciones: Map<number, Votacion> = new Map();
  blockchain: Map<string, Bloque> = new Map();
  constructor(private votacionService: VotacionService) {}
  addBloque(bloque: Bloque) {
    this.blockchain.set(bloque.hash, bloque);
  }
  addTransaccion(transaccion: Transaccion) {}

  actualizarVotaciones(transaccion: Transaccion) {
    if (!this.votaciones.has(transaccion.idVotacion)) {
      this.votacionService
        .getVotacion(transaccion.idVotacion)
        .subscribe((result) => {
          if (result != undefined || result != null) {
            this.votaciones.set(transaccion.idVotacion, result);
            this.validarVoto(transaccion);
          }
        });
    } else {
      this.validarVoto(transaccion);
    }
  }
  validarVoto(transaccion: Transaccion){
    let votacion: Votacion = this.votaciones.get(transaccion.idVotacion);
    if (votacion.fechaLimite.getTime() > new Date().getTime()){

    }
  }
  validarResultados(transaccion: Transaccion) {}
}
