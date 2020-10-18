import { Injectable } from '@angular/core';
import { Usuario } from '../../Modelo/Usuario';
import { HttpClient, HttpHeaders, HttpHandler } from '@angular/common/http';
import { Md5 } from 'ts-md5/dist/md5';
import { environment } from 'src/environments/environment';
import { resolve } from 'dns';
import { rejects } from 'assert';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  URLbase = environment.serverUrl;
  private _httpHandler: HttpHandler;
  httpClient: HttpClient;
  constructor(private http: HttpClient) {
    this.httpClient = http;
  }
  addUsuario(usuario: Usuario) {
    usuario.contrasena = '' + Md5.hashStr(usuario.contrasena.toString());
    return this.httpClient
      .post<any>(this.URLbase + '/usuarioAdd', usuario)
      .toPromise();
  }
   usuarioExiste(nombre: string){
    return this.http.get<boolean>(this.URLbase + '/usuario-existe/' + nombre).toPromise();
  }

  iniciarSesion(usuario: Usuario) {
    usuario.contrasena = '' + Md5.hashStr(usuario.contrasena.toString());
    console.log(usuario);
    return new Promise((resolve, reject) => {
      this.http
        .post<any>(this.URLbase + '/iniciarSesion', usuario)
        .subscribe((data) => {
          console.log(data);
          if (data.token != null && data.token !== undefined) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('nombre', usuario.nombre.toString());
            resolve();
          } else {
            reject();
          }
        });
    });
  }
  estaLogeado() {
    return !!localStorage.getItem('token');
  }
}
