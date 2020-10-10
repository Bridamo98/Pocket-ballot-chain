import { Injectable } from '@angular/core';

declare var enviarMensaje: any;

@Injectable({
  providedIn: 'root',
})
export class EnvioMensajesService {
  constructor() {}
  enviarPk(pk: any, peerId: any): void {
    enviarMensaje(pk, peerId);
  }
}
