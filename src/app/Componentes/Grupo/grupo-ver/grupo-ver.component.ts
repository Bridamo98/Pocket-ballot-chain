import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Grupo, Relacion } from 'src/app/Modelo/Grupo';

import { GrupoService } from './../../../Servicios/grupo.service'


@Component({
  selector: 'app-grupo-ver',
  templateUrl: './grupo-ver.component.html',
  styleUrls: ['./grupo-ver.component.css']
})
export class GrupoVerComponent implements OnInit {
  id: number;
  origen: string;
  grupo: Grupo;
  relacion:Relacion= new Relacion();
  grupos:Grupo[]=[];
  ruta: string;
  iniciado:string="Usuario1";//QUEMADO - SE DEBE OBTENER CUAL ES EL USUARIO INICIADO

  constructor(private routeParams: ActivatedRoute, public grupoService: GrupoService) {
    this.ruta = window.location.origin;
    this.grupo = new Grupo();
    this.grupo.miembros = [];
    this.grupo.pendientes = [];
    this.routeParams.params.subscribe(params => {
      this.id = params['id'];
      this.origen = params['origen'];
    });
    this.relacion.idGrupo = this.id;
    this.relacion.idUsuario = this.iniciado;
    
  };

  eliminar():void{
    this.grupoService.eliminarGrupo(this.id).subscribe(res=>{
      console.log(res);
    })
  };

  aceptarInvitacion(): void {
    this.grupoService.eliminarPendiente(this.relacion).subscribe(res=>{
      console.log(res);
    })
    this.grupoService.agregarMiembro(this.relacion).subscribe(res=>{
      console.log(res);  
    })
  };

  rechazarInvitacion(): void {
    this.grupoService.eliminarPendiente(this.relacion).subscribe(res => {
      console.log(res);
    })
  };

  abandonar(): void {
    this.grupoService.eliminarMiembro(this.relacion).subscribe(res=>{
      console.log(res);
    });
  };



  obtenerRelacion():string{
    if(!this.grupo.creador.localeCompare(this.iniciado)){
      return "propios";
    }else if(this.grupo.miembros.some(res => !res.nombre.localeCompare(this.iniciado))){
      return "pertenecientes";
    } else if (this.grupo.pendientes.some(res => !res.nombre.localeCompare(this.iniciado))){
      return "invitaciones";
    }else{
      return "otros";
    }
  }

  ngOnInit(): void {
    this.grupoService.obtenerGrupo(this.id).subscribe(res => {
      this.grupo = res;
      this.grupoService.obtenerMiembrosDeGrupo(this.id).subscribe(res2 => {
        this.grupo.miembros = res2;
        this.grupoService.obtenerPendientes(this.id).subscribe(res3 => {
          this.grupo.pendientes = res3;
          switch (this.origen) {
            case "propios":
              //
              break;
            case "invitaciones":
              //
              break;
            case "pertenecientes":
              //
              break;
            case "otros":
              //
              break;
            case "todos":
              //
              this.origen = this.obtenerRelacion();
              break;
            default:
              //
              break;
          }
          console.log(this.grupo);
        });
      });
    });
  }
}
