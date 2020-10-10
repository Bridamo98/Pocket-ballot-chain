export interface CalcularResultadoVotacion {
  procesarVoto(voto: string[]): void;
  calcularResultados(): string;
}
