import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Votacion } from '../Modelo/Votacion';
import { environment } from '../../environments/environment';
import { Usuario } from '../Modelo/Usuario';
import { identifierModuleUrl } from '@angular/compiler';
import { TipoVotacion } from '../Modelo/TipoVotacion';

@Injectable({
  providedIn: 'root'
})
export class VotacionService {

  constructor(private http: HttpClient) { }

  URLbase = environment.serverUrl;

  prueba() {
    console.log('funciona');
  }

  getVotaciones() {
    console.log('get: ', this.URLbase + '/votacion');
    return this.http.get<Votacion[]>(this.URLbase + '/votacion');
  }

  addOpcion(idVotacion, opcion) {
    console.log("Agrego Opcion: " + opcion);
  }

  addParticipante(idVotacion, participante){
    console.log("Agrego Participante: " + participante);
  }

  addVotacion(votacion: any): Observable<Object> {
    let json = JSON.stringify(votacion);
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    console.log(json);
    return this.http.post<Votacion>(this.URLbase + "votacionAdd", json, { headers: headers });
  }

  validarAutorizacion(idVotacion: number){
    return this.http.get<Votacion>(`${environment.serverUrl}/votar/${idVotacion}`);
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

  getVotacionesUsuario() {
    return this.http.get<Votacion[]>(`${environment.serverUrl}/participanteUsuario`);
  }

  deleteUsuarioVotacion(id: number, nombre: string) {
    return this.http.get(`${environment.serverUrl}/participanteDelete/${id}/${nombre}`);
  }

  getTipoVotacion(id: number) {
    return this.http.get<TipoVotacion>(`${environment.serverUrl}/tipoVotacion/${id}`);
  }
}
