import { Component, OnInit, Input } from '@angular/core';

import { Grupo } from '../../../Modelo/Grupo';
import { Usuario } from '../../../Modelo/Usuario';

@Component({
  selector: 'app-grupo-crear',
  templateUrl: './grupo-crear.component.html',
  styleUrls: ['./grupo-crear.component.css']
})
export class GrupoCrearComponent implements OnInit {
  @Input() id: string;//Del grupo, cuando se quiere editar
  titulo: string;

  ruta: string;//Para invocar a verGrupo

  mostrarUsuarios: boolean = true;
  grupo: Grupo = new Grupo();

  todosLosUsuarios: Usuario[] = [];

  usuarios: Usuario[] = [];
  usuariosCopia: Usuario[] = [];
  grupos: Grupo[] = [];
  gruposCopia: Grupo[] = [];


  usuariosSeleccionados: Usuario[] = [];
  gruposSeleccionados: Grupo[] = [];

  hayGrupos: boolean;
  hayUsuarios: boolean;
  hayGruposAgregados: boolean = false;
  hayUsuariosAgregados: boolean;
  camposEditar: boolean;

  date: Date = new Date(); #Quemado

  buscadorGrupo: String = "";
  buscadorUsuario: String = "";

  constructor() { }

  arrayVacio(array: any[]): boolean {
    if (array.length == 0) {
      return false;
    } else {
      return true;
    }
  }

  agregarGrupo(g): void {
    this.gruposSeleccionados.push(g);
    this.grupos = this.grupos.filter(
      res => {
        return res.id.localeCompare(g.id);
      }
    );
    g.miembros.forEach(val => {
      console.log("val: " + val.nombre);
      console.log(this.todosLosUsuarios.some(usu => {
        console.log(usu.nombre + " " + val.nombre);
        return !usu.nombre.localeCompare(val.nombre);
      }));
      if (!this.todosLosUsuarios.some(usu => !usu.nombre.localeCompare(val.nombre))) {
        this.todosLosUsuarios.push(Object.assign({}, val));
        this.usuarios = this.usuarios.filter(
          res => {
            return res.nombre.localeCompare(val.nombre);
          }
        );
      }
    }
    );
    this.filtrarGrupos();
    this.filtrarUsuarios();
    this.hayGrupos = this.arrayVacio(this.grupos);
    this.hayGruposAgregados = this.arrayVacio(this.gruposSeleccionados);
  }

  eliminarGrupo(i): void {
    this.grupos.push(this.gruposSeleccionados[i]);
    this.gruposSeleccionados[i].miembros.forEach(val => {
      if (!this.usuarios.some(usu => !usu.nombre.localeCompare(val.nombre.toString()))) {
        this.usuarios.push(Object.assign({}, val));
        this.todosLosUsuarios = this.todosLosUsuarios.filter(
          res => {
            return res.nombre.localeCompare(val.nombre.toString());
          }
        );
      }
    });
    this.filtrarGrupos();
    this.filtrarUsuarios();
    this.gruposSeleccionados.splice(i, 1);
    this.hayGrupos = this.arrayVacio(this.grupos);
    this.hayGruposAgregados = this.arrayVacio(this.gruposSeleccionados);
  }

  verUsuario(i): void {//MIRAR SI ES POSIBLE

  }

  agregarUsuario(u): void {
    this.usuariosSeleccionados.push(u);
    if (!this.todosLosUsuarios.some(usu => !usu.nombre.localeCompare(u.nombre))) {
      this.todosLosUsuarios.push(Object.assign({}, u));
      this.usuarios = this.usuarios.filter(
        res => {
          return res.nombre.localeCompare(u.nombre);
        }
      );
    }
    this.filtrarUsuarios();
    this.hayUsuarios = this.arrayVacio(this.usuarios);
    this.hayUsuariosAgregados = this.arrayVacio(this.usuariosSeleccionados);
  }

  eliminarUsuario(u, i): void {
    this.usuariosSeleccionados.splice(i, 1);
    if (!this.usuarios.some(usu => !usu.nombre.localeCompare(u.nombre.toString()))) {
      this.usuarios.push(Object.assign({}, u));
      this.todosLosUsuarios = this.todosLosUsuarios.filter(
        res => {
          return res.nombre.localeCompare(u.nombre.toString());
        }
      );
    }
    this.filtrarUsuarios();
    this.hayUsuarios = this.arrayVacio(this.usuarios);
    this.hayUsuariosAgregados = this.arrayVacio(this.usuariosSeleccionados);
  }

  importar(): void {

  }

  crearGrupo(): boolean {
    return false;
  }

  filtrarGrupos(): void {
    if (this.buscadorGrupo != "") {
      this.gruposCopia = this.grupos.filter(
        res => {
          return res.nombre.toLocaleLowerCase().match(this.buscadorGrupo.toLocaleLowerCase());
        }
      );
    } else {
      this.gruposCopia = [];
      this.grupos.forEach(val => this.gruposCopia.push(Object.assign({}, val)));
    }
  }

  filtrarUsuarios(): void {
    if (this.buscadorUsuario != "") {
      this.usuariosCopia = this.usuarios.filter(
        res => {
          return res.nombre.toLocaleLowerCase().match(this.buscadorUsuario.toLocaleLowerCase());
        }
      );
    } else {
      this.usuariosCopia = [];
      this.usuarios.forEach(val => this.usuariosCopia.push(Object.assign({}, val)));
    }
  }

  obtenerGrupo(id: string): Grupo {
    return this.grupos.filter(res => { return !res.id.localeCompare(id); })[0];
  }

  actualizarGrupo(): boolean {
    return false;
  }

  mostrar(): void {
    this.mostrarUsuarios = !this.mostrarUsuarios;
  }

  ngOnInit(): void {
    this.usuarios = [//Consultar usuarios y grupos de servidor o servicio
      {
        nombre: "us1",
        saldo: 123,
        correo: "String",
        idValidador: "String",
        bloqAprobados: 2,
        bloqPropuestos: 3,
        bloqRevisador: 3,
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
        bloqRevisador: 3,
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
        bloqRevisador: 3,
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
        bloqRevisador: 3,
        bloqValidados: 1,
        genera: []
      },
      {
        nombre: "us5",
        saldo: 123,
        correo: "String",
        idValidador: "String",
        bloqAprobados: 2,
        bloqPropuestos: 3,
        bloqRevisador: 3,
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
        bloqRevisador: 3,
        bloqValidados: 1,
        genera: []
      }

    ];

    this.grupos = [
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
          bloqRevisador: 3,
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
            bloqRevisador: 3,
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
            bloqRevisador: 3,
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
          bloqRevisador: 3,
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
            bloqRevisador: 3,
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
            bloqRevisador: 3,
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
            bloqRevisador: 3,
            bloqValidados: 1,
            genera: []
          }
        ],
        pendientes: [{
          nombre: "us5",
          saldo: 123,
          correo: "String",
          idValidador: "String",
          bloqAprobados: 2,
          bloqPropuestos: 3,
          bloqRevisador: 3,
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
          bloqRevisador: 3,
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
            bloqRevisador: 3,
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
            bloqRevisador: 3,
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
          bloqRevisador: 3,
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
            bloqRevisador: 3,
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
            bloqRevisador: 3,
            bloqValidados: 1,
            genera: []
          }
        ],
        pendientes: [],
        historial: []
      }
    ];

    this.usuarios.forEach(val => this.usuariosCopia.push(Object.assign({}, val)));
    this.grupos.forEach(val => this.gruposCopia.push(Object.assign({}, val)));
    this.hayGrupos = this.arrayVacio(this.grupos);
    this.hayUsuarios = this.arrayVacio(this.usuarios);
    this.ruta = window.location.origin;

    if (this.id != undefined) {
      this.grupo = this.obtenerGrupo(this.id);
      this.grupo.miembros.forEach(val => {
        this.agregarUsuario(val);
      });
      this.camposEditar = true;
      this.titulo = "Editar grupo: " + this.grupo.nombre;
    } else {
      this.hayUsuariosAgregados = false;
      this.camposEditar = false;
      this.titulo = "Crear grupo";
    }
  }
}
