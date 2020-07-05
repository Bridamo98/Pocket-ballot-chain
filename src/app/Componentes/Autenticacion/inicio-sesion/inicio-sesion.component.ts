import { Component, OnInit } from '@angular/core';
import { Usuario }from'../../../Modelo/Usuario';
import {UsuarioService} from '../../../Servicios/Usuario/usuario.service'

@Component({
	selector: 'app-inicio-sesion',
	templateUrl: './inicio-sesion.component.html',
	styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent implements OnInit {

	constructor(usuarioService:UsuarioService) {
		this.usuarioService= usuarioService; 
	 }
	usuario: Usuario;
	correo: String;
	contrasena: String;
	usuarioService:UsuarioService;
	ngOnInit(): void {
		
	}
	iniciarSesion()
	{
		if(this.contrasena!= null && this.contrasena!=""&& this.contrasena!=undefined &&
			this.correo!=null && this.correo!="" && this.correo!=undefined){
			this.usuario={
				contrasena: this.contrasena,
				nombre: this.correo,
				saldo: 0,
				correo: this.correo,
				idValidador: null,
				bloqAprobados : null,
				bloqPropuestos : null,
				bloqRevisados : null,
				bloqValidados : null,
				genera : null
			};
			this.usuarioService.iniciarSesion(this.usuario);
		}
		else
		{

		}
	}

}
