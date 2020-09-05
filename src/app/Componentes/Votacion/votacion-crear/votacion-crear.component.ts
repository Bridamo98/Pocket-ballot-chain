import { Component, OnInit } from '@angular/core';
import { VotacionService } from './../../../Servicios/votacion.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Votacion } from 'src/app/Modelo/Votacion';
import { Opcion } from 'src/app/Modelo/Opcion';
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { Usuario } from 'src/app/Modelo/Usuario';
import { CifradoService } from './../../../Servicios/Cifrado-Firma/cifrado.service'

@Component({
  selector: 'app-votacion-crear',
  templateUrl: './votacion-crear.component.html',
  styleUrls: ['./votacion-crear.component.css']
})
export class VotacionCrearComponent implements OnInit {
  usuario: Usuario;
  cantiVotos = 1;
  msgErrorFecha: string;
  msgErrorCredenciales: string;
  opciones = [
    {id:1, nombre:"Voto popular", descripcion:"descripcion de voto popular"}, 
    {id:2, nombre:'Voto ranking', descripcion:'descripcion para los votos por ranking'}, 
    {id:3, nombre:'Voto clasificación', descripcion:'descripcion para las votaciones por clasificación'}];

  public elemento: HTMLElement;

  constructor(public cifradoService:CifradoService, public votacionService: VotacionService, private modalService: NgbModal, private router: Router, private usuarioService: UsuarioService) { 
  }

  ngOnInit() {    

    let hola1 = this.cifradoService.encrypt('hola');
    let hola2 = this.cifradoService.encrypt('hola');
    console.log('Primero: ' + hola1);
    console.log('Segundo: ' + hola2);
    console.log(this.cifradoService.decrypt(this.cifradoService.encrypt('hola')));
    console.log(this.cifradoService.decrypt(hola1));
    console.log(this.cifradoService.decrypt(hola2));


    this.getUsuario();
    this.activateSelectedListener();
  }

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

  activateSelectedListener(){
    //listener hover cards
    var cuadro = document.getElementsByClassName('selected') as HTMLCollectionOf<HTMLElement>;
    for(var i = 0; i < cuadro.length; i++){
        this.elemento = cuadro[i];
        cuadro[i].addEventListener("mouseover",function() {
          this.classList.add("bg-secondary");
          this.classList.remove("bg-light");
          this.classList.add("text-white");
          this.style.cursor = "pointer";
        });
        cuadro[i].addEventListener("mouseout",function() {
          this.classList.remove("bg-secondary");
          this.classList.remove("text-white");
          this.classList.add("gb-light");
        });
    }
  }


  fechaError(){
      let expresionRegular = /[0-9]/;    
  }

  popular(modal){
    this.modalService.open(modal);
  }

  navigatePopular(){
    this.router.navigate(['CrearVotacion/Popular/' + this.cantiVotos]);
  }

  navigateRanking(){
    this.router.navigate(['CrearVotacion/Ranking']);
  }

  navigateClasificacion(){
    this.router.navigate(['CrearVotacion/Clasificacion']);
  }

  open(){
    this.router.navigate(['CrearVotacion/Info']);
  }

}
