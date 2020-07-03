import { Component, OnInit, Input } from '@angular/core';

import { GrupoService } from './../../../Servicios/grupo.service'

import { Grupo, Relacion } from '../../../Modelo/Grupo';
import { Usuario } from '../../../Modelo/Usuario';

@Component({
  selector: 'app-grupo-crear',
  templateUrl: './grupo-crear.component.html',
  styleUrls: ['./grupo-crear.component.css']
})

export class GrupoCrearComponent implements OnInit {
  @Input() id: number;//Del grupo, cuando se quiere editar
  titulo: string;//editar o crear

  ruta: string;//Para invocar a verGrupo

  mostrarUsuarios: boolean = true;
  grupo: Grupo = new Grupo();

  usuarios: Usuario[] = [];
  usuariosCopia: Usuario[] = [];
  grupos: Grupo[] = [];
  gruposCopia: Grupo[] = [];
  nuevosMiembros:Usuario[] = [];

  relacion: Relacion = new Relacion();

  usuariosSeleccionados: Usuario[] = [];
  gruposSeleccionados: Grupo[] = [];

  hayGrupos: boolean;
  hayUsuarios: boolean;
  hayGruposAgregados: boolean = false;
  hayUsuariosAgregados: boolean;
  camposEditar: boolean;

  buscadorGrupo: String = "";
  buscadorUsuario: String = "";

  iniciado:string = "Usuario1";

  constructor(public grupoService: GrupoService) {
    this.grupo.miembros = [];
    this.grupo.pendientes = [];
   }

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
        return !(res.id == g.id);
      }
    );
    g.miembros.forEach(val => {
      console.log("val: " + val.nombre);
      console.log(this.grupo.miembros.some(usu => {
        console.log(usu.nombre + " " + val.nombre);
        return !usu.nombre.localeCompare(val.nombre);
      }));
      if (!this.grupo.miembros.some(usu => !usu.nombre.localeCompare(val.nombre))) {
        this.grupo.miembros.push(Object.assign({}, val));
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
        this.grupo.miembros = this.grupo.miembros.filter(
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
    if (!this.grupo.miembros.some(usu => !usu.nombre.localeCompare(u.nombre))) {
      this.grupo.miembros.push(Object.assign({}, u));
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
      this.grupo.miembros = this.grupo.miembros.filter(
        res => {
          return res.nombre.localeCompare(u.nombre.toString());
        }
      );
    }
    this.filtrarUsuarios();
    this.hayUsuarios = this.arrayVacio(this.usuarios);
    this.hayUsuariosAgregados = this.arrayVacio(this.usuariosSeleccionados);
  }

  eliminarPendiente(u, i):void{

  }

  importar(): void {

  }

  crearGrupo(): boolean {
    this.grupo.creador = this.iniciado;
    this.grupoService.agregarGrupo(this.grupo).subscribe(res=>{
      console.log(res);     
      this.grupo.miembros.forEach(val=>{
        this.relacion.idUsuario = val.nombre.toString();
        this.relacion.idGrupo = res.id;
        this.grupoService.agregarPendiente(this.relacion).subscribe(res=>{
          console.log(res);
        })
      });
    });
    return false;
  }

  actualizarGrupo(): boolean {
    this.grupoService.actualizarGrupo(this.grupo).subscribe(res=>{
      console.log(res);
      this.grupoService.eliminarMiembros(this.grupo.id).subscribe(res=>{
        console.log(res);
        this.grupo.miembros.forEach(val => {
          this.relacion.idUsuario = val.nombre.toString();
          this.relacion.idGrupo = this.grupo.id;
          this.grupoService.agregarMiembro(this.relacion).subscribe(res => {
            console.log(res);
          });
        });
      });
    });
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

  obtenerGrupo(id: number): Grupo {
    return this.grupos.filter(res => { return !(res.id == id); })[0];
  }

  mostrar(): void {
    this.mostrarUsuarios = !this.mostrarUsuarios;
  }

  ngOnInit(): void {

    this.grupoService.obtenerGrupos().subscribe(res => {
      this.grupos = res
      console.log(this.grupos);
      this.grupos.forEach(val => {
        this.grupoService.obtenerMiembrosDeGrupo(val.id).subscribe(res => {
          val.miembros = res;
          this.gruposCopia.push(Object.assign({}, val))
        });
      });
      console.log(this.gruposCopia);
      this.hayGrupos = this.arrayVacio(this.grupos);
    });

    this.grupoService.obtenerUsuarios().subscribe(res => {
      this.usuarios = res;
      this.usuarios.forEach(val => this.usuariosCopia.push(Object.assign({}, val)));
      this.hayUsuarios = this.arrayVacio(this.usuarios);

      if (this.id != undefined) {
        this.grupoService.obtenerGrupo(this.id).subscribe(res => {
          this.grupo = res;
          this.grupoService.obtenerMiembrosDeGrupo(res.id).subscribe(res2 => {
            this.grupo.miembros = res2;
            console.log("res2");   
            console.log(res2);
            this.grupo.miembros.forEach(val => {
              console.log(val);
              this.agregarUsuario(val);
              this.usuarios = this.usuarios.filter(
                res => {
                  return res.nombre.localeCompare(val.nombre.toString());
                }
              );  
            });
            this.filtrarUsuarios();
          });
          this.grupoService.obtenerPendientes(res.id).subscribe(res2 => {
            this.grupo.pendientes = res2;

          });
        });
        this.camposEditar = true;
        this.titulo = "Editar grupo: " + this.grupo.nombre;
      } else {
        this.hayUsuariosAgregados = false;
        this.camposEditar = false;
        this.titulo = "Crear grupo";
      }
      this.ruta = window.location.origin;
    });
  }
}
