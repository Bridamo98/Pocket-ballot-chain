import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Validador } from 'src/app/Modelo/Validador'; //Para probar envio de transacciones
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VotarService {
  constructor(private http: HttpClient) {}

  URLbase = environment.serverUrl;

  obtenerValidadores(): Observable<Validador[]> {
    //Manejar una clase Validador
    let headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    console.log('get: ', this.URLbase + '/validadores');
    return this.http.get<Validador[]>(this.URLbase + '/validadores', {
      headers: headers,
    });
  }

  eliminarValidador(id): Observable<any> {
    //Manejar una clase Validador
    let headers = new HttpHeaders().set(
      'Authorization',
      'Bearer ' + localStorage.getItem('token')
    );
    console.log('get: ', this.URLbase + '/desactivarValidador/' + id);
    return this.http.get<any>(this.URLbase + '/desactivarValidador/' + id, {
      headers: headers,
    });
  }

  setUsuario(usuarioValidador): any {
    let returned;
    let json = JSON.stringify(usuarioValidador);
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    this.http
      .post<any>(this.URLbase + '/usuarioValidador', json, { headers: headers })
      .subscribe((data) => {
        returned = data['Status'];
      });
    return returned;
  }

  confirmarBlockchain(hash: string): any {
    let returned;
    let json = JSON.stringify({ hashBlockchain: hash });
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    this.http
      .post<any>(this.URLbase + '/confirmarBlockChainActualizada', json, {
        headers: headers,
      })
      .subscribe((data) => {
        returned = data['Status'];
      });
    return returned;
  }

  reportarValidador(validadorReportado: string): any {
    let returned;
    let json = JSON.stringify({ validadorReportado: validadorReportado });
    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    this.http
      .post<any>(this.URLbase + '/reportarValidador', json, {
        headers: headers,
      })
      .subscribe((data) => {
        returned = data['Status'];
      });
    return returned;
  }
}
