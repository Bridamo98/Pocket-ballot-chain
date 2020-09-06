import { Injectable } from '@angular/core';

declare var enviar: any;

@Injectable({
  providedIn: 'root'
})
export class EnvioMensajesService {

  constructor() { }
  enviarPk(pk:string, peerId:any):void{
    enviar(pk,peerId);
  }
}
