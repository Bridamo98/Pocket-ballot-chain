import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../Modelo/Usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  getUsuario() {
    return this.http.get<Usuario>(`${environment.serverUrl}/usuarioId`);
  }

  getUsuarios() {
    return this.http.get<Usuario[]>(`${environment.serverUrl}/usuario`);
  }

  putUsuario(usuario: Usuario, nombreViejo: string) {
    return this.http.put(`${environment.serverUrl}/usuarioPut/${nombreViejo}`, {
      nombre: usuario.nombre.toString(),
      saldo: usuario.saldo.valueOf(),
      correo: usuario.correo.toString()
    });
  }
}
