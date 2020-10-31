import { Injectable } from '@angular/core';
import { Opcion } from '../Modelo/Opcion';

@Injectable({
  providedIn: 'root'
})
export class ResultsConverterService {

  constructor() { }

  obtenerResultadosPop(resultados: string, opciones: Opcion[]): Map<string, number> {
    let votos = new Map<string, number>();
    let arrayResultados = resultados.split(";");
    arrayResultados.pop();
    for (const opcion of opciones) {
      votos.set(opcion.nombre.valueOf(), 0);
    }
    for (const string of arrayResultados) {
      let arrayString = string.split(" ");
      let nVotos = +arrayString.pop();
      votos.set(this.obtenerNombre(arrayString), nVotos);
    }
    return votos;
  }

  obtenerResultadosClas(resultados: string, opciones: Opcion[]): Map<string, number>[] {
    let votos = new Map<string, number>();
    let votosNo = new Map<string, number>();
    let arrayResultados = resultados.split(";");
    arrayResultados.pop();
    for (const opcion of opciones) {
      votos.set(opcion.nombre.valueOf(), 0);
      votos.set(opcion.nombre.valueOf(), 0);
    }
    for (const string of arrayResultados) {
      let arrayString = string.split(" ");
      let nVotosNo = +arrayString.pop();
      let nVotos = +arrayString.pop();
      let nombre = this.obtenerNombre(arrayString);
      votos.set(nombre, nVotos);
      votosNo.set(nombre, nVotosNo);
    }
    return [votos, votosNo];
  }

  obtenerResultadosRank(resultados: string, opciones: Opcion[]): Map<string, number> {
    let votos = new Map<string, number>();
    let arrayResultados = resultados.split("#");
    arrayResultados = arrayResultados.slice(1);
    for (const opcion of opciones) {
      votos.set(opcion.nombre.valueOf(), 0);
    }
    for (const string of arrayResultados) {
      let arrayString = string.split(" ");
      let nVotos = +arrayString[0];
      arrayString = arrayString.slice(1, arrayString.length);
      votos.set(this.obtenerNombre(arrayString), nVotos);
    }
    console.log('mapa', votos);
    return votos;
  }

  private obtenerNombre(array: string[]): string {
    let nombre = "";
    for (const e of array) {
      nombre += e + " ";
    }
    return nombre.trim();
  }
}
