import { Component, OnInit } from '@angular/core';
import { Grupo } from 'src/app/Modelo/Grupo';

@Component({
  selector: 'app-grupo-listar',
  templateUrl: './grupo-listar.component.html',
  styleUrls: ['./grupo-listar.component.css']
})
export class GrupoListarComponent implements OnInit {

  todos: Grupo[] = [];
  propios: Grupo[] = [];
  invitaciones: Grupo[]=[];
  pertenecientes: Grupo[]=[];
  otros: Grupo[] = [];
  esOtro: boolean;
  ruta:string;
  date: Date = new Date(); #Quemado
  iniciado: string = "us4";//QUEMADO - SE DEBE OBTENER CUAL ES EL USUARIO INICIADO

  obenerTodos():void{
    this.todos = [//OBTENER LAS GRUPOS DEL SERVIDOR O SERVICIO
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
  }

  obtenerPropios():void{
    this.propios = this.todos.filter(res =>{
      return !res.creador.nombre.localeCompare(this.iniciado);
    });
    console.log(this.propios);
  }

  obtenerInvitacionesPertenecientesOtros(): void {
    this.invitaciones = [];
    this.pertenecientes = [];
    this.otros = [];
    this.todos.forEach(val=>{
      this.esOtro = true;
      val.pendientes.forEach(val2=>{
        if(!val2.nombre.localeCompare(this.iniciado)){
          this.invitaciones.push(Object.assign({}, val));
          this.esOtro = false;
        }
      });
      val.miembros.forEach(val2 => {
        if (!val2.nombre.localeCompare(this.iniciado)) {
          this.pertenecientes.push(Object.assign({}, val));
          this.esOtro = false;
        }
      });
      if(this.esOtro){
        this.otros.push(Object.assign({}, val));
      }
    });
  }

  constructor() { }

  ngOnInit(): void {
    this.obenerTodos();
    this.obtenerPropios();
    this.obtenerInvitacionesPertenecientesOtros();
    this.ruta = window.location.origin;
  }

}
