import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/Modelo/Usuario';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-usuario-editar',
  templateUrl: './usuario-editar.component.html',
  styleUrls: ['./usuario-editar.component.css']
})
export class UsuarioEditarComponent implements OnInit {

  usuario: Usuario = new Usuario('', 0, '', '');
  existeNombre = false;

  constructor(
    private router: Router,
    private rutaActiva: ActivatedRoute
  ) {
    this.usuario.nombre = this.rutaActiva.snapshot.params.name;
  }

  ngOnInit(): void {
    this.iniciarVista();
  }

  iniciarVista(): void {
    this.getUsuario();
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
}
