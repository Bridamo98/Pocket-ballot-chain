import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Grupo, Respuesta, Relacion } from '../Modelo/Grupo';
import { Usuario } from '../Modelo/Usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  constructor(private http: HttpClient) { }

  URLbase = 'http://localhost:3000';

  obtenerUsuarioLogueado():Observable<Respuesta>{
    console.log(localStorage.getItem('token'));
    let headers = new HttpHeaders().set('Authorization', 'Bearer '+localStorage.getItem('token'));
    console.log('get: ', this.URLbase + '/log');
    return this.http.get<Respuesta>(this.URLbase + '/log', { headers: headers });
  }

  //----------------------------------GRUPOS-------------------------------

  obtenerGrupos():Observable<Grupo[]> {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    console.log('get: ', this.URLbase + '/grupo');
    return this.http.get<Grupo[]>(this.URLbase + '/grupo', { headers: headers });
  }

  obtenerGrupo(id): Observable<Grupo> {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    console.log('get: ', this.URLbase + '/grupo/' + id);
    let res = this.http.get<Grupo>(this.URLbase + '/grupo/' + id.valueOf(), { headers: headers });
    console.log(res);
    return res;
  }

  agregarGrupo(grupo: Grupo): Observable<Respuesta> {
    let json = JSON.stringify(grupo);
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'))
      .set('Content-Type', 'application/json');
    
    console.log('post: ', this.URLbase + '/grupo');
    return this.http.post<Respuesta>(this.URLbase + '/grupo', json, { headers: headers });
  }

  eliminarGrupo(id): Observable<Respuesta> {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    console.log('delete: ', this.URLbase + '/grupo/' + id);
    let res = this.http.delete<Respuesta>(this.URLbase + '/grupo/' + id, { headers: headers });
    console.log(res);
    return res;
  }

  actualizarGrupo(grupo: Grupo): Observable<Respuesta> {
    let json = JSON.stringify(grupo);
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'))
      .set('Content-Type', 'application/json');
    console.log('put: ', this.URLbase + '/grupo');
    return this.http.put<Respuesta>(this.URLbase + '/grupo', json, { headers: headers });
  }

  //----------------------------------USUARIOS-------------------------------//TEMPORAL

  obtenerUsuarios():Observable<Usuario[]> {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    console.log('get: ', this.URLbase + '/usuario');
    return this.http.get<Usuario[]>(this.URLbase + '/usuario', { headers: headers });
  }

  obtenerUsuario(nombre):Observable<Usuario> {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    console.log('get: ', this.URLbase + '/usuario/' + nombre);
    return this.http.get<Usuario>(this.URLbase + '/usuario/' + nombre, { headers: headers });
  }

  //----------------------------------MIEMBROS-------------------------------

  
  obtenerMiembrosDeGrupo(id):Observable<Usuario[]> {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    console.log('get: ', this.URLbase + '/miembro/grupo/' + id);
    return this.http.get<Usuario[]>(this.URLbase + '/miembro/grupo/' + id, { headers: headers });
  }

  agregarMiembro(miembro: Relacion):Observable<Respuesta> {
    let json = JSON.stringify(miembro);
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'))
      .set('Content-Type', 'application/json');
    console.log('post: ', this.URLbase + '/miembro');
    return this.http.post<Respuesta>(this.URLbase + '/miembro', json, { headers: headers });
  }

  eliminarMiembro(relacion:Relacion): Observable<Respuesta> {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    console.log('delete: ', this.URLbase + '/miembro/'+relacion.idUsuario+'/'+relacion.idGrupo);
    let res = this.http.delete<Respuesta>(this.URLbase + '/miembro/' + relacion.idUsuario + '/' + relacion.idGrupo, { headers: headers });
    console.log(res);
    return res;
  }

  eliminarMiembros(id): Observable<Respuesta> {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    console.log('delete: ', this.URLbase + '/miembro/' + id);
    let res = this.http.delete<Respuesta>(this.URLbase + '/miembro/' + id, { headers: headers });
    console.log(res);
    return res;
  }

  //----------------------------------PENDIENTES-------------------------------

  obtenerPendientes(id):Observable<Usuario[]> {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    console.log('get: ', this.URLbase + '/pendiente/grupo/' + id);
    return this.http.get<Usuario[]>(this.URLbase + '/pendiente/grupo/' + id, { headers: headers });
  }

  agregarPendiente(pendiente: Relacion) {
    let json = JSON.stringify(pendiente);
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'))
      .set('Content-Type', 'application/json');
    console.log('post: ', this.URLbase + '/pendiente');
    return this.http.post(this.URLbase + '/pendiente', json, { headers: headers });
  }

  eliminarPendiente(relacion: Relacion): Observable<Respuesta> {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    console.log('delete: ', this.URLbase + '/pendiente/' + relacion.idUsuario + '/' + relacion.idGrupo);
    let res = this.http.delete<Respuesta>(this.URLbase + '/pendiente/' + relacion.idUsuario + '/' + relacion.idGrupo, { headers: headers });
    console.log(res);
    return res;
  }

  eliminarPendientes(id): Observable<Respuesta> {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    console.log('delete: ', this.URLbase + '/pendiente/' + id);
    let res = this.http.delete<Respuesta>(this.URLbase + '/pendiente/' + id, { headers: headers });
    console.log(res);
    return res;
  }
}
