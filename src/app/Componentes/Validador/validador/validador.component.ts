import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManejadorMensajesService } from 'src/app/Controladores/manejador-mensajes.service';
import { ListenerSocketsService } from 'src/app/LogicaP2P/listener-sockets.service';
import { environment } from '../../../../environments/environment';
import { Mensaje } from '../../../Modelo/Blockchain/mensaje';
import { Transaccion } from '../../../Modelo/Blockchain/transaccion';

// PeerHandler
declare var peer: any;

@Component({
  selector: 'app-validador',
  templateUrl: './validador.component.html',
  styleUrls: ['./validador.component.css']
})
export class ValidadorComponent implements OnInit {

  constructor(
    private listenerSocket: ListenerSocketsService,
    private mensajeServicio: ManejadorMensajesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.listenerSocket.listen('voto').subscribe((data) => {
      if(peer.id === data['peerValidador']){

        if(this.mensajeServicio.checkSing(data['voto'], data['firma'], data['firmaKey'])){
          console.log('FIRMA CORRECTA');
        }
        else{
          console.log('FIRMA ERRADA');
        }

        //let timestamp = data['timestamp'];
        let voto = this.mensajeServicio.decrypt(data['voto']);
        let mensaje = JSON.parse(voto.toString());
        if (mensaje.tipoPeticion === 7){
          mensaje.tipoPeticion = environment.votar;
          this.almacenarVoto(mensaje);
        }
        //validar firma
      }
    });
  }

  almacenarVoto(msj): void{
    const tx = msj.contenido;
    const transaccion = new Transaccion(
      tx.tipoTransaccion,
      tx.idVotacion,
      tx.hashIn,
      tx.mensaje,
      tx.timestamp
    );
    const mensaje = new Mensaje(msj.tipoPeticion, transaccion);
    this.mensajeServicio.redirigirMensaje(mensaje, null);
  }

}
