import { Injectable } from '@angular/core';
import { Usuario } from '../../Modelo/Usuario';
import { HttpClient, HttpHeaders, HttpHandler } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { sha512 } from 'js-sha512';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  URLbase = environment.serverUrl;
  httpClient: HttpClient;

  userIsValid = false;

  constructor(private http: HttpClient) {
    this.httpClient = http;
  }

  setUserIsValid(valid){
    this.userIsValid = valid;
  }

  isUserValid(){
    return this.userIsValid;
  }

  addUsuario(usuario: Usuario) {
    usuario.contrasena =
      '' + sha512.create().update(usuario.contrasena.toString()).hex();
    return this.httpClient
      .post<any>(this.URLbase + '/usuarioAdd', usuario)
      .toPromise();
  }
  usuarioExiste(nombre: string) {
    return this.http
      .get<boolean>(this.URLbase + '/usuario-existe/' + nombre)
      .toPromise();
  }

  iniciarSesion(usuario: Usuario) {
    usuario.contrasena = '' + sha512.create().update(usuario.contrasena.toString()).hex();
    console.log(usuario);
    usuario.nombre = usuario.nombre.trim().toLocaleLowerCase();
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

  tokenEsValido(token: string){
    return this.http
      .get<any>(this.URLbase + '/validar-token')
      .toPromise();
  }
  async estaLogeado() {
    if (!!localStorage.getItem('token') && !!localStorage.getItem('nombre')){
      try {
        const esValido = await this.tokenEsValido(localStorage.getItem('token'));
        if (esValido === 'Solicitud autorizada'){
          return true;
        }
      } catch (error) {
      }
      }
    localStorage.clear();
    return false;
  }
}
