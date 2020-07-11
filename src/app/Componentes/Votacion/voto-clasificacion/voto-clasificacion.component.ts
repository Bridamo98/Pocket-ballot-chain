import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Modelo/Usuario';
import { Votacion } from '../../../Modelo/Votacion';
import { Opcion } from '../../../Modelo/Opcion';
import { Credencial} from '../../../Modelo/Credencial';

import { VotacionService } from '../../../Servicios/votacion.service';
import { OpcionService } from '../../../Servicios/Opcion/opcion.service';
import { CredencialService } from '../../../Servicios/Credencial/credencial.service';

import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-voto-clasificacion',
  templateUrl: './voto-clasificacion.component.html',
  styleUrls: ['./voto-clasificacion.component.css']
})
export class VotoClasificacionComponent implements OnInit {
  votacion: Votacion;
  opciones:Opcion[]=[];
  candidatos:Opcion[]=[];
  idVotacion: Number= -1;
  auxiliar: Opcion;
  credencial:String;
  constructor(private credencialServicio:CredencialService, private votacionServicio:VotacionService, private opcionServicio:OpcionService, private rutaActiva: ActivatedRoute) { 
    this.credencial = this.rutaActiva.snapshot.params.id;
  }
  tituloVotacion: String="Titulo votacion"; //El modelo de votacion aun no tiene titulo
  //Quemar

  otraLista: Opcion[]=[];

  ngOnInit(): void {


    this.credencialServicio.validarCredencial(this.credencial).subscribe(res => {
      this.idVotacion=res.votacion;
      this.getVotacion()
    });
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

    this.opcionServicio.getOpcion(Number(this.idVotacion)).subscribe(res => {
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
      if(this.votacion.tipoDeVotacion=='1')
      {
        window.location.href='VotoRanking/'+this.credencial;
      }
      if(this.votacion.tipoDeVotacion=='2')
      {
        window.location.href='VotoPopular/'+this.credencial;
      }
      console.log(this.votacion);
      this.tituloVotacion= this.votacion.descripcion;
      
    });
  }

}
