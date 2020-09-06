import { Votacion } from './../Modelo/Votacion';
import { CrearVotacionP2PService } from './../LogicaP2P/crear-votacion-p2-p.service';
import { VotarP2PService } from './../LogicaP2P/votar-p2-p.service';
import { BlockchainService } from './../LogicaP2P/blockchain.service';
import { EnvioMensajesService } from './../LogicaP2P/envio-mensajes.service';
import { CifradoService } from './../Servicios/Cifrado-Firma/cifrado.service';
import { environment } from './../../environments/environment';
import { Mensaje } from './../Modelo/Blockchain/mensaje';
import { Injectable } from '@angular/core';
import { CifradoService } from '../Servicios/Cifrado-Firma/cifrado.service';

@Injectable({
  providedIn: 'root',
})
export class ManejadorMensajesService {
  constructor(
    private votarP2PService: VotarP2PService,
    private crearVotacionP2PService: CrearVotacionP2PService,
    public cifradoService:CifradoService,
    public envioMensajesService:EnvioMensajesService
  ) {}
  redirigirMensaje(mensaje: Mensaje,peerId:any) {
    switch (mensaje.tipoPeticion) {
      case environment.aprobarBloque:
        break;
      case environment.obtenerResultados:
        break;
      case environment.ofrecerBloque:
        break;
      case environment.syncBlockchain:
        break;

      case environment.votar:

        //Creo el voto con su incripcion

        //

        this.votarP2PService.votar(mensaje.contenido);
        //////////////////////////////////////////////////
        this.votarP2PService.imprimirTransacciones();
        /////////////////////////////////////////////////
        break;

      case environment.inicializarVotacion:
        this.crearVotacionP2PService.crearVotacion(mensaje.contenido);
        //////////////////////////////////////////////////
        this.votarP2PService.imprimirTransacciones();
        /////////////////////////////////////////////////
        break;
      case environment.obtenerPk:
        //generar pk
        let pk = this.cifradoService.getEncryptPublicKey();
        this.envioMensajesService.enviarPk(pk, peerId);
        break;

      default:
        break;
    }
  }
}
