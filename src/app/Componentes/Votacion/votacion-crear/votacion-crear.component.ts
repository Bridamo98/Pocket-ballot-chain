import { Component, OnInit } from '@angular/core';
import { VotacionService } from './../../../Servicios/votacion.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Votacion } from 'src/app/Modelo/Votacion';
import { Opcion } from 'src/app/Modelo/Opcion';
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { Usuario } from 'src/app/Modelo/Usuario';
import { CifradoService } from './../../../Servicios/Cifrado-Firma/cifrado.service';

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
  idGrupo: number;
  opciones = [
    {id:1, nombre:"Voto popular", descripcion:"descripcion de voto popular"}, 
    {id:2, nombre:'Voto ranking', descripcion:'descripcion para los votos por ranking'}, 
    {id:3, nombre:'Voto clasificación', descripcion:'descripcion para las votaciones por clasificación'}];

  public elemento: HTMLElement;

  constructor(public cifradoService:CifradoService, private rutaActiva: ActivatedRoute, public votacionService: VotacionService, private modalService: NgbModal, private router: Router, private usuarioService: UsuarioService) { 
    this.idGrupo = this.rutaActiva.snapshot.params.grupo;
    console.log("ID GRUPO: " + this.idGrupo);
  }

  ngOnInit() {    

    //let sig = this.cifradoService.getSignature();
    let message = "hola";
    console.log('message: ' + message);
    //console.log('sig: ' + sig);
    let firmado = this.cifradoService.sign(message);
    console.log('messageSig: ' + firmado);
    //console.log('verifyTrue: ' + this.cifradoService.checkSing('hola', firmado));
    //console.log('verifyFalse: ' + this.cifradoService.checkSing('adios', firmado));


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
    if(this.idGrupo != undefined){
      this.router.navigate(['CrearVotacion/Popular/' + this.cantiVotos + '/' + this.idGrupo]);
    }
    else{
      this.router.navigate(['CrearVotacion/Popular/' + this.cantiVotos]);
    }
  }

  navigateRanking(){
    if(this.idGrupo != undefined){
      this.router.navigate(['CrearVotacion/Ranking' + '/' + this.idGrupo]);
    }
    else{
      this.router.navigate(['CrearVotacion/Ranking']);
    }
  }

  navigateClasificacion(){
    if(this.idGrupo != undefined){
      this.router.navigate(['CrearVotacion/Clasificacion' + '/' + this.idGrupo]);
    }
    else{
      this.router.navigate(['CrearVotacion/Clasificacion']);
    }
  }

  open(){
    this.router.navigate(['CrearVotacion/Info']);
  }

}