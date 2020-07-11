import { Component, OnInit } from '@angular/core';
import { Usuario }from'../../../Modelo/Usuario';
import {UsuarioService} from '../../../Servicios/Usuario/usuario.service';
import {NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover/popover';

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

	  element: HTMLElement;

	iniciarSesion(popContra, popUsuario)
	{
		this.disMissAlertDanger('contrasena')
		this.disMissAlertDanger('nombre');
		if(this.correo!=null && this.correo!="" && this.correo!=undefined){
			if(this.contrasena!= null && this.contrasena!=""&& this.contrasena!=undefined 
				){
				popUsuario.close();
			popContra.close();
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
			popUsuario.close();
			popContra.open();
			this.alertDanger('contrasena');
		}
	}
	else
	{
		popUsuario.open();
		popContra.close();
		this.alertDanger('nombre');
	}
	
	
}
	alertDanger(id:string)
	{
		this.element = document.getElementById(id) as HTMLElement;
		this.element.classList.add("alert");
		this.element.classList.add("alert-danger");
	}
	disMissAlertDanger(id:string)
	{
		this.element = document.getElementById(id) as HTMLElement;
		this.element.classList.remove("alert");
		this.element.classList.remove("alert-danger");
	}

}
