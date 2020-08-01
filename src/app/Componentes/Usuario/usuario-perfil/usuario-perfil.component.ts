import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Modelo/Usuario';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../../../Servicios/usuario.service';

@Component({
  selector: 'app-usuario-perfil',
  templateUrl: './usuario-perfil.component.html',
  styleUrls: ['./usuario-perfil.component.css']
})
export class UsuarioPerfilComponent implements OnInit {

  usuario: Usuario = new Usuario('', 0, '', '');

  constructor(
    private router: Router,
    private rutaActiva: ActivatedRoute,
    private usuarioService: UsuarioService
  ) {  }

  ngOnInit(): void {
    this.iniciarVista();
  }

  iniciarVista(): void {
    this.getUsuario();
  }

  // Solicita al servicio el usuario
  getUsuario(): void {
    this.usuarioService.getUsuario()
      .subscribe(
        result => {
          this.usuario = result;
          if (this.usuario === null || this.usuario === undefined) {
            this.router.navigate(['/']);
          }
        }
      );
  }

  editarPerfil(): void {
    this.router.navigate(['PerfilEditar']);
  }

  serValidador(): void {
    this.router.navigate(['ValidadorPostularse']);
  }

}
