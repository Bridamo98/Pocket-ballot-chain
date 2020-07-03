import { Component, OnInit } from '@angular/core';
import { Opcion } from 'src/app/Modelo/Opcion';
import { NgbInputDatepicker, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-votacion-crear-informacion',
  templateUrl: './votacion-crear-informacion.component.html',
  styleUrls: ['./votacion-crear-informacion.component.css']
})
export class VotacionCrearInformacionComponent implements OnInit {

  tipo: string;
  cantiVotos: number;

  opciones: Opcion[] = [
    {id:1, nombre:"uno", descripcion:"descripcion uno"}, 
    {id:2, nombre:'dos', descripcion:'descripcion dos'}, 
    {id:3, nombre:'tres', descripcion:'descripcion tres'},
    {id:1, nombre:"uno", descripcion:"descripcion uno"}, 
    {id:2, nombre:'dos', descripcion:'descripcion dos'}, 
    {id:3, nombre:'tres', descripcion:'descripcion tres'},
    {id:1, nombre:"uno", descripcion:"descripcion uno"}, 
    {id:2, nombre:'dos', descripcion:'descripcion dos'}, 
    {id:3, nombre:'tres', descripcion:'descripcion tres'},
    {id:1, nombre:"uno", descripcion:"descripcion uno"}, 
    {id:2, nombre:'dos', descripcion:'descripcion dos'}, 
    {id:3, nombre:'tres', descripcion:'descripcion tres'}];

  constructor(private rutaActiva: ActivatedRoute, private router: Router) {
    this.tipo = this.rutaActiva.snapshot.params.tipo;
    this.cantiVotos = this.rutaActiva.snapshot.params.cantiVotos;
  }

  ngOnInit(): void {
    if(this.cantiVotos == undefined){
      console.log("Esta undefinido");
    }
    else{
      console.log(this.cantiVotos);
    }
    if(this.tipo !== "Popular" && this.tipo !== "Ranking" && this.tipo !== "Clasificacion"){
      this.router.navigate(['CrearVotacion']);
    }
  }
}
