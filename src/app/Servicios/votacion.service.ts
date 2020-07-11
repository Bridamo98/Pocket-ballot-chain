import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Votacion } from '../Modelo/Votacion';
import { environment } from '../../environments/environment';
import { Usuario } from '../Modelo/Usuario';
import { identifierModuleUrl } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class VotacionService {

  constructor(private http: HttpClient) { }

  URLbase = 'http://localhost:3000/';

  prueba() {
    console.log('funciona');
  }

  getVotaciones() {
    console.log('get: ', this.URLbase + '/votacion');
    return this.http.get<Votacion[]>(this.URLbase + '/votacion');
  }

  addVotacion(votacion: any): Observable<Object> {
    let json = JSON.stringify(votacion);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    console.log(json);
    return this.http.post<Votacion>(this.URLbase + "votacionAdd", json, { headers: headers });
  }

  getVotacion(id: Number) {
    return this.http.get<Votacion>(`${environment.serverUrl}/votacion/${id}`);
  }

  getVotacionesAutor(nombre: string) {
    return this.http.get<Votacion[]>(`${environment.serverUrl}/votacionAutor/${nombre}`);
  }

  getParticipanteVotacion(id: number) {
    return this.http.get<Usuario[]>(`${environment.serverUrl}/participanteVotacion/${id}`);
  }

  getVotacionesUsuario(nombre: string) {
    return this.http.get<Votacion[]>(`${environment.serverUrl}/participanteUsuario/${nombre}`);
  }

  deleteUsuarioVotacion(id: number, nombre: string) {
    return this.http.get(`${environment.serverUrl}/participanteDelete/${id}/${nombre}`);
  }
}
