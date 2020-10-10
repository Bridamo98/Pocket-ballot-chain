import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Modelo/Usuario';
import { UsuarioService } from '../../../Servicios/Usuario/usuario.service'
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NgForm, FormBuilder, Validators, AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {

  nombre: string;
  correo: string;
  contrasenia: string;
  verificar: string;
  htmlToAdd: string;
  formulario;
  usuario: Usuario = new Usuario("", 0, '', '');
  usuarioService: UsuarioService;
  constructor(private formBuilder: FormBuilder, usuarioService2: UsuarioService, @Inject(DOCUMENT) document) {
    this.usuarioService = usuarioService2;
  }

  element: HTMLElement;



  registrarse(popCorreo, popName, popContra, popConfirm) {
    popCorreo.close();
    popName.close();
    popContra.close();
    popConfirm.close();
    this.disMissAlertDanger('correo');
    this.disMissAlertDanger('nombre');
    this.disMissAlertDanger('contrasenia');
    this.disMissAlertDanger('verificar');
    if (this.verificar == this.contrasenia) {
      this.htmlToAdd = "Registrado";
      this.usuario = {
        contrasena: this.contrasenia,
        nombre: this.nombre,
        saldo: 0,
        correo: this.correo,
        idValidador: null,
        bloqAprobados: null,
        bloqPropuestos: null,
        bloqRevisados: null,
        bloqValidados: null,
        genera: null
      };
      this.usuarioService.addUsuario(this.usuario);
    }
    else {
      popConfirm.popoverTitle = ''
      popConfirm.ngbPopover = 'Esta contraseña debe coincidir con la de arriba'
      popConfirm.open();
      this.alertDanger('verificar')
    }
  }
  ngOnInit(): void {
    this.formulario = this.formBuilder.group({
      nombre: new FormControl(this.usuario.nombre, [
        Validators.required,
        Validators.minLength(4),
      ]),
      correo: new FormControl(this.usuario.correo, [
        Validators.required,
        this.emailFormat(),
      ]),
      contrasenia: new FormControl(this.usuario.nombre, [
        Validators.required,
        Validators.minLength(4),
      ]),
      contrasenia2: new FormControl(this.usuario.nombre, [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  alertDanger(id: string) {
    this.element = document.getElementById(id) as HTMLElement;
    this.element.classList.add("alert");
    this.element.classList.add("alert-danger");
  }
  disMissAlertDanger(id: string) {
    this.element = document.getElementById(id) as HTMLElement;
    this.element.classList.remove("alert");
    this.element.classList.remove("alert-danger");
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




}

