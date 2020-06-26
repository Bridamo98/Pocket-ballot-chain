import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/Modelo/Usuario';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormBuilder, Validators, AbstractControl, FormControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './usuario-editar.component.html',
  styleUrls: ['./usuario-editar.component.css']
})
export class UsuarioEditarComponent implements OnInit {

  usuario: Usuario = new Usuario('', 0, '', '');
  existeNombre = false;
  formulario;

  constructor(
    private router: Router,
    private rutaActiva: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
    this.usuario.nombre = this.rutaActiva.snapshot.params.nombre;
  }

  ngOnInit(): void {
    this.iniciarVista();
  }

  iniciarVista(): void {
    this.getUsuario();
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
    /**this.service.getUsuario()
     * .subscribe(
     * result => (this.usuario = result)
     * );
    **/
    this.usuario = {
      nombre: 'Brandonn_C',
      saldo: 50000,
      correo: 'brandonn@gmail.com',
      idValidador: '123',
      bloqAprobados: 2,
      bloqPropuestos: 10,
      bloqRevisados: 2,
      bloqValidados: 0,
      genera: []
    };
  }

  // Actualiza la información en la base de datos
  actualizar(nombre: string, correo: string): void {
    this.usuario.nombre = nombre;
    this.usuario.correo = correo;
    // Llamar al servicio para actualizar
  }

  cancelar(formulario: NgForm): void {
    formulario.setValue( {nombre: this.usuario.nombre, correo: this.usuario.correo} );
  }

  verificarNombre(nombre: string): void {
    // verificación
    this.existeNombre = this.verificarEjemplo(nombre);
  }

  verificarEjemplo(nombre: string): boolean {
    let nombres: string[] = ['Alice', 'Bob', 'John'];
    return nombres.includes(nombre);
  }

  get nombre() { return this.formulario.get('nombre'); }

  get correo() { return this.formulario.get('correo'); }

  alreadyExists(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if(this.verificarEjemplo(control.value)){
        return {'alreadyExists': true};
      }else {
        return null;
      }
    };
  }

  emailFormat(): ValidatorFn {
    let rExp = RegExp('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}');
    return (control: AbstractControl): {[key: string]: any} | null => {
      if(!rExp.test(control.value)){
        return {'emailFormat': true};
      }else {
        return null;
      }
    };
  }
}
