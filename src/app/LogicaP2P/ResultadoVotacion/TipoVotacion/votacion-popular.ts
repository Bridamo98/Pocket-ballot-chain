import { CalcularResultadoVotacion } from './../calcular-resultado-votacion';
export class VotacionPopular implements CalcularResultadoVotacion {

  // Map < nombreOpcion , votos >
  conteoVotos: Map<string, number> = new Map();
  procesarVoto(voto: string[]): void {
    const opcion = voto[0].substring(voto[0].indexOf(' ') + 1).trim();
    if (this.conteoVotos.has(opcion)) {
      const cantVotos = this.conteoVotos.get(opcion);
      this.conteoVotos.set(opcion, cantVotos + 1);
    } else {
      this.conteoVotos.set(opcion, 1);
    }
  }

  calcularResultados(): string {
    let resultado = '';
    for (let opcion of this.conteoVotos.keys()) {
      opcion = opcion.trim();
      resultado += ' ' + opcion + ' ' + this.conteoVotos.get(opcion) + ';';
    }
    resultado = resultado.trim();
    return resultado;
  }
}
