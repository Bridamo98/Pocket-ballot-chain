import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Credencial} from '../../Modelo/Credencial';
import { environment } from 'src/environments/environment';
@Injectable({
	providedIn: 'root'
})
export class CredencialService {

	URLbase = environment.serverUrl;
	constructor(private http: HttpClient) {
	}
	validarCredencial(id:String) {
		console.log('get: ', this.URLbase + '/votacion');
		return this.http.get<Credencial>(this.URLbase + '/credencial/'+id);

	}

}
