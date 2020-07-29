import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';


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
  iniciado:string;

  confirmationText: string;
  act:number;

  constructor(private routeParams: ActivatedRoute, public grupoService: GrupoService, 
    private modalService: NgbModal, private router: Router) {

    this.ruta = window.location.origin;
    this.grupo = new Grupo();
    this.grupo.miembros = [];
    this.grupo.pendientes = [];

    this.routeParams.params.subscribe(params => {

      this.id = params['id'];
      this.origen = params['origen'];

    });
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

  editar():void{
    this.router.navigate(['EditarGrupo/' + this.grupo.id]);
  }



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

  confirmacion(modal, act:number): boolean {

    this.act = act;
    
    switch(this.act){
      case 1:
        this.confirmationText = '¿Está seguro que desea eliminar este grupo?'
        break;
      case 2:
        this.confirmationText = '¿Está seguro que desea abandonar este grupo?'
        break;
      case 3:
        this.confirmationText = '¿Está seguro que desea rechazar esta invitación?'
        break;
      case 4:
        this.confirmationText = '¿Está seguro que desea aceptar esta invitación?'
        break;
      default:
        break;
    }
    
    this.modalService.open(modal);
    
    return false;
  }

  action(): boolean {

    switch (this.act) {
      case 1:
        this.eliminar();
        break;
      case 2:
        this.abandonar();
        break;
      case 3:
        this.rechazarInvitacion();
        break;
      case 4:
        this.aceptarInvitacion();
        break;
      default:
        break;
    }

    this.router.navigate(['ListarGrupos/']);
    
    return false;
  
  }

  ngOnInit(): void {

    this.grupoService.obtenerUsuarioLogueado().subscribe(res => {

      console.log(res.status);
      this.iniciado = res.status;
      this.relacion.idGrupo = this.id;
      this.relacion.idUsuario = this.iniciado;

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
    }); 
  }
}
