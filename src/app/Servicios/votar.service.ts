import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Validador } from 'src/app/Modelo/Validador';//Para probar envio de transacciones



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
}
