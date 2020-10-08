import { SyncBlockchainP2pService } from './../../../LogicaP2P/sync-blockchain-p2p.service';
import { ManejadorMensajesService } from './../../../Controladores/manejador-mensajes.service';
import { Transaccion } from './../../../Modelo/Blockchain/transaccion';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/Modelo/Usuario';
import { Votacion } from 'src/app/Modelo/Votacion';
import { Mensaje } from 'src/app/Modelo/Blockchain/mensaje';
import { environment } from 'src/environments/environment';
import { VotarService } from '../../../Servicios/votar.service'; //Para probar envio de transacciones
import { ListenerSocketsService } from '../../../LogicaP2P/listener-sockets.service';
import { UsuarioService } from '../../../Servicios/usuario.service';
import { AlgoritmoConsensoP2pService } from '../../../LogicaP2P/algoritmo-consenso-p2p.service';
import { Router } from '@angular/router';
import { Validador } from '../../../Modelo/Validador';

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
  styleUrls: ['./validador-postularse.component.css'],
})
export class ValidadorPostularseComponent implements OnInit {
  usuario: Usuario = new Usuario('', 0, '', '');

  otro_peer_id;
  msj;

  constructor(
    private listenerSocket: ListenerSocketsService,
    private usuarioService: UsuarioService,
    private mensajeServicio: ManejadorMensajesService,
    private votarService: VotarService, //Para probar envio de transacciones
    private consensoService: AlgoritmoConsensoP2pService,
    private syncBlockchainP2pService: SyncBlockchainP2pService,
    private router: Router
  ) {
    votarServicio = this.votarService;
    mensajesServicio = this.mensajeServicio;
  }

  ngOnInit(): void {
    this.getUsuario();
  }

  serValidador(): void {
    inicializar();

    this.listenerSocket.listen('torneo').subscribe((data: string) => {
      let posicion = -1;
      let validadoresAct = new Array<Validador>();
      let respuesta = JSON.parse(data);
      const validadoresActivos = respuesta['validadoresActivos'];

      for (let i = 0; i < validadoresActivos.length; i++) {
        if (validadoresActivos[i]['nombre'] === this.usuario.nombre.toString()) {
          posicion = i;
        }
        let validador = new Validador();
        validador = {
          id: validadoresActivos[i]['nombre'],
          peerId: validadoresActivos[i]['peerId'],
        };
        validadoresAct.push(validador);
      }

      let validadores = new Array<Validador>();
      respuesta = JSON.parse(data);
      const validadoresJSON = respuesta['validadores'];
      for (let i = 0; i < validadoresJSON.length; i++) {
        let validador = new Validador();
        validador = {
          id: validadoresJSON[i]['nombre'],
          peerId: validadoresJSON[i]['peerId'],
        };
        validadores.push(validador);
      }

      if (posicion >= 0) {
        this.consensoService.inicializarValidador(
          validadoresAct,
          validadores,
          posicion,
          respuesta['inicio'],
          respuesta['tiempo']
        );
        this.router.navigate(['Validador']);
      }else{
        this.syncBlockchainP2pService.prepararSync(validadoresAct,  respuesta['inicio'], respuesta['tiempo']);
      }
    });
  }

  getUsuario(): void {
    this.usuarioService.getUsuario().subscribe((result) => {
      this.usuario = result;
      usuarioPeer = this.usuario.nombre.toString();
    });
  }

  enviarMensaje(): void {
    enviarMensaje(this.msj, this.otro_peer_id);
  }
}
