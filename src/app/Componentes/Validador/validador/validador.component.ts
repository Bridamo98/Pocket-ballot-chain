import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ManejadorMensajesService } from 'src/app/Controladores/manejador-mensajes.service';
import { AlgoritmoConsensoP2pService } from 'src/app/LogicaP2P/algoritmo-consenso-p2p.service';
import { ListenerSocketsService } from 'src/app/LogicaP2P/listener-sockets.service';
import { SyncBlockchainP2pService } from 'src/app/LogicaP2P/sync-blockchain-p2p.service';
import { Usuario } from 'src/app/Modelo/Usuario';
import { Validador } from 'src/app/Modelo/Validador';
import { environment, envEstatus } from '../../../../environments/environment';
import { Mensaje } from '../../../Modelo/Blockchain/mensaje';
import { Transaccion } from '../../../Modelo/Blockchain/transaccion';
import { UsuarioService } from '../../../Servicios/usuario.service';
import { VotarService } from '../../../Servicios/votar.service';
import { Subscription } from 'rxjs';
import { BlockchainService } from '../../../LogicaP2P/blockchain.service';

// PeerHandler
declare var inicializar: any;
declare var peer: any;
declare var usuarioPeer: any;
declare var votarServicio: any;
declare var mensajesServicio: any;
declare var desconectar: any;

@Component({
  selector: 'app-validador',
  templateUrl: './validador.component.html',
  styleUrls: ['./validador.component.css']
})
export class ValidadorComponent implements OnInit, OnDestroy {
  usuario: Usuario = new Usuario('', 0, '', '');
  estatus: string = envEstatus.inactivo;
  suscripcionTorneo: Subscription;
  suscripcionVotos: Subscription;

  constructor(
    private listenerSocket: ListenerSocketsService,
    private mensajeServicio: ManejadorMensajesService,
    private consensoService: AlgoritmoConsensoP2pService,
    private syncBlockchainP2pService: SyncBlockchainP2pService,
    private usuarioService: UsuarioService,
    private votarService: VotarService,
    private blockchainService: BlockchainService,
    private router: Router
  ) { }

  ngOnInit(): void {
    votarServicio = this.votarService;
    mensajesServicio = this.mensajeServicio;
    this.iniciarVista();
  }

  ngOnDestroy(): void {
    this.cerrarValidador();
  }

  async iniciarVista(): Promise<void> {
    this.usuario = await this.getUsuario();
    usuarioPeer = this.usuario.nombre.toString();
    inicializar();

    this.suscripcionTorneo = this.listenerSocket.listen('torneo').subscribe((data: string) => {
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
        this.iniciarValidador(validadoresAct, validadores, posicion, respuesta);
      }else{
        this.pausarValidador(validadoresAct, respuesta);
      }
    });

    this.suscripcionVotos = this.listenerSocket.listen('voto').subscribe((data) => {
      if(peer.id === data['peerValidador']){
        console.log('---Alias recibido---', data['alias']);
        if (this.mensajeServicio.checkSing(data['voto'], data['firma'], data['firmaKey'])){
          console.log('FIRMA CORRECTA');
          let voto = this.mensajeServicio.decrypt(data['voto']);
          let mensaje = JSON.parse(voto.toString());
          if (mensaje.tipoPeticion === 7){
            mensaje.tipoPeticion = environment.votar;
            this.almacenarVoto(mensaje, data['alias']);
          }
        }
        else{
          console.log('FIRMA ERRADA');
        }
      }
    });
  }

  almacenarVoto(msj, alias): void{
    const tx = msj.contenido;
    const transaccion = new Transaccion(
      tx.tipoTransaccion,
      tx.idVotacion,
      tx.hashIn,
      tx.mensaje,
      tx.timestamp,
      alias
    );
    const mensaje = new Mensaje(msj.tipoPeticion, transaccion);
    this.mensajeServicio.redirigirMensaje(mensaje, null);
  }

  iniciarValidador(validadoresAct, validadores, posicion, respuesta): void{
    this.estatus = envEstatus.activo;
    this.consensoService.inicializarValidador(
      validadoresAct,
      validadores,
      posicion,
      respuesta['inicio'],
      respuesta['tiempo']
    );
  }

  pausarValidador(validadoresAct, respuesta): void{
    this.estatus = envEstatus.inactivo;
    this.syncBlockchainP2pService.prepararSync(validadoresAct,
      respuesta['inicio'],
      respuesta['tiempo']);
  }

  getUsuario(): Promise<Usuario> {
    return this.usuarioService.getUsuario().toPromise();
  }

  dejarSerValidador(): void{
    this.cerrarValidador();
    this.router.navigate(['ValidadorPostularse']);
  }

  cerrarValidador(): void{
    desconectar();
    this.unsubscribe();
    this.blockchainService.cerrarValidador();
  }

  unsubscribe(): void{
    this.suscripcionTorneo.unsubscribe();
    this.suscripcionVotos.unsubscribe();
    this.estatus = envEstatus.inactivo;
  }
}
