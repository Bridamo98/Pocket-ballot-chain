import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/Modelo/Usuario';
import { Votacion } from 'src/app/Modelo/Votacion';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-votacion-lista',
  templateUrl: './votacion-lista.component.html',
  styleUrls: ['./votacion-lista.component.css']
})
export class VotacionListaComponent implements OnInit {

  misVotaciones: Votacion[];
  votaciones: Votacion[];

  constructor(
    private router: Router,
    private rutaActiva: ActivatedRoute
  ) {
    //this.usuario.nombre = this.rutaActiva.snapshot.params.nombre;
   }

  ngOnInit(): void {
    this.iniciarVista();
  }

  iniciarVista(): void {
    this.getMisVotaciones();
    this.getVotaciones();
  }

  // Solicita al servicio mis votaciones
  getMisVotaciones(): void {
    this.misVotaciones = [
      {
        titulo: 'votacion 1',
        fechaLimite: new Date(),
        plantillaAsociada: 'plantilla-1',
        tipoDeVotacion: 'popular',
        participantes: [new Usuario('Brandonn', 0, 'bra@', '123'), new Usuario('Alice', 0, 'ali@', '456')],
        almacena: [],
        opcionDeVotacion: [],
        acesosExtra: []
      },
      {
        titulo: 'votacion 2',
        fechaLimite: new Date(),
        plantillaAsociada: 'plantilla-1',
        tipoDeVotacion: 'popular',
        participantes: [],
        almacena: [],
        opcionDeVotacion: [],
        acesosExtra: []
      }
    ];
  }

  // Solicita al servicio las votaciones
  getVotaciones(): void {
    this.votaciones = [
      {
        titulo: 'votacion3',
        fechaLimite: new Date(),
        plantillaAsociada: 'plantilla-1',
        tipoDeVotacion: 'popular',
        participantes: [],
        almacena: [],
        opcionDeVotacion: [],
        acesosExtra: []
      }
    ];
  }

  eliminar(votacion: Votacion, votaciones: Votacion[]): void {
    if(confirm('¿Está seguro de eliminar esta votación?')) {
      votaciones.splice(votaciones.indexOf(votacion), 1);
    }
  }

  ordenarPorTitulo(votaciones: Votacion[]): void {
    votaciones.sort(function (a, b) {
      let tituloA = a.titulo.toUpperCase();
      let tituloB = b.titulo.toUpperCase();
      if (tituloA < tituloB) {
        return -1;
      }
      if (tituloA > tituloB) {
        return 1;
      }
      return 0;
    });
  }

  ordenarPorParticipantes(votaciones: Votacion[]) {
    votaciones.sort(function (a, b) {
      return a.participantes.length - b.participantes.length;
    });
  }

  crearVotacion(): void {
    console.log('crearVotacion');
  }

  verInvitaciones(): void {
    console.log('verVotaciones');
  }
}
