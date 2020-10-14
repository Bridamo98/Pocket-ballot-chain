import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultadoService {

  constructor(private http: HttpClient) { }

  getResultados(idVotacion: number, peerId: string): object{
    return this.http.post<object>(`${environment.serverUrl}/votacion/resultados`, {
      idVotacion,
      peerId
    });
  }
}
