import { CalcularResultadoVotacion } from './../calcular-resultado-votacion';
export class VotacionClasificacion implements CalcularResultadoVotacion {
  conteoVotos: Map<string, number> = new Map();
  totalVotos: number = -1;

    // Map < nombreOpcion , votos >
  procesarVoto(voto: string[]): void {
    for (const opcion of voto) {
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
    for (let opcion of this.conteoVotos.keys()) {
      opcion = opcion.trim();
      let favor = this.conteoVotos.get(opcion);
      let contra = this.totalVotos - favor;
      resultado += ' ' + opcion + ' ' + favor + ' ' + contra + ';';
    }
    resultado = resultado.trim();
    return resultado;
  }
}
