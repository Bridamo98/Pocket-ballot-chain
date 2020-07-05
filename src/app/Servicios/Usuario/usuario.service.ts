import { Injectable } from '@angular/core';
import {Usuario} from '../../Modelo/Usuario'
import { HttpClient, HttpHeaders, HttpHandler } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
	URLbase = 'http://localhost:3000';
	private _httpHandler: HttpHandler;
	httpClient: HttpClient;
  constructor(private http: HttpClient) { 
  	this.httpClient= http
  }
  addUsuario(usuario: Usuario){
    return this.httpClient.post(this.URLbase+'/usuarioAdd', usuario).toPromise().then(data=> {
			console.log(data);
		});;
  }
  iniciarSesion(usuario: Usuario)
  {
        return this.http.post<any>('${environment.serverUrl}/iniciarSesion', usuario);
  }
}
