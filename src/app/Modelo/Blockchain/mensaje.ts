export class Mensaje {
  tipoPeticion: number;
  contenido: any;
  constructor(tipoPeticion: number, contenido: any){
    this.tipoPeticion = tipoPeticion;
    this.contenido = contenido;
  }
}
