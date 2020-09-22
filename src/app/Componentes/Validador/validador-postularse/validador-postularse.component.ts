import { ManejadorMensajesService } from './../../../Controladores/manejador-mensajes.service';
import { Transaccion } from './../../../Modelo/Blockchain/transaccion';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/Modelo/Usuario';
import { Votacion } from 'src/app/Modelo/Votacion';
import { Mensaje } from 'src/app/Modelo/Blockchain/mensaje';
import { environment } from 'src/environments/environment';
import { VotarService } from '../../../Servicios/votar.service';//Para probar envio de transacciones
import { ListenerSocketsService } from '../../../LogicaP2P/listener-sockets.service';
import { UsuarioService } from '../../../Servicios/usuario.service';
import { AlgoritmoConsensoP2pService } from '../../../LogicaP2P/algoritmo-consenso-p2p.service';
import { Router } from '@angular/router';

//peer handler
declare var inicializar: any;
//declare var establecerConexion: any;
declare var enviarMensaje: any;
declare var mensajesServicio: any;
declare var votarServicio: any;
declare var usuarioPeer: any;


@Component({
  selector: 'app-validador-postularse',
  templateUrl: './validador-postularse.component.html',
  styleUrls: ['./validador-postularse.component.css']
})
export class ValidadorPostularseComponent implements OnInit {

  usuario: Usuario = new Usuario('', 0, '', '');
  transaccion: Transaccion = new Transaccion(3, 2 , 'init' , ['brandonn', 'diegonnn'] );

  otro_peer_id;
  msj;

  constructor(
    private listenerSocket: ListenerSocketsService,
    private usuarioService: UsuarioService,
    private mensajeServicio: ManejadorMensajesService,
    private votarService: VotarService,//Para probar envio de transacciones
    private consenso: AlgoritmoConsensoP2pService,
    private router: Router
  ) {
    votarServicio = this.votarService;
    mensajesServicio = this.mensajeServicio;
   }

  ngOnInit(): void {
    this.getUsuario();

/*     let votacion: Votacion = new Votacion();
    votacion.id = 3;
    votacion.votos = 2;
    let mensaje: Mensaje = new Mensaje(environment.inicializarVotacion, votacion);
    this.mensajeServicio.redirigirMensaje(mensaje,"");

    let transaccion: Transaccion = new Transaccion(1, 3, null,["Diego", "Santiago"]);
    mensaje = new Mensaje(environment.votar, transaccion);
    this.mensajeServicio.redirigirMensaje(mensaje,""); */
    //console.log(this.transaccion);
  }

  serValidador(): void {
    inicializar();
    this.listenerSocket.listen('torneo').subscribe((data: string) => {
      const respuesta = JSON.parse(data);
      const validadoresActivos = respuesta["validadoresActivos"];
      for (let i = 0; i < validadoresActivos.length; i++){
        if (validadoresActivos[i]["nombre"] === this.usuario.nombre){
          this.consenso.inicializarValidador(validadoresActivos, i, null, respuesta["tiempo"]);
          this.router.navigate(['Validador']);
          break;
        }
      }
    });
  }

  getUsuario(): void {
    this.usuarioService.getUsuario()
      .subscribe(
        result => {
          this.usuario = result;
          usuarioPeer = this.usuario.nombre.toString();
        }
      );
  }

  enviarMensaje(): void{
    enviarMensaje(this.msj, this.otro_peer_id);
  }
}
