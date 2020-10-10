import { CalcularResultadoVotacion } from './../calcular-resultado-votacion';
export class VotacionRanking implements CalcularResultadoVotacion {

  conteoVotos: Map<string, number> = new Map();

  procesarVoto(voto: string[]): void {
    for (const opcion of voto) {
      const opcion = voto[0].substring(voto[0].indexOf(' ') + 1).trim();
      if (this.conteoVotos.has(opcion)) {
        const cantVotos = this.conteoVotos.get(opcion);
        this.conteoVotos.set(opcion, cantVotos + 1);
      } else {
        this.conteoVotos.set(opcion, 1);
      }
    }
  }
  calcularResultados(): string {
    let resultado = '';
    let candidatos = Array.from(this.conteoVotos.keys());
    candidatos = candidatos.sort(this.compararPosicion);

    for (let i = 0 ; i < candidatos.length; i++){
      resultado += '#' + (i + 1) + ' ' + candidatos[i] + ' ';
    }
    resultado.trim();
    return resultado;
  }

  compararPosicion(a: string, b: string): number{
    const x = this.conteoVotos.get(a);
    const y = this.conteoVotos.get(b);
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return -1;
  }
}
