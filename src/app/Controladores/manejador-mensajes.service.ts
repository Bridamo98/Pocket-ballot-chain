import { BlockchainService } from './../LogicaP2P/blockchain.service';
import { environment } from './../../environments/environment';
import { Mensaje } from './../Modelo/Blockchain/mensaje';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ManejadorMensajesService {

  constructor(private blockchainService: BlockchainService) { }
  redirigirMensaje(mensaje: Mensaje){
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
        //this.blockchainService.validarVoto(mensaje.contenido);
        break;

      default:
        break;
    }

  }
}
