import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Modelo/Usuario';
import { Votacion } from '../../../Modelo/Votacion';
import { Opcion } from '../../../Modelo/Opcion';

import { VotacionService } from '../../../Servicios/votacion.service';
import { OpcionService } from '../../../Servicios/Opcion/opcion.service';
@Component({
	selector: 'app-voto-popular',
	templateUrl: './voto-popular.component.html',
	styleUrls: ['./voto-popular.component.css']
})
export class VotoPopularComponent implements OnInit {

	votacion: Votacion;
	opciones:Opcion[]=[];
	constructor(private votacionServicio:VotacionService, private opcionServicio:OpcionService) { 

	}
	cantVotos:number;
	tituloVotacion: String="Titulo votacion"; //El modelo de votacion aun no tiene titulo
	//Quemar
	idVotacion: number= 2;
	//candidatos: String[]=['Santiago', 'Brandonn', 'Diego', 'Briam'];
	votos: number[]=[];

	ngOnInit(): void {
		this.getVotacion()
		console.log(this.votos);
	}
	votar()
	{
		console.log(this.opciones);
		console.log(this.votos);
	}
	votar2(index)
	{
		if(this.cantVotos>0)
		{
			this.votos[index]=this.votos[index]+1;
			this.cantVotos--;
		}

	}
	getVotacion(){

    this.opcionServicio.getOpcion(this.idVotacion).subscribe(res => {
      this.opciones = res
      console.log(this.opciones);
      this.votos=Array(this.opciones.length).fill(0);
    });
    this.votacionServicio.getVotacion(this.idVotacion).subscribe(res => {
      this.votacion = res
      console.log(this.votacion);
      this.tituloVotacion= this.votacion.descripcion;
      this.cantVotos=this.votacion.votos;
    });
  }


}
