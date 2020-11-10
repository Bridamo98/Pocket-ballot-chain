import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from 'src/app/Modelo/Usuario';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, Validators, AbstractControl, FormControl, ValidatorFn } from '@angular/forms';
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { CifradoService } from '../../../Servicios/Cifrado-Firma/cifrado.service';

declare var $: any;

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './usuario-editar.component.html',
  styleUrls: ['./usuario-editar.component.css']
})
export class UsuarioEditarComponent implements OnInit, OnDestroy {

  usuario: Usuario = new Usuario('', 0, '', '');
  existeNombre = false;
  formulario;
  usuarios: string[] = [];
  msgActualizacion: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private cifradoService: CifradoService
  ) {  }

  ngOnInit(): void {
    $(document).ready(function () {
      $('[data-toggle="popover"]').popover();
    });
    this.getUsuario();
    this.obtenerNombres();
  }

  ngOnDestroy(): void{
    $('#txtContrasenaConfirm').popover('dispose');
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
      ]),
      contrasena: new FormControl('', [
        this.contrasenaFormat()
      ]),
      contrasenaConfirm: new FormControl('', [
        this.contrasenaFormat(),
        this.coincidir()
      ])
    });
  }

  // Solicita al servicio el usuario
  getUsuario(): void {
    this.usuarioService.getUsuario()
      .subscribe(
        result => {
          this.usuario = result;
          if (this.usuario === null || this.usuario === undefined) {
            this.router.navigate(['/']);
          } else {
            this.iniciarVista();
          }
        }
      );
  }

  // Actualiza la información en la base de datos
  actualizar(nombre: string, correo: string, contrasena: string, contrasenaConfirm: string): void {
    let auxUsuario: Usuario = new Usuario('', 0, '', '');
    auxUsuario.nombre = nombre;
    auxUsuario.correo = correo;
    auxUsuario.saldo = this.usuario.saldo;
    if (contrasena.length > 0){
      auxUsuario.contrasena = this.cifradoService.getHashSha256(contrasena.trim());
    }else{
      auxUsuario.contrasena = this.usuario.contrasena;
    }
    if (contrasena.localeCompare(contrasenaConfirm) === 0){
      if (this.formulario.valid) {
        this.usuarioService.putUsuario(auxUsuario).subscribe(
          result => {
            const token = result['token'];
            if (token != null && token !== undefined)
            {
              localStorage.removeItem('token');
              localStorage.setItem('token', token);
              localStorage.removeItem('nombre');
              localStorage.setItem('nombre', this.usuario.nombre.toString());
            }
            this.obtenerNombres();
            this.msgActualizacion = "Información actualizada!";
            $('#confirmModal').modal('show');
          }
        );
      }
    }else{
      this.mostrarPopoverError('#txtContrasenaConfirm', 'contrasenaConfirm', 'No coincide con la contraseña');
    }
  }

  cerrar(): void{
    this.router.navigate(['Inicio']);
  }

  cancelar(formulario: NgForm): void {
    formulario.setValue({ nombre: this.usuario.nombre, correo: this.usuario.correo, contrasena: '', contrasenaConfirm: '' });
    $('#txtNombre').popover('dispose');
    $('#txtCorreo').popover('dispose');
    $('#txtContrasena').popover('dispose');
    $('#txtContrasenaConfirm').popover('dispose');
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

  get contrasena() { return this.formulario.get('contrasena'); }

  get contrasenaConfirm() { return this.formulario.get('contrasenaConfirm'); }

  alreadyExists(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const nombre: string = control.value;
      if (this.verificarNombre(nombre.trim().toLowerCase()) && control.value.localeCompare(this.usuario.nombre) !== 0) {
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
    if (this.formulario.get(nombre).errors !== undefined && this.formulario.get(nombre).errors !== null) {
      error = this.obtenerMsgPopover(Object.keys(this.formulario.get(nombre).errors)[0]);
      $(campo).popover({
        content: error
      });
      $(campo).popover('toggle');
    }
  }

  mostrarPopoverError(campo: string, nombre: string, mensaje: string): void {
    if (mensaje.length > 0){
      $(campo).popover('dispose');
      $(campo).popover({
        content: mensaje
      });
      $(campo).popover('toggle');
    }
  }

  obtenerMsgPopover(error: string): string {
    if (error === 'required') {
      return 'Campo requerido';
    }
    if (error === 'minlength') {
      return 'El nombre debe tener al menos 4 caracteres';
    }
    if (error === 'alreadyExists') {
      return 'Nombre en uso';
    }
    if (error === 'emailFormat') {
      return 'Formato incorrecto';
    }
    if (error === 'emailFormat') {
      return 'Formato incorrecto';
    }
    if (error === 'passwordFormat') {
      return 'La contraseña debe tener al menos 4 caracteres, una letra, un número, una mayúscula y un símbolo';
    }
    if (error === 'dontMatch') {
      return 'No coincide con la contraseña';
    }
  }

  contrasenaFormat(): ValidatorFn{
    const regexContrasena = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/;
    return (control: AbstractControl): { [key: string]: any } | null => {
      if ((!regexContrasena.test(control.value) || control.value.length < 4) && control.value.length > 0) {
        return { 'passwordFormat': true };
      } else {
        return null;
      }
    };
  }

  coincidir(): ValidatorFn{
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (this.formulario !== undefined){
        let contrasena = this.formulario.get('contrasena').value;
        if (control.value.localeCompare(contrasena) !== 0 &&
          contrasena.length > 0) {
          return { 'dontMatch': true };
        }
      } else{
        return null;
      }
    };
  }
}
