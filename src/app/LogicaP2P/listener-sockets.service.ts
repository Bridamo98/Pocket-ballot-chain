import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ListenerSocketsService {

  socket: any;

  constructor() { 
    this.socket = io(environment.socketUrl);
  }   

  listen(evento) {
    return new Observable((subcriber) => {
      this.socket.on(evento, (data) => {
        subcriber.next(data);
      })
    });
  }

  emit(evento, data) {
    this.socket.emit(evento, data);
  }

}
