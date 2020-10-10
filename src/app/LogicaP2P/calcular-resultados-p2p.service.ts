import { Transaccion } from './../Modelo/Blockchain/transaccion';
import { VotacionRanking } from './ResultadoVotacion/TipoVotacion/votacion-ranking';
import { VotacionClasificacion } from './ResultadoVotacion/TipoVotacion/votacion-clasificacion';
import { CalcularResultadoVotacion } from './ResultadoVotacion/calcular-resultado-votacion';
import { OpcionService } from './../Servicios/Opcion/opcion.service';
import { Votacion } from './../Modelo/Votacion';
import { Blockchain } from './../Modelo/Blockchain/blockchain';
import { BlockchainService } from './blockchain.service';
import { Injectable } from '@angular/core';
import { Bloque } from '../Modelo/Blockchain/bloque';
import { VotacionService } from '../Servicios/votacion.service';
import { environment, envTipoTx } from 'src/environments/environment';
import { Opcion } from '../Modelo/Opcion';
import { VotacionPopular } from './ResultadoVotacion/TipoVotacion/votacion-popular';

@Injectable({
  providedIn: 'root',
})
export class CalcularResultadosP2pService {
  subBlockchain: Map<string, Bloque>;
  blockchain: Blockchain;

  constructor(
    private blockchainService: BlockchainService,
    private votacionService: VotacionService,
    private opcionService: OpcionService
  ) {}
  async calcularResultado(idVotacion: number) {
    this.blockchain = this.blockchainService.retornarBlockchain();
    this.subBlockchain = this.blockchain.blockchain.get(idVotacion);
    const ultBloque = this.subBlockchain.get(
      this.blockchain.ultHash.get(idVotacion)
    );
    const cantTransacciones = ultBloque.transacciones.length;
    let votacion = this.blockchain.votaciones.get(idVotacion);

    // if votacion no existe localmente
    if (votacion == null || votacion === undefined) {
      votacion = await this.solicitarVotacion(idVotacion);
      votacion.opcionDeVotacion = await this.solicitarOpcion(idVotacion);
    } else {
      // if opcion no existe localmente
      if (
        votacion.opcionDeVotacion == null ||
        votacion.opcionDeVotacion === undefined
      ) {
        votacion.opcionDeVotacion = await this.solicitarOpcion(idVotacion);
      }
    }
    // if votación terminó
    if (votacion.fechaLimite.getTime() <= Date.now()) {
      let ultTransaccion = ultBloque.transacciones[cantTransacciones - 1];
      // if blockchain no está cerrada
      if (ultTransaccion.tipoTransaccion !== envTipoTx.resultado) {
        let calcularResultado: CalcularResultadoVotacion;
        // calcular votos
        switch (votacion.tipoDeVotacion) {
          case environment.popular:
            calcularResultado = new VotacionPopular();
            break;
          case environment.clasificacion:
            calcularResultado = new VotacionClasificacion();
            break;
          case environment.ranking:
            calcularResultado = new VotacionRanking();
            break;
          default:
            break;
        }
        this.blockchain.calcularResultado(idVotacion, calcularResultado);
        const mensaje: string[] = new Array<string>();
        mensaje.push(calcularResultado.calcularResultados());

        ultTransaccion = new Transaccion(
          envTipoTx.resultado,
          idVotacion,
          ultTransaccion.hash,
          mensaje,
          votacion.fechaLimite.getTime()
        );
        // cerrar blockchain
        this.blockchain.transacciones.push(ultTransaccion);
      }
      // TO-DO: enviar al servidor la transaccion de cierre
    }
  }

  solicitarVotacion(idVotacion: number): Promise<Votacion> {
    return new Promise<Votacion>((resolve) => {
      this.votacionService.getVotacion(idVotacion).subscribe((result) => {
        resolve(result);
      });
    });
  }
  solicitarOpcion(idVotacion: number): Promise<Opcion[]> {
    return new Promise<Opcion[]>((resolve) => {
      this.opcionService.getOpcion(idVotacion).subscribe((result) => {
        resolve(result);
      });
    });
  }
}
