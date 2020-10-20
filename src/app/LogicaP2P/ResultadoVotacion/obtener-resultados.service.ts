import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Validador } from 'src/app/Modelo/Validador';

@Injectable({
  providedIn: 'root',
})
export class ObtenerResultadosService {
  resultadoGanador: string = null;
  conteoVotos = new Map<string, number>();
  validadores = new Array<Validador>();
  private sujeto = new Subject<void>();
  public observable = this.sujeto.asObservable();

  constructor() {}
  public inicializarResultados(validadores: Array<Validador>) {
    this.resultadoGanador = null;
    this.conteoVotos = new Map<string, number> ();
    this.validadores = validadores;
  }

  public obtenerResultados(resultado: string, peerId: string): void {
    if (this.resultadoGanador == null && this.comprobarValidador(peerId)) {
      // Insertar voto
      if (this.conteoVotos.has(resultado)) {
        this.conteoVotos.set(resultado, this.conteoVotos.get(resultado) + 1);
      } else {
        this.conteoVotos.set(resultado, 1);
      }
      if (this.calcularGanador()) {
        this.actualizarGanador();
      }
    }
  }

  private comprobarValidador(peerId: string): boolean {
    return this.validadores.filter((v) => v.peerId === peerId).length > 0;
  }

  private calcularGanador(): boolean {
    const umbral: number = this.validadores.length * 0.6;

    for (const resultado of this.conteoVotos.keys()) {
      if (this.conteoVotos.get(resultado) >= umbral) {
        this.resultadoGanador = resultado;
        return true;
      }
    }
    return false;
  }

  private actualizarGanador(): void {
    console.log('Resultados', this.resultadoGanador);
    this.sujeto.next();
  }

  obtenerGanador(): string {
    return this.resultadoGanador;
  }
}
