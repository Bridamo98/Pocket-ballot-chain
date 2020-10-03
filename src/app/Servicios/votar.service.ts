import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Validador } from 'src/app/Modelo/Validador';//Para probar envio de transacciones
import { Voto } from '../Modelo/Voto';



@Injectable({
  providedIn: 'root'
})
export class VotarService {

  constructor(private http: HttpClient) { }

  URLbase = 'http://localhost:3000';

  obtenerValidadores():Observable<Validador[]> {//Manejar una clase Validador
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    console.log('get: ', this.URLbase + '/validadores');
    return this.http.get<Validador[]>(this.URLbase + '/validadores', { headers: headers });
  }

  enviarVoto(mensaje, peerId):any{
    let obj = {
      peerValidador: peerId,
      mensaje: mensaje
    };
    let returned;
    let json = JSON.stringify(obj);
    console.log("El JSON enviado es:",json);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    //return this.http.post<any>(this.URLbase + '/redirigir', json, { headers: headers });
    this.http.post<any>(this.URLbase + "/redirigir", json, { headers: headers }).subscribe(data => {
      returned = data['Status'];
    });
    return returned;
  }

  activarValidador(id):Observable<any> {//Manejar una clase Validador
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    console.log('get: ', this.URLbase + '/activarValidador/'+id);
    return this.http.get<any>(this.URLbase + '/activarValidador/'+id, { headers: headers });
  }

  setUsuario(usuarioValidador):any{
    let returned;
    let json = JSON.stringify(usuarioValidador);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    this.http.post<any>(this.URLbase + "/usuarioValidador", json, { headers: headers }).subscribe(data => {
      returned = data['Status'];
    });
    return returned;
  }

  confirmarBlockchain(hash: string): any{
    let returned;
    let json = JSON.stringify({hashBlockchain: hash});
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    this.http.post<any>(this.URLbase + "/confirmarBlockChainActualizada", json, { headers: headers }).subscribe(data => {
      returned = data['Status'];
    });
    return returned;
  }
}
