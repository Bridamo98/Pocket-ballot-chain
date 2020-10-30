import { envTipoTx } from './../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Modelo/Usuario';
import { Votacion } from '../../../Modelo/Votacion';
import { Opcion } from '../../../Modelo/Opcion';
import { Credencial } from '../../../Modelo/Credencial';

import { VotacionService } from '../../../Servicios/votacion.service';
import { OpcionService } from '../../../Servicios/Opcion/opcion.service';
import { CredencialService } from '../../../Servicios/Credencial/credencial.service';

import { Router, ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Transaccion } from 'src/app/Modelo/Blockchain/transaccion';
import { environment } from 'src/environments/environment';
import { Mensaje } from 'src/app/Modelo/Blockchain/mensaje';
import { VotarService } from 'src/app/Servicios/votar.service';

declare var enviarMensaje: any;
declare var setVoto: any;
@Component({
  selector: 'app-voto-ranking',
  templateUrl: './voto-ranking.component.html',
  styleUrls: ['./voto-ranking.component.css'],
})
export class VotoRankingComponent implements OnInit {
  votaciones: Votacion[] = [];
  votacion: Votacion;
  opciones: Opcion[] = [];
  credencial: String;

  constructor(
    private votarService: VotarService,
    private votacionServicio: VotacionService,
    private opcionServicio: OpcionService,
    private rutaActiva: ActivatedRoute,
    private router: Router
  ) {
    this.idVotacion = +this.rutaActiva.snapshot.params.id;
  }
  tituloVotacion: String = 'Titulo votacion'; // El modelo de votacion aun no tiene titulo
  // Quemar
  idVotacion: number = -1;

  ngOnInit(): void {
    this.votacionServicio
      .validarAutorizacion(this.idVotacion)
      .subscribe((res) => {
        if (res.toString() === 'error') {
          window.location.href = 'Perfil';
        }
        this.votacion = res;
        this.getVotacion();
      });
  }
  onDropped(event: CdkDragDrop<any>) {
    console.log(event);
    const before = event.previousIndex;
    const actual = event.currentIndex;
    moveItemInArray(this.opciones, before, actual);
  }
  votar() {
    console.log(this.opciones);
    const voto = new Array<string>();

    for (let index = 0; index < this.opciones.length; index++) {
      const opcion = this.opciones[index];
      voto.push(((index + 1) + ' ' + opcion.nombre).trim());
    }
    const timestamp: number = Date.now();
    const transaccion: Transaccion = new Transaccion(
      envTipoTx.voto,
      +this.votacion.id,
      'asd',
      voto,
      timestamp,
      ''
    );
    const mensaje = new Mensaje(environment.obtenerPk, transaccion);
    this.enviarVoto(mensaje);
    this.router.navigate(['/Inicio']);
  }
  getVotaciones() {
    this.votacionServicio.getVotaciones().subscribe((res) => {
      this.votaciones = res;
      console.log(this.votaciones);
    });
  }
  getVotacion() {
    this.opcionServicio.getOpcion(Number(this.idVotacion)).subscribe((res) => {
      this.opciones = res;
      console.log(this.opciones);
    });
    if (this.votacion.tipoDeVotacion === 2) {
      window.location.href = 'VotoPopular/' + this.idVotacion;
    }
    if (this.votacion.tipoDeVotacion === 3) {
      window.location.href = 'VotoClasificacion/' + this.idVotacion;
    }
    console.log(this.votacion);
    this.tituloVotacion = this.votacion.titulo;
  }

  enviarVoto(mensaje: Mensaje){
    this.votarService.obtenerValidadores()
    .subscribe(
      result => {
        result.forEach(element => {
          console.log(element);
          console.log("Enviando mensaje a:", element.peerId);
          console.log(mensaje);
          this.registrarVoto(mensaje);
          enviarMensaje(mensaje, element.peerId);
        });
      }
    );

  }
  registrarVoto(voto){
    setVoto(voto);
  }
}
