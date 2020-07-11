import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Modelo/Usuario';
import {UsuarioService} from '../../../Servicios/Usuario/usuario.service'
import { Inject }  from '@angular/core';
import { DOCUMENT } from '@angular/common'; 
@Component({
	selector: 'app-registrar',
	templateUrl: './registrar.component.html',
	styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {

	nombre: string;
	correo: string;
	contrasenia: string;
	verificar: string;
	htmlToAdd: string ;
	usuario: Usuario  = new Usuario("", 0, '', '');
	usuarioService:UsuarioService;
	constructor(  usuarioService2:UsuarioService, @Inject(DOCUMENT) document) {

		this.usuarioService= usuarioService2; 
	}

	  element: HTMLElement;



	registrarse(popCorreo, popName, popContra, popConfirm)
	{
		popCorreo.close();
		popName.close();
		popContra.close();
		popConfirm.close();
		this.disMissAlertDanger('correo');
		this.disMissAlertDanger('nombre');
		this.disMissAlertDanger('contrasenia');
		this.disMissAlertDanger('verificar');
		console.log("hola mundo");
		if(this.correo!= null && this.correo!=""&& this.correo!=undefined )
		{
			if(this.nombre!=null && this.nombre!="" && this.nombre!=undefined){
				if(this.contrasenia!=null && this.contrasenia!="" && this.contrasenia!=undefined)
				{
					if(this.verificar!=null && this.verificar!="" && this.verificar!=undefined)
					{

						if(this.verificar==this.contrasenia)
						{
							this.htmlToAdd="Registrado";
							this.usuario= {
								contrasena: this.contrasenia,
								nombre: this.nombre,
								saldo: 0,
								correo: this.correo,
								idValidador: null,
								bloqAprobados : null,
								bloqPropuestos : null,
								bloqRevisados : null,
								bloqValidados : null,
								genera : null
							};
							this.usuarioService.addUsuario(this.usuario);
						}
						else
						{
							popConfirm.popoverTitle = 'Error'
							popConfirm.ngbPopover='Esta contraseña debe coincidir con la de arriba'
							popConfirm.open();
							this.alertDanger('verificar')
						}
					}
					else
					{
						popConfirm.open();
						this.alertDanger('verificar')
					}
				}
				else
				{
					this.alertDanger('contrasenia');
					popContra.open();
				}	
			}
			else
			{
				popName.open();
				this.alertDanger('nombre');
			}
		}
		else
		{

			popCorreo.open();
			this.alertDanger('correo')
			//this.element = document.getElementById('correo') as HTMLElement;
			//console.log(this.element);
			//this.element.classList.remove("form-control");
			//this.element.classList.add("alert");
			//this.element.classList.add("alert-danger");
			//this.htmlToAdd="Ingrese los datos correctamente";
		}

		console.log(this.usuario);

	}
	ngOnInit(): void {
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

