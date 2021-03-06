import { OpcionService } from './../Servicios/Opcion/opcion.service';
import { BlockchainService } from './blockchain.service';
import { Blockchain } from './../Modelo/Blockchain/blockchain';
import { Injectable } from '@angular/core';
import { VotacionService } from '../Servicios/votacion.service';
import { Transaccion } from '../Modelo/Blockchain/transaccion';
import { Votacion } from '../Modelo/Votacion';
import { environment, envTipoTx } from 'src/environments/environment';
import { CrearVotacionP2PService } from './crear-votacion-p2-p.service';
import { AliasService } from '../Servicios/Alias/alias.service';

@Injectable({
  providedIn: 'root',
})
export class VotarP2PService {
  blockchain: Blockchain;

  constructor(
    private votacionService: VotacionService,
    private blockchainService: BlockchainService,
    private opcionService: OpcionService,
    private crearVotacionP2PService: CrearVotacionP2PService,
    private aliasService: AliasService
  ) {
    this.blockchain = this.blockchainService.retornarBlockchain();
  }

  private actualizarVotaciones(transaccion: Transaccion) {
    transaccion.tipoTransaccion = envTipoTx.voto;
    const resultado =
    Array.from(this.blockchain.votaciones.values()).filter(v => (
      v.id === transaccion.idVotacion && v.opcionDeVotacion !== undefined && v.participantes !== undefined)
    );
    if (resultado.length === 0) {
      this.votacionService
        .getVotacion(transaccion.idVotacion)
        .subscribe((result) => {
          if (result !== undefined && result != null) {
            this.blockchain.votaciones.set(transaccion.idVotacion, result);
            this.actualizarOpciones(transaccion);
          }else{
            console.log('Error: votación no encontrada');
          }
        });
    } else {
      this.validarVoto(transaccion);
    }
  }

  actualizarOpciones(transaccion: Transaccion) {
    this.opcionService.getOpcion(transaccion.idVotacion).subscribe((result) => {
      if (result !== undefined && result != null){
        this.blockchain.votaciones.get(
          transaccion.idVotacion
        ).opcionDeVotacion = result;
        this.actualizarParticipantes(transaccion);
      }else{
        console.log('Error: opciones no encontradas');
      }
    });
  }

  actualizarParticipantes(transaccion: Transaccion) {
    this.votacionService.getParticipanteVotacion(transaccion.idVotacion).subscribe((result) => {
      if (result !== undefined && result != null){
        this.blockchain.votaciones.get(
          transaccion.idVotacion
        ).participantes = result;
        this.validarVoto(transaccion);
      }else{
        console.log('Error: no hay participantes');
      }
    });
  }

  async validarVoto(transaccion: Transaccion) {
    const votacion: Votacion = this.blockchain.votaciones.get(
      transaccion.idVotacion
    );
    const estatus = await this.aliasService.consultarAlias(transaccion);
    const aliasValido = estatus['status'];
    console.log('Resultado de consultar alias', aliasValido);
    if (
      new Date(votacion.fechaLimite).getTime() > new Date().getTime() &&
      new Date().getTime() > new Date(votacion.fechaInicio).getTime() &&
      aliasValido // TO-DO: validar votos en la blockchain
    ) {
      if (votacion.participantes.length > this.blockchain.contarVotos(+votacion.id, votacion.participantes.length)){
        this.validarFormatoVoto(transaccion, votacion);
      }else{
        alert('BASE DE DATOS CORRUPTA DETECTADA');
      }
    }
  }

  private validarFormatoVoto(transaccion: Transaccion, votacion: Votacion) {
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
      let txInicial = this.blockchain.buscarTxInicioVotacion(
        transaccion.idVotacion);
      if (txInicial == null || txInicial === undefined) {
        const timestamp = new Date(votacion.fechaInicio).getTime();
        transaccion.hashIn = this.crearVotacionP2PService.crearVotacion(votacion, timestamp, votacion.participantes.length);
      }else{
        transaccion.hashIn = txInicial.hash;
      }
      this.blockchain.transacciones.push(transaccion);
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
    if (transaccion.mensaje.length > votacion.votos) {
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
    console.log("Transacciones");
    console.log(this.blockchain.transacciones);
  }
}
