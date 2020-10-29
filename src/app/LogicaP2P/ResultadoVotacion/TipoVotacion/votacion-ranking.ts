import { CalcularResultadoVotacion } from './../calcular-resultado-votacion';
export class VotacionRanking implements CalcularResultadoVotacion {
  conteoVotos: Map<string, number> = new Map();

  procesarVoto(voto: string[]): void {
    for (const op of voto) {
      const posicion: number = +op.substring(0 , op.indexOf(' '));
      const opcion: string = op.substring(op.indexOf(' ') + 1).trim();
      if (this.conteoVotos.has(opcion)) {
        const cantVotos = this.conteoVotos.get(opcion);
        this.conteoVotos.set(opcion, cantVotos + posicion);
      } else {
        this.conteoVotos.set(opcion, posicion);
      }
    }
  }
  calcularResultados(): string {
    let resultado = '';
    const nombresCandidato = Array.from(this.conteoVotos.keys());
    let candidatos = [];
    for (const nombreCandidato of nombresCandidato) {
      candidatos.push({ nombre: nombreCandidato, votos: this.conteoVotos.get(nombreCandidato) });
    }
    candidatos = candidatos.sort(this.compararPosicion);

    for (let i = 0; i < candidatos.length; i++) {
      resultado += '#' + (i + 1) + ' ' + candidatos[i].nombre + ' ';
    }
    resultado = resultado.trim();
    return resultado;
  }

  compararPosicion(a, b): number {
    const x: number = +a.votos;
    const y: number = +b.votos;
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  }
}
