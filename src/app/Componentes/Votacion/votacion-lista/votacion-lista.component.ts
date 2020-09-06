import { ManejadorMensajesService } from './../../../Controladores/manejador-mensajes.service';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/Modelo/Usuario';
import { Votacion } from 'src/app/Modelo/Votacion';
import { Mensaje } from 'src/app/Modelo/Blockchain/mensaje';
import { Validador } from 'src/app/Modelo/Validador';//Para probar envio de transacciones
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { VotacionService } from '../../../Servicios/votacion.service';
import { UsuarioService } from '../../../Servicios/usuario.service';
import { VotarService } from '../../../Servicios/votar.service';//Para probar envio de transacciones

declare var inicializar: any;
declare var establecerConexion: any;
declare var enviarMensaje: any;
declare var peer: any;
declare var mensajesServicio: any;


@Component({
  selector: 'app-votacion-lista',
  templateUrl: './votacion-lista.component.html',
  styleUrls: ['./votacion-lista.component.css']
})
export class VotacionListaComponent implements OnInit {

  usuario: Usuario = new Usuario('', 0, '', '');
  votaciones: Votacion[];
  misVotaciones: Votacion[] = [];
  votacionesInscrito: Votacion[] = [];

  constructor(
    private router: Router,
    private rutaActiva: ActivatedRoute,
    private votacionService: VotacionService,
    private usuarioService: UsuarioService,
    private mensajeServicio: ManejadorMensajesService,
    private votarService: VotarService//Para probar envio de transacciones
  ) { }

  ngOnInit(): void {
    inicializar();
    mensajesServicio = this.mensajeServicio;
    this.iniciarVista();
  }

  iniciarVista(): void {
    this.getUsuario();
    this.getVotaciones();
  }

  // Solicita al servicio el usuario
  getUsuario(): void {
    this.usuarioService.getUsuario()
      .subscribe(
        result => {
          this.usuario = result;
          if (this.usuario === null || this.usuario === undefined) {
            this.router.navigate(['/']);
          }
        }
      );
  }

  // Solicita al servicio las votaciones
  getVotaciones(): void {
    this.votacionService.getVotacionesUsuario()
      .subscribe(
        result => {
          this.votaciones = result;
          this.actualizarParticipantes(this.votaciones);
          this.actualizarVotaciones(this.votaciones);
        }
      );
  }

  salir(votacion: Votacion, votaciones: Votacion[]): void {
    if (confirm('¿Está seguro de salir de esta votación?')) {
      votaciones.splice(votaciones.indexOf(votacion), 1);
      this.votacionService.deleteUsuarioVotacion(votacion.id.valueOf(), this.usuario.nombre.toString()).subscribe(
        result => { console.log(result) }
      );
    }
  }

  ordenarPorTitulo(votaciones: Votacion[]): void {
    votaciones.sort(function (a, b) {
      let tituloA = a.titulo.toUpperCase();
      let tituloB = b.titulo.toUpperCase();
      if (tituloA < tituloB) {
        return -1;
      }
      if (tituloA > tituloB) {
        return 1;
      }
      return 0;
    });
  }

  ordenarPorParticipantes(votaciones: Votacion[]) {
    votaciones.sort(function (a, b) {
      return a.participantes.length - b.participantes.length;
    });
  }

  crearVotacion(): void {
    console.log('crearVotacion');
    this.router.navigate(['/CrearVotacion']);
  }

  verInvitaciones(): void {
    console.log('verVotaciones');
    //this.router.navigate(['*/'+this.usuario.nombre]);
  }

  verVotacion(titulo: string): void {
    console.log('verVotacion ' + titulo);
    this.router.navigate(['VotacionReporte/' + titulo]);
  }

  actualizarParticipantes(votaciones: Votacion[]): void {
    for (const votacion of votaciones) {
      this.votacionService.getParticipanteVotacion(votacion.id.valueOf())
        .subscribe(
          result => { votacion.participantes = result; }
        );
    }
  }

  actualizarVotaciones(votaciones: Votacion[]): void {
    for (const votacion of votaciones) {
      if (votacion.autor.toString().localeCompare(this.usuario.nombre.toString()) === 0) {
        this.misVotaciones.push(votacion);
      } else {
        this.votacionesInscrito.push(votacion);
      }
    }
  }


  //Para probar envio de transacciones
  enviarTransaccion(): void {
    this.votarService.obtenerValidadores()
      .subscribe(
        result => {
          result.forEach(element => {
            console.log(element);
            let mensaje: Mensaje = new Mensaje(environment.obtenerPk, "");
            //console.log(element.peerId);
            
            enviarMensaje(mensaje, element.peerId);
            //enviarMensaje(mensaje, element.peerId);
          });
        }
      );
  }
}
