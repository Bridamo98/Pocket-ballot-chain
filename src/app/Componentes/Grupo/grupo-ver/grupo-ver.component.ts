import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Grupo } from 'src/app/Modelo/Grupo';

@Component({
  selector: 'app-grupo-ver',
  templateUrl: './grupo-ver.component.html',
  styleUrls: ['./grupo-ver.component.css']
})
export class GrupoVerComponent implements OnInit {
  id: string;
  origen: string;
  grupo: Grupo;
  grupos:Grupo[]=[];
  ruta: string;
  iniciado:string="us4";//QUEMADO - SE DEBE OBTENER CUAL ES EL USUARIO INICIADO
  date: Date = new Date(); #Quemado

  constructor(private routeParams: ActivatedRoute) {

  };

  eliminar():void{

  };

  aceptarInvitacion(): void {

  };

  rechazarInvitacion(): void {

  };

  abandonar(): void {

  };

  obtenerGrupo(): void{
    this.grupos = [//OBTENER LAS GRUPOS DEL SERVIDOR O SERVICIO
      {
        descripcion: "String",
        creacion: this.date,
        id: "1",
        nombre: "gr1",
        creador: {
          nombre: "us6",
          saldo: 123,
          correo: "String",
          idValidador: "String",
          bloqAprobados: 2,
          bloqPropuestos: 3,
          bloqRevisados: 3,
          bloqValidados: 1,
          genera: []
        },
        miembros: [
          {
            nombre: "us1",
            saldo: 123,
            correo: "String",
            idValidador: "String",
            bloqAprobados: 2,
            bloqPropuestos: 3,
            bloqRevisados: 3,
            bloqValidados: 1,
            genera: []
          },
          {
            nombre: "us2",
            saldo: 123,
            correo: "String",
            idValidador: "String",
            bloqAprobados: 2,
            bloqPropuestos: 3,
            bloqRevisados: 3,
            bloqValidados: 1,
            genera: []
          }
        ],
        pendientes: [],
        historial: []
      },
      {
        descripcion: "String",
        creacion: this.date,
        id: "2",
        nombre: "gr2",
        creador: {
          nombre: "us4",
          saldo: 123,
          correo: "String",
          idValidador: "String",
          bloqAprobados: 2,
          bloqPropuestos: 3,
          bloqRevisados: 3,
          bloqValidados: 1,
          genera: []
        },
        miembros: [
          {
            nombre: "us1",
            saldo: 123,
            correo: "String",
            idValidador: "String",
            bloqAprobados: 2,
            bloqPropuestos: 3,
            bloqRevisados: 3,
            bloqValidados: 1,
            genera: []
          },
          {
            nombre: "us2",
            saldo: 123,
            correo: "String",
            idValidador: "String",
            bloqAprobados: 2,
            bloqPropuestos: 3,
            bloqRevisados: 3,
            bloqValidados: 1,
            genera: []
          },
          {
            nombre: "us3",
            saldo: 123,
            correo: "String",
            idValidador: "String",
            bloqAprobados: 2,
            bloqPropuestos: 3,
            bloqRevisados: 3,
            bloqValidados: 1,
            genera: []
          }
        ],
        pendientes: [{
          nombre: "us4",
          saldo: 123,
          correo: "String",
          idValidador: "String",
          bloqAprobados: 2,
          bloqPropuestos: 3,
          bloqRevisados: 3,
          bloqValidados: 1,
          genera: []
        }],
        historial: []
      },
      {
        descripcion: "String",
        creacion: this.date,
        id: "3",
        nombre: "gr3",
        creador: {
          nombre: "us2",
          saldo: 123,
          correo: "String",
          idValidador: "String",
          bloqAprobados: 2,
          bloqPropuestos: 3,
          bloqRevisados: 3,
          bloqValidados: 1,
          genera: []
        },
        miembros: [
          {
            nombre: "us3",
            saldo: 123,
            correo: "String",
            idValidador: "String",
            bloqAprobados: 2,
            bloqPropuestos: 3,
            bloqRevisados: 3,
            bloqValidados: 1,
            genera: []
          },
          {
            nombre: "us4",
            saldo: 123,
            correo: "String",
            idValidador: "String",
            bloqAprobados: 2,
            bloqPropuestos: 3,
            bloqRevisados: 3,
            bloqValidados: 1,
            genera: []
          }
        ],
        pendientes: [],
        historial: []
      },
      {
        descripcion: "String",
        creacion: this.date,
        id: "4",
        nombre: "gr4",
        creador: {
          nombre: "us4",
          saldo: 123,
          correo: "String",
          idValidador: "String",
          bloqAprobados: 2,
          bloqPropuestos: 3,
          bloqRevisados: 3,
          bloqValidados: 1,
          genera: []
        },
        miembros: [
          {
            nombre: "us5",
            saldo: 123,
            correo: "String",
            idValidador: "String",
            bloqAprobados: 2,
            bloqPropuestos: 3,
            bloqRevisados: 3,
            bloqValidados: 1,
            genera: []
          },
          {
            nombre: "us6",
            saldo: 123,
            correo: "String",
            idValidador: "String",
            bloqAprobados: 2,
            bloqPropuestos: 3,
            bloqRevisados: 3,
            bloqValidados: 1,
            genera: []
          }
        ],
        pendientes: [],
        historial: []
      }
    ];
    this.grupo = this.grupos.filter(res => { return !res.id.localeCompare(this.id); })[0];
  }

  obtenerRelacion():string{
    if(!this.grupo.creador.nombre.localeCompare(this.iniciado)){
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
    this.ruta = window.location.origin;
    this.routeParams.params.subscribe(params => {
      this.id = params['id'];
      this.origen = params['origen'];
    });
    this.obtenerGrupo();
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
  }
}
