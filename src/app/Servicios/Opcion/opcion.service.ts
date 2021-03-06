import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Opcion } from './../../Modelo/Opcion';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class OpcionService {

  constructor(private http: HttpClient) { }

  URLbase = environment.serverUrl;

  prueba(){
    console.log('funciona');
  }

  getOpciones() {
    console.log('get: ', this.URLbase + '/opcion');
    return this.http.get<Opcion[]>(this.URLbase + '/votacion');
  }

  getOpcion(id: number) {
    console.log('get: ', this.URLbase + '/opcion/votacion');
    return this.http.get<Opcion[]>(this.URLbase + '/opcion/votacion/' + id);
  }

}
