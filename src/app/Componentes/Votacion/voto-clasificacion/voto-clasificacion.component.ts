import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Modelo/Usuario';
import { Votacion } from '../../../Modelo/Votacion';
import { Opcion } from '../../../Modelo/Opcion';

import { VotacionService } from '../../../Servicios/votacion.service';
import { OpcionService } from '../../../Servicios/Opcion/opcion.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-voto-clasificacion',
  templateUrl: './voto-clasificacion.component.html',
  styleUrls: ['./voto-clasificacion.component.css']
})
export class VotoClasificacionComponent implements OnInit {
  votacion: Votacion;
  opciones:Opcion[]=[];
  candidatos:Opcion[]=[];
  idVotacion: number= 3;
  auxiliar: Opcion;
  constructor(private votacionServicio:VotacionService, private opcionServicio:OpcionService) {

  }
  tituloVotacion: String="Titulo votacion"; //El modelo de votacion aun no tiene titulo
  //Quemar

  otraLista: Opcion[]=[];

  ngOnInit(): void {

    this.getVotacion();
     this.auxiliar={
        descripcion : null,
        id : null,
        nombre :"Arrastre los elementos que desaprueba aqui",
        votacion : null
      }
      this.otraLista.push(this.auxiliar);
    //this.otraLista.push("Arrastre los elementos que desaprueba aqui");
  }
  onDropped(event: CdkDragDrop<any>){
    if(event.previousContainer !== event.container)
    {
    	if(event.previousIndex!=0)
    	{
    		if(event.currentIndex==0)
    		{
    			event.currentIndex=event.currentIndex+1;
    		}
    		transferArrayItem(event.previousContainer.data, event.container.data,  event.previousIndex, event.currentIndex);
    	}

    }

    //console.log(this.candidatos);
  }
  votar()
  {
  	console.log(this.candidatos);
  	console.log(this.otraLista);
  }

  getVotacion(){

    this.opcionServicio.getOpcion(this.idVotacion).subscribe(res => {
      this.opciones = res
      
      this.auxiliar={
        descripcion : null,
        id : null,
        nombre :"Arrastre los elementos que Aprueba aqui",
        votacion : null
      }
      console.log(this.opciones);
      this.opciones.push( this.opciones[0]);
      this.opciones[0]=this.auxiliar;
      this.candidatos=this.opciones;
    });
    this.votacionServicio.getVotacion(this.idVotacion).subscribe(res => {
      this.votacion = res
      console.log(this.votacion);
      this.tituloVotacion= this.votacion.descripcion;
      
    });
  }

}
