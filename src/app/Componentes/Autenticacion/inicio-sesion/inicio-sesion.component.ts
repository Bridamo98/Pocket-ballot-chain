import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Modelo/Usuario';
import { UsuarioService } from '../../../Servicios/Usuario/usuario.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover/popover';
import {
  NgForm,
  FormBuilder,
  Validators,
  AbstractControl,
  FormControl,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css'],
})
export class InicioSesionComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    usuarioService: UsuarioService
  ) {
    this.usuarioService = usuarioService;
    if (this.usuarioService.estaLogeado()){
      this.router.navigate(['/Perfil']);
    }
  }
  correo: String;
  contrasena: String;
  usuarioService: UsuarioService;
  usuario: Usuario = new Usuario('', 0, '', '');
  formulario;
  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      correo: new FormControl(this.usuario.correo, [Validators.required]),
      contrasena: new FormControl(this.usuario.nombre, [Validators.required]),
    });
  }

  element: HTMLElement;

  async iniciarSesion(popContra, popUsuario) {
    this.disMissAlertDanger('contrasena');
    this.disMissAlertDanger('nombre');
    if (this.correo != null && this.correo != '' && this.correo != undefined) {
      if (
        this.contrasena != null &&
        this.contrasena != '' &&
        this.contrasena != undefined
      ) {
        popUsuario.close();
        popContra.close();
        this.usuario = {
          contrasena: this.contrasena,
          nombre: this.correo,
          saldo: 0,
          correo: this.correo,
          idValidador: null,
          bloqAprobados: null,
          bloqPropuestos: null,
          bloqRevisados: null,
          bloqValidados: null,
          genera: null,
        };
        try {
          await this.usuarioService.iniciarSesion(this.usuario);
          popUsuario.close();
          this.router.navigate(['Perfil']);
        } catch (error) {
          popUsuario.popoverTitle = '';
          popUsuario.ngbPopover = 'Usuario o contraseña no existe';
          popUsuario.open();
        }
      } else {
        popUsuario.close();
        popContra.open();
        this.alertDanger('contrasena');
      }
    } else {
      popUsuario.open();
      popContra.close();
      this.alertDanger('nombre');
    }
  }
  alertDanger(id: string) {
    this.element = document.getElementById(id) as HTMLElement;
    this.element.classList.add('alert');
    this.element.classList.add('alert-danger');
  }
  disMissAlertDanger(id: string) {
    this.element = document.getElementById(id) as HTMLElement;
    this.element.classList.remove('alert');
    this.element.classList.remove('alert-danger');
  }
  emailFormat(): ValidatorFn {
    let rExp = RegExp('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}');
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (!rExp.test(control.value)) {
        return { emailFormat: true };
      } else {
        return null;
      }
    };
  }
}
