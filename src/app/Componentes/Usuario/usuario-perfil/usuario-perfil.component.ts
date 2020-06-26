import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Modelo/Usuario';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-usuario-perfil',
  templateUrl: './usuario-perfil.component.html',
  styleUrls: ['./usuario-perfil.component.css']
})
export class UsuarioPerfilComponent implements OnInit {

  usuario: Usuario = new Usuario('', 0, '', '');

  constructor(
    private router: Router,
    private rutaActiva: ActivatedRoute
  ) {
    this.usuario.nombre = this.rutaActiva.snapshot.params.nombre;
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

  editarPerfil(): void {
    this.router.navigate(['perfil-editar/'+this.usuario.nombre]);
  }

  serValidador(): void {
    this.router.navigate(['validador-postularse/'+this.usuario.nombre]);
  }

}
