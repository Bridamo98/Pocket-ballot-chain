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
  ) { }

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
        fechaLimite: new Date(),
        plantillaAsociada: 'plantilla-1',
        tipoDeVotacion: 'popular',
        participantes: [],
        almacena: [],
        opcionDeVotacion: [],
        acesosExtra: []
      },
      {
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
}
