import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/Modelo/Usuario';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, Validators, AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { UsuarioService } from 'src/app/Servicios/usuario.service';

declare var $: any;

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './usuario-editar.component.html',
  styleUrls: ['./usuario-editar.component.css']
})
export class UsuarioEditarComponent implements OnInit {

  usuario: Usuario = new Usuario('', 0, '', '');
  existeNombre = false;
  formulario;
  usuarios: string[] = [];
  msgActualizacion: string;

  constructor(
    private router: Router,
    private rutaActiva: ActivatedRoute,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    this.usuario.nombre = this.rutaActiva.snapshot.params.nombre;
  }

  ngOnInit(): void {
    $(document).ready(function () {
      $('[data-toggle="popover"]').popover();
    });
    this.getUsuario();
    this.obtenerNombres();
  }

  iniciarVista(): void {
    this.formulario = this.formBuilder.group({
      nombre: new FormControl(this.usuario.nombre, [
        Validators.required,
        Validators.minLength(4),
        this.alreadyExists()
      ]),
      correo: new FormControl(this.usuario.correo, [
        Validators.required,
        this.emailFormat()
      ])
    });
  }

  // Solicita al servicio el usuario
  getUsuario(): void {
    this.usuarioService.getUsuario()
      .subscribe(
        result => {
          this.usuario = result;
          this.iniciarVista();
        }
      );
  }

  // Actualiza la información en la base de datos
  actualizar(nombre: string, correo: string): void {
    let nombreViejo = this.usuario.nombre.toString();
    this.usuario.nombre = nombre;
    this.usuario.correo = correo;
    this.usuarioService.putUsuario(this.usuario, nombreViejo).subscribe(
      result => {
        this.obtenerNombres();
        this.msgActualizacion = "Información actualizada!";
        $('#confirmModal').modal('show');
      }
    );
  }

  cancelar(formulario: NgForm): void {
    formulario.setValue({ nombre: this.usuario.nombre, correo: this.usuario.correo });
    $('#txtNombre').popover('dispose');
    $('#txtCorreo').popover('dispose');
  }

  verificarNombre(nombre: string): boolean {
    return this.usuarios.includes(nombre);
  }

  obtenerNombres(): void {
    this.usuarioService.getUsuarios()
      .subscribe(
        result => {
          this.usuarios = [];
          result.forEach(element => this.usuarios.push(element.nombre.toString()));
        }
      );
  }

  get nombre() { return this.formulario.get('nombre'); }

  get correo() { return this.formulario.get('correo'); }

  alreadyExists(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.verificarNombre(control.value) && control.value.localeCompare(this.usuario.nombre) !== 0) {
        return { 'alreadyExists': true };
      } else {
        return null;
      }
    };
  }

  emailFormat(): ValidatorFn {
    let rExp = RegExp('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}');
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!rExp.test(control.value)) {
        return { 'emailFormat': true };
      } else {
        return null;
      }
    };
  }

  mostrarPopover(campo: string, nombre: string): void {
    let error: string;
    $(campo).popover('dispose');
    if(this.formulario.get(nombre).errors != undefined) {
      error = this.obtenerMsgPopover(Object.keys(this.formulario.get(nombre).errors)[0]);
      $(campo).popover({
        content: error
      });
      $(campo).popover('toggle');
    }
  }

  obtenerMsgPopover(error: string): string {
    if(error === 'required') {
      return 'Campo requerido';
    }
    if(error === 'minlength') {
      return 'El nombre debe tener al menos 4 caracteres';
    }
    if(error === 'alreadyExists') {
      return 'Nombre en uso';
    }
    if(error === 'emailFormat') {
      return 'Formato incorrecto';
    }
  }
}
