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
import { AlgoritmoConsensoP2pService } from '../LogicaP2P/algoritmo-consenso-p2p.service';
import { Bloque } from '../Modelo/Blockchain/bloque';
import { Transaccion } from '../Modelo/Blockchain/transaccion';

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
    public envioMensajesService:EnvioMensajesService,
    private consensoService: AlgoritmoConsensoP2pService
  ) {}

  setVoto(pVoto){
    this.voto = pVoto;
  }

  decrypt(data){
    return this.cifradoService.decrypt(data);
  }


  checkSing(voto, firma, firmaKey){
    return this.cifradoService.checkSing(voto, firma, firmaKey);
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
        this.consensoService.aprobarBloque(this.convertirBloques(mensaje.contenido));
        break;
      case environment.obtenerResultados:
        break;
      case environment.ofrecerBloque:
        console.log('Bloque propuesto recibido', mensaje.contenido);
        this.consensoService.validarBloque(this.convertirBloques(mensaje.contenido), peerId);
        break;
      case environment.syncBlockchain:
        // TO-DO: Llamar al servicio que actualice la blockchain
        break;
      case environment.responderPk:
        //Creo el voto con su incripcion
        let votoCifrado = this.cifradoService.encryptExternal(mensaje.contenido['pk'], this.voto);
        let firmaVoto = this.cifradoService.sign(votoCifrado);

        console.log("Firmado?: " + this.cifradoService.checkSing(votoCifrado, firmaVoto, this.cifradoService.getSignaturePublic()));

        let votoToServer = {
          voto: votoCifrado,
          firma: firmaVoto,
          firmaKey: this.cifradoService.getSignaturePublic(),
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

  convertirBloques(contenido: any): Array<Bloque>{
    let bloques = new Array<Bloque>();
    for (let bloque of contenido) {
      let b = new Bloque(bloque['hashBloqueAnterior'], this.convertirTransacciones(bloque['transacciones']));
      b.idVotacion = bloque['idVotacion'];
      bloques.push(b);
    }
    return bloques;
  }

  // Revisar por què no es el mismo hash de la tx
  convertirTransacciones(contenido: any): Array<Transaccion>{
    let transacciones = new Array<Transaccion>();
    for (const tx of contenido) {
      let mensaje: string[] = [];
      for (const msj of tx.mensaje) {
        mensaje.push(msj);
      }
      const transaccion = new Transaccion(
        tx.tipoTransaccion,
        tx.idVotacion,
        tx.hashIn,
        mensaje,
        tx.timestamp
      );
      transaccion.hash = tx.hash;
      transacciones.push(transaccion);
    }
    return transacciones;
  }
}
