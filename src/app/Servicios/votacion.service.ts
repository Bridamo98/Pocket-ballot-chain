import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Votacion } from '../Modelo/Votacion';

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
  getVotacion(id:number) {
    console.log('get: ', this.URLbase + '/votacion');
    return this.http.get<Votacion>(this.URLbase + '/votacion/'+id);
  }
  
  

  /*
  addVotacion(votacion: any){
    let json = JSON.stringify(votacion);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.httpClient.post("localhost:3000/votacionAdd", json, { headers: headers });
  }
  */


}
