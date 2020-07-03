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
  constructor( http: HttpClient) { 
  	this.httpClient= http
  }
  addUsuario(usuario: Usuario){
    //var json = JSON.stringify(usuario); //Esto jode el post
    var headers = new HttpHeaders().set('Content-Type', 'application/json');
    //console.log(json);
    console.log(headers);
    return this.httpClient.post(this.URLbase+'/usuarioAdd', usuario, headers).toPromise().then(data=> {
			console.log(data);
		});;
  }
}
