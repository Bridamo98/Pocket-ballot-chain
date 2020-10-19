import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Modelo/Usuario';
import { Votacion } from '../../../Modelo/Votacion';
import { Opcion } from '../../../Modelo/Opcion';
import { Credencial } from '../../../Modelo/Credencial';

import { VotacionService } from '../../../Servicios/votacion.service';
import { OpcionService } from '../../../Servicios/Opcion/opcion.service';
import { CredencialService } from '../../../Servicios/Credencial/credencial.service';

import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-voto-popular',
  templateUrl: './voto-popular.component.html',
  styleUrls: ['./voto-popular.component.css'],
})
export class VotoPopularComponent implements OnInit {
  votacion: Votacion;
  opciones: Opcion[] = [];
  credencial: String;
  mensaje: string = '';

  constructor(
    private credencialServicio: CredencialService,
    private votacionServicio: VotacionService,
    private opcionServicio: OpcionService,
    private rutaActiva: ActivatedRoute
  ) {
    this.idVotacion = +this.rutaActiva.snapshot.params.id;
  }
  cantVotos: any = 'Ninguna';
  tituloVotacion: String = 'Titulo votacion'; // El modelo de votacion aun no tiene titulo
  // Quemar
  idVotacion: number = -1;
  // candidatos: String[]=['Santiago', 'Brandonn', 'Diego', 'Briam'];
  votos: number[] = [];
  selectedIndex: number = -1;

  ngOnInit(): void {
    this.votacionServicio.validarAutorizacion(this.idVotacion).subscribe((res) => {
      if ( res.toString() === "error"){
        window.location.href = 'Perfil';
      }
      this.votacion = res;
      this.getVotacion();
    });
  }
  votar() {
    if (+this.selectedIndex > -1 && +this.selectedIndex < this.opciones.length){
      // enviar voto
      console.log('Votación en progreso');
    }else{
      this.mensaje = 'Primero seleccione una de las opciones';
    }
  }

  getVotacion() {
    this.opcionServicio.getOpcion(Number(this.idVotacion)).subscribe((res) => {
      this.opciones = res;
      console.log(this.opciones);
      this.votos = Array(this.opciones.length).fill(0);
    });
    this.votacionServicio.getVotacion(this.idVotacion).subscribe((res) => {
      this.votacion = res;
      if (this.votacion.tipoDeVotacion === 1) {
        window.location.href = 'VotoRanking/' + this.idVotacion;
      }
      if (this.votacion.tipoDeVotacion === 3) {
        window.location.href = 'VotoClasificacion/' + this.idVotacion;
      }
      console.log(this.votacion);
      this.tituloVotacion = this.votacion.descripcion;
      // this.cantVotos = this.votacion.votos;
    });
  }

  selectItem(index: number){
    this.selectedIndex = index;
    this.cantVotos = this.opciones[+this.selectedIndex].nombre;
  }
}
