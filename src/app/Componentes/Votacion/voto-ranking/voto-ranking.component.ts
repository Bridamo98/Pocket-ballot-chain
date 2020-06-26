import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Modelo/Usuario';

@Component({
  selector: 'app-voto-ranking',
  templateUrl: './voto-ranking.component.html',
  styleUrls: ['./voto-ranking.component.css']
})
export class VotoRankingComponent implements OnInit {

  constructor() { }

  //Quemar
  candidatos: string[]=['Santiago', 'Brandonn', 'Diego', 'Briam'];
  ngOnInit(): void {
  	console.log(this.candidatos);

  }


}
