import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/Modelo/Usuario';
import { UsuarioService } from '../../../Servicios/usuario.service';
import { Router } from '@angular/router';

//peer handler
declare var usuarioPeer: any;

@Component({
  selector: 'app-validador-postularse',
  templateUrl: './validador-postularse.component.html',
  styleUrls: ['./validador-postularse.component.css'],
})
export class ValidadorPostularseComponent implements OnInit {
  usuario: Usuario = new Usuario('', 0, '', '');

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUsuario();
  }

  serValidador(): void {
    this.router.navigate(['Validador']);
  }

  getUsuario(): void {
    this.usuarioService.getUsuario().subscribe((result) => {
      this.usuario = result;
      usuarioPeer = this.usuario.nombre.toString();
    });
  }
}
