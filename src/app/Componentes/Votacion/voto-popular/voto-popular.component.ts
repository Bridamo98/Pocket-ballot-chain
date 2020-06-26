import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Modelo/Usuario';
import { Votacion } from '../../../Modelo/Votacion';

@Component({
	selector: 'app-voto-popular',
	templateUrl: './voto-popular.component.html',
	styleUrls: ['./voto-popular.component.css']
})
export class VotoPopularComponent implements OnInit {

	constructor() { }
	cantVotos:number= 10;
	tituloVotacion: string="Titulo votacion"; //El modelo de votacion aun no tiene titulo
	//Quemar
	candidatos: string[]=['Santiago', 'Brandonn', 'Diego', 'Briam'];
	votos: number[]=Array(this.candidatos.length).fill(0);

	ngOnInit(): void {
		console.log(this.votos);
	}
	votar()
	{
		console.log(this.candidatos);
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


}
