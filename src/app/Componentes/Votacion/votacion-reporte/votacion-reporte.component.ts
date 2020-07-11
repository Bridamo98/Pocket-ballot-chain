import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Votacion } from '../../../Modelo/Votacion';
import { Usuario } from 'src/app/Modelo/Usuario';
import { VotacionService } from 'src/app/Servicios/votacion.service';
import { OpcionService } from '../../../Servicios/Opcion/opcion.service';
import { TipoVotacion } from '../../../Modelo/TipoVotacion';

@Component({
  selector: 'app-votacion-reporte',
  templateUrl: './votacion-reporte.component.html',
  styleUrls: ['./votacion-reporte.component.css']
})
export class VotacionReporteComponent implements OnInit {

  votacion: Votacion = new Votacion();

  //canvas
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  ctx;
  ejeLong = 250;
  dsp: number = 20;
  maxX: number = 300;
  maxY: number = 300;
  votos: number[] = [];
  maxVal: number = -1;
  tipoVotacion: TipoVotacion = new TipoVotacion();

  constructor(
    private router: Router,
    private rutaActiva: ActivatedRoute,
    private votacionService: VotacionService,
    private opcionService: OpcionService
  ) {
    this.votacion.id = this.rutaActiva.snapshot.params.id;
  }

  ngOnInit(): void {
    this.votacion = {
      titulo: '',
      autor: '',
      id: this.votacion.id,
      fechaLimite: new Date(),
      plantillaAsociada: '',
      tipoDeVotacion: -1,
      descripcion: '',
      votos: 0,
      participantes: [],
      almacena: [],
      opcionDeVotacion: [],
      accesosExtra: []
    };
    this.tipoVotacion = { id: -1, nombre: '', descripcion: '' }
    this.getVotacion();
  }

  // Solicita al servicio la votación
  getVotacion(): void {
    this.votacionService.getVotacion(this.votacion.id.valueOf()).subscribe(
      result => {
        this.votacion = result;
        this.actualizarTipo(this.votacion);
        this.actualizarParticipantes(this.votacion);
        this.actualizarVotos(this.votacion);
        this.actualizarOpciones(this.votacion);
      }
    );
  }

  // Seguramente debe ser reemplazada esta función si se hace la correción
  contarVotos(): void {
    for (let i = 0; i<this.votacion.opcionDeVotacion.length; i++) {
      this.votos.push(0);
    }
    for (const v of this.votacion.almacena) {
      this.votos[v.infoVoto.valueOf()]++;
    }
    this.dibujar();
  }

  dibujar(): void {
    this.canvas.nativeElement.width = this.maxX;
    this.canvas.nativeElement.height = this.maxY;
    this.maxY -= this.dsp;
    this.ctx = this.canvas.nativeElement.getContext("2d");
    this.calcularMaximo();
    let ancho = this.ejeLong / this.votacion.opcionDeVotacion.length;
    let unidad = this.ejeLong / this.maxVal;
    this.dibEjes(this.ejeLong, this.ejeLong);
    this.dibUnidades(unidad);
    for (let i = 0; i < this.votos.length; i++) {
      this.dibBarra(this.votacion.opcionDeVotacion[i].nombre.valueOf(), ancho * i, unidad * this.votos[i], ancho);
    }
  }

  dibEjes(ancho: number, alto: number): void {
    this.ctx.moveTo(this.dsp, this.maxY);
    this.ctx.lineTo(this.dsp, this.maxY - alto);
    this.ctx.moveTo(this.dsp, this.maxY);
    this.ctx.lineTo(ancho + this.dsp, this.maxY);
    this.ctx.stroke();
  }

  dibBarra(nombre: string, x: number, y: number, ancho: number): void {
    this.ctx.fillStyle = "#277ed6";
    this.ctx.fillRect(x + this.dsp, this.maxY - y, ancho - 1, y);
    this.ctx.fillStyle = "#000000";
    this.ctx.font = "10px Arial";
    this.ctx.fillText(nombre.slice(0, 3), x + this.dsp, this.maxY + this.dsp);
  }

  dibUnidades(unidad: number): void {
    this.ctx.font = "8px Arial";
    let nCeros = this.numCeros();
    let numero = 0;
    for (let i = 0; i <= this.ejeLong + 1; i += unidad * Math.pow(10, nCeros)) {
      this.ctx.fillText(numero, 0, this.maxY - i);
      numero += Math.pow(10, nCeros);
    }
  }

  calcularMaximo(): void {
    for (let i = 0; i < this.votos.length; i++) {
      if (this.votos[i] > this.maxVal) {
        this.maxVal = this.votos[i];
      }
    }
  }

  numCeros(): number {
    let nCeros = 0;
    let val = this.maxVal;
    val /= 10;
    while (val >= 1) {
      nCeros++;
      val /= 10;
    }
    return nCeros;
  }

  actualizarTipo(votacion: Votacion): void {
    this.votacionService.getTipoVotacion(votacion.tipoDeVotacion.valueOf()).subscribe(
      result => { this.tipoVotacion = result; }
    );
  }

  actualizarParticipantes(votacion: Votacion): void {
    this.votacionService.getParticipanteVotacion(votacion.id.valueOf())
      .subscribe(
        result => {
          votacion.participantes = result;
        }
      );
  }

  // Llama al servicio para leer los votos
  actualizarVotos(votacion: Votacion): void {
    votacion.almacena = [{ infoVoto: 1 }, { infoVoto: 1 }, { infoVoto: 0 }, { infoVoto: 1 }, { infoVoto: 0 }, { infoVoto: 2 }];
    //votacion.almacena = [];
    votacion.votos = votacion.almacena.length;
  }

  actualizarOpciones(votacion: Votacion): void {
    this.opcionService.getOpcion(this.votacion.id.valueOf()).subscribe(
      result => { votacion.opcionDeVotacion = result; this.contarVotos(); }
    );
  }
}
