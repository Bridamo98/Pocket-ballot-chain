import { Component, OnInit } from '@angular/core';
import { Usuario } from './Modelo/Usuario';
import { Router } from '@angular/router';
import { UsuarioService } from './Servicios/usuario.service';

declare var $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit{

  title = 'pocket-ballot-chain';
  navigateValid = false;
  usuario: Usuario;

  constructor(private router: Router, private usuarioService: UsuarioService){}
  ngOnInit(): void {
    this.getUsuario();
  }

  toPerfil(){
    this.router.navigate(['/Perfil']);
  }
  toVotacionLista(){
    this.router.navigate(['/VotacionLista']);
  }
  toListarGrupos(){
    this.router.navigate(['/ListarGrupos']);
  }
  toPerfilEditar(){
    this.router.navigate(['/PerfilEditar']);
  }

  getUsuario(): void {
    this.usuarioService.getUsuario()
      .subscribe(
        result => {
          this.usuario = result;
          if (this.usuario === null || this.usuario === undefined) {
            this.navigateValid = false;
          }
          else{
            this.navigateValid = true;
          }
        }
      );
  }
  finalizarSesion(){
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
  }
}
