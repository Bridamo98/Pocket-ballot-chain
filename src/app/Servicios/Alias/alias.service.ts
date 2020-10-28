import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Transaccion } from '../../Modelo/Blockchain/transaccion';

@Injectable({
  providedIn: 'root'
})
export class AliasService {

  URLbase = environment.serverUrl;

  constructor(private http: HttpClient) { }

  consultarAlias(transaccion: Transaccion): any {
    let json = JSON.stringify({ alias: transaccion.alias, idVotacion: transaccion.idVotacion });
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post<any>(this.URLbase + '/aliasConsultar', json, {
        headers: headers,
      }).toPromise();
  }
}
