import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Votacion } from '../Modelo/Votacion';

@Injectable({
  providedIn: 'root'
})
export class VotacionService {

  constructor(private http: HttpClient) { }

  URLbase = 'http://localhost:3000/';

  prueba(){
    console.log('funciona');
  }
  
  getVotaciones() {
    console.log('get: ', this.URLbase + '/votacion');
    return this.http.get<Votacion[]>(this.URLbase + '/votacion');
  }
  
  addVotacion(votacion: any): Observable<Object>{
    let json = JSON.stringify(votacion);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    console.log(json);
    return this.http.post<Votacion>( this.URLbase + "votacionAdd", json, { headers: headers });
  }
  
  addOpcion(){
    
  }

}
