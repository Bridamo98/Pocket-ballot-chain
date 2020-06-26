import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Modelo/Usuario';
import { Votacion } from '../../../Modelo/Votacion';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-voto-ranking',
  templateUrl: './voto-ranking.component.html',
  styleUrls: ['./voto-ranking.component.css']
})
export class VotoRankingComponent implements OnInit {

  constructor() { }
  tituloVotacion: string="Titulo votacion"; //El modelo de votacion aun no tiene titulo
    //Quemar
  candidatos: string[]=['Santiago', 'Brandonn', 'Diego', 'Briam'];
  ngOnInit(): void {
  	console.log(this.candidatos);

  }
  onDropped(event: CdkDragDrop<any>){
  	console.log(event);
  	const before=event.previousIndex;
  	const actual= event.currentIndex;
  	moveItemInArray(this.candidatos, before, actual);
  	//console.log(this.candidatos);
  }
  registrarse()
  {
  	console.log(this.candidatos);
  }


}
