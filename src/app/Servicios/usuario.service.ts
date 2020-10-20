import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../Modelo/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  navigateValid = false;
  usuario: Usuario;

  constructor(private http: HttpClient) { }

  getUsuario() {
    return this.http.get<Usuario>(`${environment.serverUrl}/usuarioId`);
  }

  getUsuarios() {
    return this.http.get<Usuario[]>(`${environment.serverUrl}/usuario`);
  }

  idUservalid(){
    this.getUsuario()
    .subscribe(
      result => {
        this.usuario = result;
        if (this.usuario === null || this.usuario === undefined) {
          this.navigateValid = false;
        }
        else{
          this.navigateValid = true;
        }
      }
    );
    return this.navigateValid;
  }

  putUsuario(usuario: Usuario) {
    return this.http.put(`${environment.serverUrl}/usuarioPut`, {
      nombre: usuario.nombre.toString(),
      saldo: usuario.saldo.valueOf(),
      correo: usuario.correo.toString()
    });
  }
}
