import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../Modelo/Usuario';
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
  constructor() { }


  
  registrarse()
  {
	
	
	console.log("hola mundo");
	if(this.nombre!= null && this.nombre!=""&& this.nombre!=undefined &&
		this.correo!=null && this.correo!="" && this.correo!=undefined)
	{
		this.htmlToAdd="Registrado";
		this.usuario= {
			nombre: this.nombre,
			saldo: 0,
			correo: this.correo,
			idValidador: null,
			bloqAprobados : null,
			bloqPropuestos : null,
			bloqRevisador : null,
			bloqValidados : null,
			genera : null,
		};
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

