import { Injectable } from '@angular/core';
import { Validador } from 'src/app/Modelo/Validador';

@Injectable({
  providedIn: 'root'
})
export class ObtenerResultadosService {
  resultadoGanador: string = null;
  conteoVotos = new Map<string, number>();
  validadores = new Array<Validador>();

  constructor() { }

  agregarValidadores(validadores: Array<Validador>): void{
    this.validadores = validadores;
  }

  obtenerResultados(resultado: string, peerId: string): void{
    if (this.resultadoGanador == null && this.comprobarValidador(peerId)){
      // Insertar voto
      if (this.conteoVotos.has(resultado)) {
        this.conteoVotos.set(resultado, this.conteoVotos.get(resultado) + 1);
      } else {
        this.conteoVotos.set(resultado, 1);
      }
      if (this.calcularGanador()){
        this.actualizarGanador();
      }
    }
  }

  comprobarValidador(peerId: string): boolean{
    return this.validadores.filter(v => v.peerId === peerId).length > 0;
  }

  calcularGanador(): boolean{
    const umbral: number = this.validadores.length * 0.6;

    for (const resultado of this.conteoVotos.keys()) {
      if (this.conteoVotos.get(resultado) >= umbral) {
        this.resultadoGanador = resultado;
        return true;
      }
    }
    return false;
  }

  actualizarGanador(): void{
    console.log('Resultados', this.resultadoGanador);
  }
}
