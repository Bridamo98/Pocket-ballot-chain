import { Votacion } from './../Modelo/Votacion';
import { CrearVotacionP2PService } from './../LogicaP2P/crear-votacion-p2-p.service';
import { VotarP2PService } from './../LogicaP2P/votar-p2-p.service';
import { BlockchainService } from './../LogicaP2P/blockchain.service';
import { VotarService } from './../Servicios/votar.service';
import { EnvioMensajesService } from './../LogicaP2P/envio-mensajes.service';
import { CifradoService } from './../Servicios/Cifrado-Firma/cifrado.service';
import { environment } from './../../environments/environment';
import { Mensaje } from './../Modelo/Blockchain/mensaje';
import { Injectable } from '@angular/core';
import { ListenerSocketsService } from './../LogicaP2P/listener-sockets.service';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

declare var peer_id;

@Injectable({
  providedIn: 'root',
})
export class ManejadorMensajesService{


  socket: any;
  //Atributos de un voto
  voto: any; //se encrypta
  firma: any; //se crea con el voto y sign
  peerValidador: any;
  encryptId: any; //Puede ser la misma pk

  constructor(
    private listenerSocket: ListenerSocketsService,
    private votarService: VotarService,
    private votarP2PService: VotarP2PService,
    private crearVotacionP2PService: CrearVotacionP2PService,
    public cifradoService:CifradoService,
    public envioMensajesService:EnvioMensajesService
  ) {}

  setVoto(pVoto){
    this.voto = pVoto;
  }

  decrypt(data){
    return this.cifradoService.decrypt(data);
  }

  checkSing(voto, firma){
    return this.cifradoService.checkSing(voto, firma);
  }

  redirigirMensaje(data: Mensaje,peerId:any) {

    let mensaje;
    if(typeof data == "string"){
      mensaje = JSON.parse(data);
    }
    else{
      mensaje = data;
    }

    switch (mensaje.tipoPeticion) {
      case environment.aprobarBloque:
        break;
      case environment.obtenerResultados:
        break;
      case environment.ofrecerBloque:
        break;
      case environment.syncBlockchain:
        break;
      case environment.responderPk:
        //Creo el voto con su incripcion
        let votoCifrado = this.cifradoService.encryptExternal(mensaje.contenido['pk'], this.voto);
        let firmaVoto = this.cifradoService.sign(votoCifrado);

        console.log("Firmado?: " + this.cifradoService.checkSing(votoCifrado, firmaVoto));

        let votoToServer = {
          voto: votoCifrado,
          firma: firmaVoto,
          peerValidador: mensaje.contenido['peerValidador'],
        };
          //let votoToServer;
          //console.log(this.votarService.enviarVoto(votoToServer));

          console.log("Emitiendo al servidor");
          this.listenerSocket.emit('voto', votoToServer);

        break;
      case environment.votar:


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
        let pkAndPeer = {
          pk: this.cifradoService.getEncryptPublicKey(),
          peerValidador: peer_id
        };

        //Sockets
        this.socket = io(environment.socketUrl);


        //Envio La PK
        let data = new Mensaje(environment.responderPk, pkAndPeer);
        this.envioMensajesService.enviarPk(JSON.stringify(data), peerId);

        break;

      default:
        break;
    }
  }
}
