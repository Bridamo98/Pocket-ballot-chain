import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, FormBuilder, Validators, AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';



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

  formulario;
  ruta: string;//Para invocar a verGrupo

  mostrarUsuarios: boolean = true;//más detalles
  grupo: Grupo = new Grupo();

  usuarios: Usuario[] = [];//todos los usuarios en el sistema
  usuariosCopia: Usuario[] = [];//para los filtros
  grupos: Grupo[] = [];//todos los grupos del sistema
  gruposCopia: Grupo[] = [];//para los filtros

  usuarioAux:Usuario;
  indiceAux:number;

  nuevosMiembros: Usuario[] = [];//NO SE USA

  relacion: Relacion = new Relacion();//la relacion del grupo con el usuario iniciado

  usuariosSeleccionados: Usuario[] = [];//usuarios seleccionados para hacer parte del grupo
  gruposSeleccionados: Grupo[] = [];//grupos seleccionados para hacer parte del grupo

  hayGrupos: boolean;//Para mostrar mensajes de inexistencia de listas
  hayUsuarios: boolean;//.........
  hayGruposAgregados: boolean = false;//.........
  hayUsuariosAgregados: boolean;//.........

  camposEditar: boolean;//editar o crear

  buscadorGrupo: String = "";//para filtro
  buscadorUsuario: String = "";//para filtro

  iniciado: string = "Usuario1";//QUEMADO

  constructor(public grupoService: GrupoService, private modalService: NgbModal, private formBuilder: FormBuilder, private router: Router) {
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

      if(this.camposEditar){
        if (!this.grupo.pendientes.some(usu => !usu.nombre.localeCompare(val.nombre)) && !this.grupo.miembros.some(usu => !usu.nombre.localeCompare(val.nombre))) {
          this.grupo.pendientes.push(Object.assign({}, val));
          //this.usuariosSeleccionados.push(Object.assign({}, val));
          this.usuarios = this.usuarios.filter(
            res => {
              return res.nombre.localeCompare(val.nombre);
            }
          );
        }
      }else{
        if (!this.grupo.miembros.some(usu => !usu.nombre.localeCompare(val.nombre))) {
          this.grupo.miembros.push(Object.assign({}, val));
          this.usuarios = this.usuarios.filter(
            res => {
              return res.nombre.localeCompare(val.nombre);
            }
          );
        }
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
      
      if(this.camposEditar){
        if (!this.usuarios.some(usu => !usu.nombre.localeCompare(val.nombre.toString())) && this.grupo.pendientes.some(usu => !usu.nombre.localeCompare(val.nombre.toString())) ) {
          this.usuarios.push(Object.assign({}, val));
          this.grupo.pendientes = this.grupo.pendientes.filter(
            res => {
              return res.nombre.localeCompare(val.nombre.toString());
            }
          );
          this.usuariosSeleccionados = this.usuariosSeleccionados.filter(
            res =>{
              return res.nombre.localeCompare(val.nombre.toString());
            }
          )
        }
      }else{
        if (!this.usuarios.some(usu => !usu.nombre.localeCompare(val.nombre.toString()))) {
          this.usuarios.push(Object.assign({}, val));
          this.grupo.miembros = this.grupo.miembros.filter(
            res => {
              return res.nombre.localeCompare(val.nombre.toString());
            }
          );
        }
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
    if(this.camposEditar){
      if(this.grupo.pendientes){
        if (!this.grupo.pendientes.some(usu => !usu.nombre.localeCompare(u.nombre))) {
          this.grupo.pendientes.push(Object.assign({}, u));
          this.usuarios = this.usuarios.filter(
            res => {
              return res.nombre.localeCompare(u.nombre);
            }
          );

        }
      }
      
    }else{
      if (!this.grupo.miembros.some(usu => !usu.nombre.localeCompare(u.nombre))) {
        this.grupo.miembros.push(Object.assign({}, u));
        this.usuarios = this.usuarios.filter(
          res => {
            return res.nombre.localeCompare(u.nombre);
          }
        );

      }
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

  eliminarPendiente(u, i): void {
    this.usuariosSeleccionados = this.usuariosSeleccionados.filter(
      res =>{
        return res.nombre.localeCompare(u.nombre.toString());
      }
    )
    if (!this.usuarios.some(usu => !usu.nombre.localeCompare(u.nombre.toString()))) {
      this.usuarios.push(Object.assign({}, u));
      this.grupo.pendientes = this.grupo.pendientes.filter(
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

  confirmacion(modal): boolean {
    this.modalService.open(modal);
    return false;
  }

  confirmacionEliminar(modal, u:Usuario, i:number): boolean {
    this.usuarioAux = u;
    this.indiceAux = i;
    this.modalService.open(modal);
    return false;
  }

  crearGrupo(nombre: string, descripcion: string): boolean {
    this.grupo.creador = this.iniciado;
    this.grupo.nombre = nombre;
    this.grupo.descripcion = descripcion;
    this.grupoService.agregarGrupo(this.grupo).subscribe(res => {
      console.log(res);
      this.grupo.miembros.forEach(val => {
        this.relacion.idUsuario = val.nombre.toString();
        this.relacion.idGrupo = res.id;
        this.grupoService.agregarPendiente(this.relacion).subscribe(res => {
          console.log(res);
        })
      });
      this.router.navigate(['VerGrupo/propios/' + res.id]);

    });

    return false;
  }

  actualizarGrupo(nombre: string, descripcion: string): boolean {
    this.grupo.nombre = nombre;
    this.grupo.descripcion = descripcion;

    this.grupoService.actualizarGrupo(this.grupo).subscribe(res => {
      console.log(res);
      this.grupoService.eliminarMiembros(this.grupo.id).subscribe(res => {
        console.log(res);
        this.grupo.miembros.forEach(val => {
          let relacion = new Relacion();
          relacion.idUsuario = val.nombre.toString();
          relacion.idGrupo = this.grupo.id;
          this.grupoService.agregarMiembro(relacion).subscribe(res => {
            console.log(res);
          });
        });
      });

      this.grupoService.eliminarPendientes(this.grupo.id).subscribe(res => {
        console.log(res);
        this.grupo.pendientes.forEach(val => {
          let relacion = new Relacion();
          relacion.idUsuario = val.nombre.toString();
          relacion.idGrupo = this.grupo.id;
          this.grupoService.agregarPendiente(relacion).subscribe(res => {
            console.log(res);
          });
        });
      });
      console.log("res "+res.id);
      
      this.router.navigate(['VerGrupo/propios/' + this.grupo.id]);

      
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





  alreadyExists(): ValidatorFn {//listo
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.camposEditar) {
        if (this.grupos.some(res => !res.nombre.localeCompare(control.value)) && control.value.localeCompare(this.grupo.nombre) !== 0) {
          return { 'alreadyExists': true };
        } else {
          return null;
        }
      } else {
        if (this.grupos.some(res => !res.nombre.localeCompare(control.value))) {
          return { 'alreadyExists': true };
        } else {
          return null;
        }
      }

    };
  }

  iniciarVista(): void {//luego de obtener el grupo en EDITAR, en cualquier momento en CREAR //listo
    this.formulario = this.formBuilder.group({
      nombre: new FormControl(this.grupo.nombre, [
        Validators.required,
        Validators.minLength(4),
        this.alreadyExists()
      ]),
      descripcion: new FormControl(this.grupo.descripcion, [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100)
      ])
    });
  }

  cancelar(formulario: NgForm): void {
    formulario.setValue({ nombre: this.grupo.nombre, descripcion: this.grupo.descripcion });
    //resetear los nuevos usuarios agregados -> los cuales se traducen en solicitudes
  }

  get nombre() { return this.formulario.get('nombre'); }

  get descripcion() { return this.formulario.get('descripcion'); }

  formularioInvalido(formulario: NgForm): boolean {
    return formulario.invalid.valueOf() || (this.grupo.miembros.length == 0 && this.grupo.pendientes.length == 0);
  }

  esPendiente(u: Usuario):boolean{
    return this.grupo.pendientes.some(res=> !res.nombre.localeCompare(u.nombre.toString()));
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
          this.titulo = "Editar grupo: " + this.grupo.nombre;
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
              this.filtrarUsuarios();

            });

            this.grupoService.obtenerPendientes(res.id).subscribe(res2 => {
              this.grupo.pendientes = res2;
              this.grupo.pendientes.forEach(val => {
                console.log(val);
                this.agregarUsuario(val);
                this.usuarios = this.usuarios.filter(
                  res => {
                    return res.nombre.localeCompare(val.nombre.toString());
                  }
                );
                this.filtrarUsuarios();
              });
              
            });
            this.iniciarVista();
          });
          
        });
        this.camposEditar = true;

      } else {
        this.iniciarVista();
        this.hayUsuariosAgregados = false;
        this.camposEditar = false;
        this.titulo = "Crear grupo";
      }
      this.ruta = window.location.origin;
    });
  }
}
