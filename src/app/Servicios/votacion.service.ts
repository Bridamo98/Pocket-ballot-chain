import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Votacion } from '../Modelo/Votacion';
import { environment } from '../../environments/environment';
import { Usuario } from '../Modelo/Usuario';

@Injectable({
  providedIn: 'root'
})
export class VotacionService {

  constructor(private http: HttpClient) { }

  URLbase = 'http://localhost:3000';

  prueba(){
    console.log('funciona');
  }

  getVotaciones() {
    console.log('get: ', this.URLbase + '/votacion');
    return this.http.get<Votacion[]>(this.URLbase + '/votacion');
  }


  /*
  addVotacion(votacion: any){
    let json = JSON.stringify(votacion);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post("localhost:3000/votacionAdd", json, { headers: headers });
  }
  */

  getVotacionesAutor(nombre: string) {
    return this.http.get<Votacion[]>(`${environment.serverUrl}/votacionAutor/${nombre}`);
  }

  getParticipanteVotacion(id: number) {
    return this.http.get<Usuario[]>(`${environment.serverUrl}/participanteVotacion/${id}`);
  }

  getVotacionesUsuario(nombre: string) {
    return this.http.get<Votacion[]>(`${environment.serverUrl}/participanteUsuario/${nombre}`);
  }
}
