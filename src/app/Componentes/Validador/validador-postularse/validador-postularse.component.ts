import { ManejadorMensajesService } from './../../../Controladores/manejador-mensajes.service';
import { Transaccion } from './../../../Modelo/Blockchain/transaccion';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Usuario } from 'src/app/Modelo/Usuario';
import { Votacion } from 'src/app/Modelo/Votacion';
import { Mensaje } from 'src/app/Modelo/Blockchain/mensaje';
import { environment } from 'src/environments/environment';
import { VotarService } from '../../../Servicios/votar.service';//Para probar envio de transacciones
import { ListenerSocketsService } from '../../../LogicaP2P/listener-sockets.service';
import { UsuarioService } from '../../../Servicios/usuario.service';

//peer handler
declare var inicializar: any;
//declare var establecerConexion: any;
declare var enviarMensaje: any;
declare var peer: any;
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


  #peer;
  otro_peer_id;
  msj;

  constructor(
    private listenerSocket: ListenerSocketsService,
    private usuarioService: UsuarioService,
    private router: Router,
    private rutaActiva: ActivatedRoute,
    private formBuilder: FormBuilder,
    private mensajeServicio: ManejadorMensajesService,
    private votarService: VotarService//Para probar envio de transacciones
  ) {  }

  ngOnInit(): void {
    console.log("First");
    setTimeout("Hello world!", 3000);
    inicializar();
    this.getUsuario();

    this.listenerSocket.listen('voto').subscribe((data) => {

      if(peer.id === data['peerValidador']){

        console.log("Mi peer id es: " + data['peerValidador']);
        console.log("Me llego esto: " + data);

        if(this.mensajeServicio.checkSing(data['voto'], data['firma'])){
          console.log('FIRMA CORRECTA');
        }
        else{
          console.log('FIRMA ERRADA');
        }
        console.log("Voto: " + data['voto']);
        console.log('Decript: ' + this.mensajeServicio.decrypt(data['voto']));
        //validar firma
      }
      
      //Se Debe validar si se gano el torneo antes de utilizar el voto
      //Se recomienda crear otro componente que sea el de validador y se muestre cuando se gana el torneo
    })

    votarServicio = this.votarService;
    mensajesServicio = this.mensajeServicio;
    let votacion: Votacion = new Votacion();
    votacion.id = 3;
    votacion.votos = 2;
    let mensaje: Mensaje = new Mensaje(environment.inicializarVotacion, votacion);
    this.mensajeServicio.redirigirMensaje(mensaje,"");

    let transaccion: Transaccion = new Transaccion(1, 3, null,["Diego", "Santiago"]);
    mensaje = new Mensaje(environment.votar, transaccion);
    this.mensajeServicio.redirigirMensaje(mensaje,"");
    console.log(this.transaccion);
  }

  serValidador(): void {
    console.log('serValidador');
    //Crear Peer


    //Esperar torneo


    //Si torneo actualizar a disponible
    this.votarService.activarValidador(peer.id).subscribe(
      result => {
        console.log(result);
      }
    );
    //Si torneo Escucha los votos
    

  }

  getUsuario(): void {
    this.usuarioService.getUsuario()
      .subscribe(
        result => {
          let usuarioResult = result;
          usuarioPeer = usuarioResult.nombre.toString();
        }
      );
  }

  enviarMensaje():void{
    enviarMensaje(this.msj, this.otro_peer_id);
  }
}
