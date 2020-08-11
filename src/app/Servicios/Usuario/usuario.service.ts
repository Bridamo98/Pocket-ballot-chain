import { Injectable } from '@angular/core';
import {Usuario} from '../../Modelo/Usuario'
import { HttpClient, HttpHeaders, HttpHandler } from '@angular/common/http';
import {Md5} from 'ts-md5/dist/md5';

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
    usuario.contrasena=""+Md5.hashStr(usuario.contrasena.toString());
    return this.httpClient.post<any>(this.URLbase+'/usuarioAdd', usuario).toPromise().then(data=> {
			console.log(data);
      if(data.token!=null && data.token!=undefined)
      {
        localStorage.setItem('token', data.token);
      }
		});;
  }
  iniciarSesion(usuario: Usuario)
  {
    usuario.contrasena=""+Md5.hashStr(usuario.contrasena.toString());
    console.log(usuario);
    return this.http.post<any>(this.URLbase+'/iniciarSesion', usuario).toPromise().then(data=> {
      console.log(data);
      if(data.token!=null && data.token!=undefined)
      {
        localStorage.setItem('token', data.token);
      }
    });
  }
  estaLogeado()
  {
    return !!localStorage.getItem('token');
  }
}
