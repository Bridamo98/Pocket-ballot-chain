import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Modelo/Usuario';
import {UsuarioService} from '../../../Servicios/Usuario/usuario.service'
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
  constructor(  usuarioService2:UsuarioService) {
  this.usuarioService= usuarioService2; 
}




  registrarse()
  {


	console.log("hola mundo");
	if(this.nombre!= null && this.nombre!=""&& this.nombre!=undefined &&
		this.correo!=null && this.correo!="" && this.correo!=undefined)
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
		this.htmlToAdd="Ingrese los datos correctamente";
	}

	console.log(this.usuario);
	
  }
  ngOnInit(): void {
  }

}

