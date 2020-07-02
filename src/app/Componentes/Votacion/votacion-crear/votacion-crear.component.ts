import { Component, OnInit } from '@angular/core';
import { VotacionService } from './../../../Servicios/votacion.service'
import { Votacion } from 'src/app/Modelo/Votacion';
import { Opcion } from 'src/app/Modelo/Opcion';
import { $ } from 'protractor';

@Component({
  selector: 'app-votacion-crear',
  templateUrl: './votacion-crear.component.html',
  styleUrls: ['./votacion-crear.component.css']
})
export class VotacionCrearComponent implements OnInit {

  votaciones: Votacion[] = [];
  otros: String[] = ["hola", "mundo"];
  opciones: Opcion[] = [
    {id:1, nombre:"uno", descripcion:"descripcion uno", votacion:null}, 
    {id:2, nombre:'dos', descripcion:'descripcion dos', votacion:null}, 
    {id:3, nombre:'tres', descripcion:'descripcion tres', votacion:null}];

  constructor(public votacionService: VotacionService) { 

  }

  /*getVotacion(){
    this.votacionService.getVotaciones().subscribe();
  }*/

  cambio(){
    console.log('is Over');
    //console.log(document.getElementById(nombre).innerHTML);
  }

  ngOnInit() {
    this.getVotacion();
    //this.getVotacion();
  }

  getVotacion(){
    this.votacionService.getVotaciones().subscribe(res => {
      this.votaciones = res
      console.log(this.votaciones);
    });
  }

}
