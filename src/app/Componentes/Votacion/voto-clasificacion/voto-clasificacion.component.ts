import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Modelo/Usuario';
import { Votacion } from '../../../Modelo/Votacion';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-voto-clasificacion',
  templateUrl: './voto-clasificacion.component.html',
  styleUrls: ['./voto-clasificacion.component.css']
})
export class VotoClasificacionComponent implements OnInit {

  constructor() { }
  tituloVotacion: string="Titulo votacion"; //El modelo de votacion aun no tiene titulo
    //Quemar
  candidatos: string[]=[];

  otraLista: string[]=[];

  ngOnInit(): void {
  	this.candidatos.push("Arraste los elementos que aprueba aqui.");
  	this.candidatos.push("cosa1");
  	this.candidatos.push("cosa2");
  	this.candidatos.push("cosa3");
  	this.candidatos.push("cosa4");
  	this.otraLista.push("Arrastre los elementos que desaprueba aqui");
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

}
