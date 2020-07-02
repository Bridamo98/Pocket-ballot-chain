import { Component, OnInit } from '@angular/core';
import { Opcion } from 'src/app/Modelo/Opcion';
import { NgbInputDatepicker, NgbDatepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-votacion-crear-informacion',
  templateUrl: './votacion-crear-informacion.component.html',
  styleUrls: ['./votacion-crear-informacion.component.css']
})
export class VotacionCrearInformacionComponent implements OnInit {

  opciones: Opcion[] = [
    {id:1, nombre:"uno", descripcion:"descripcion uno", votacion:null}, 
    {id:2, nombre:'dos', descripcion:'descripcion dos', votacion:null}, 
    {id:3, nombre:'tres', descripcion:'descripcion tres', votacion:null},
    {id:1, nombre:"uno", descripcion:"descripcion uno", votacion:null}, 
    {id:2, nombre:'dos', descripcion:'descripcion dos', votacion:null}, 
    {id:3, nombre:'tres', descripcion:'descripcion tres', votacion:null},
    {id:1, nombre:"uno", descripcion:"descripcion uno", votacion:null}, 
    {id:2, nombre:'dos', descripcion:'descripcion dos', votacion:null}, 
    {id:3, nombre:'tres', descripcion:'descripcion tres', votacion:null},
    {id:1, nombre:"uno", descripcion:"descripcion uno", votacion:null}, 
    {id:2, nombre:'dos', descripcion:'descripcion dos', votacion:null}, 
    {id:3, nombre:'tres', descripcion:'descripcion tres', votacion:null}];

  constructor() { }

  ngOnInit(): void {
  }

}
