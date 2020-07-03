import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Modelo/Usuario';
import { Votacion } from '../../../Modelo/Votacion';
import { Opcion } from '../../../Modelo/Opcion';

import { VotacionService } from '../../../Servicios/votacion.service';
import { OpcionService } from '../../../Servicios/Opcion/opcion.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-voto-ranking',
  templateUrl: './voto-ranking.component.html',
  styleUrls: ['./voto-ranking.component.css']
})
export class VotoRankingComponent implements OnInit {

  votaciones: Votacion[] = [];
  votacion: Votacion;
  opciones:Opcion[]=[];

  constructor(private votacionServicio:VotacionService, private opcionServicio:OpcionService) { 
  }
  tituloVotacion: String="Titulo votacion"; //El modelo de votacion aun no tiene titulo
  //Quemar
  idVotacion: number= 1;
  candidatos: string[]=['Santiago', 'Brandonn', 'Diego', 'Briam'];
  ngOnInit(): void {
  	this.getVotacion()

  }
  onDropped(event: CdkDragDrop<any>){
  	console.log(event);
  	const before=event.previousIndex;
  	const actual= event.currentIndex;
  	moveItemInArray(this.opciones, before, actual);
  	//console.log(this.candidatos);
  }
  votar()
  {
  	console.log(this.opciones);
  }
  getVotaciones(){
    this.votacionServicio.getVotaciones().subscribe(res => {
      this.votaciones = res
      console.log(this.votaciones);
    });
  }
  getVotacion(){

    this.opcionServicio.getOpcion(this.idVotacion).subscribe(res => {
      this.opciones = res
      console.log(this.opciones);
    });
    this.votacionServicio.getVotacion(this.idVotacion).subscribe(res => {
      this.votacion = res
      console.log(this.votacion);
      this.tituloVotacion= this.votacion.descripcion;
    });
  }

}
