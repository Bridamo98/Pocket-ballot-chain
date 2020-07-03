import { Component, OnInit } from '@angular/core';
import { CredencialService } from '../../../Servicios/Credencial/credencial.service';
import { Credencial} from '../../../Modelo/Credencial';
@Component({
	selector: 'app-credencial',
	templateUrl: './credencial.component.html',
	styleUrls: ['./credencial.component.css']
})
export class CredencialComponent implements OnInit {


	clave: string="";
	htmlToAdd: string ="";
	credencial: Credencial;


	constructor(private credencialServicio:CredencialService) { }

	ngOnInit(): void {

	}
	ingresarClave(){
		this.getCredencial();
	}


	getCredencial(){

		if(this.clave!= null && this.clave !=undefined && this.clave!="")
		{
			this.credencialServicio.validarCredencial(this.clave).subscribe(res => {
				this.credencial=res;

				console.log(this.credencial);
				if(this.credencial == null || this.credencial == undefined )
				{
					console.log("no aceptado");
					this.htmlToAdd="Su clave es invalida, intentelo otra vez."
				}
				else
				{
					console.log(this.credencial);
					console.log("aceptado");
					this.htmlToAdd=""
					window.location.href='Credencial';
				}
			});
		}
		else
		{
			this.htmlToAdd="Ingresar clave en el espacio vacio por favor."
		}
	}


}
