import { Component, OnInit } from '@angular/core';
import { Grupo } from 'src/app/Modelo/Grupo';

import { GrupoService } from './../../../Servicios/grupo.service'


@Component({
  selector: 'app-grupo-listar',
  templateUrl: './grupo-listar.component.html',
  styleUrls: ['./grupo-listar.component.css']
})
export class GrupoListarComponent implements OnInit {

  todos: Grupo[] = [];
  propios: Grupo[] = [];
  invitaciones: Grupo[] = [];
  pertenecientes: Grupo[] = [];
  otros: Grupo[] = [];
  esOtro: boolean;
  ruta: string;
  iniciado: string = "Usuario1";//QUEMADO - SE DEBE OBTENER CUAL ES EL USUARIO INICIADO

  obenerTodos(): void {

    this.grupoService.obtenerGrupos().subscribe(res => {
      this.todos = res;
      console.log(this.todos);
      this.obtenerPropios();
      this.todos.forEach(val => {
        this.grupoService.obtenerMiembrosDeGrupo(val.id).subscribe(res2 => {
          val.miembros = res2;
          this.grupoService.obtenerPendientes(val.id).subscribe(res3 => {
            val.pendientes = res3;
            this.obtenerInvitacionesPertenecientesOtros();
          });
        });
      });
    });
  }

  obtenerPropios(): void {
    this.propios = this.todos.filter(res => {
      return !res.creador.localeCompare(this.iniciado);
    });
    console.log(this.propios);
  }

  obtenerInvitacionesPertenecientesOtros(): void {
    this.invitaciones = [];
    this.pertenecientes = [];
    this.otros = [];
    this.todos.forEach(val => {
      this.esOtro = true;
      if (val.pendientes) {
        val.pendientes.forEach(val2 => {
          if (!val2.nombre.localeCompare(this.iniciado)) {
            this.invitaciones.push(Object.assign({}, val));
            this.esOtro = false;
          }
        });
      }
      if (val.miembros) {
        val.miembros.forEach(val2 => {
          if (!val2.nombre.localeCompare(this.iniciado)) {
            this.pertenecientes.push(Object.assign({}, val));
            this.esOtro = false;
          }
        });
      }

      if (this.esOtro) {
        this.otros.push(Object.assign({}, val));
      }
    });
  }

  constructor(public grupoService: GrupoService) { }

  ngOnInit(): void {
    this.obenerTodos();
    this.ruta = window.location.origin;
  }

}
