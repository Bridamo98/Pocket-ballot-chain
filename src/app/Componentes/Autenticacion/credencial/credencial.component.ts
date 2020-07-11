import { Component, OnInit } from '@angular/core';
import { CredencialService } from '../../../Servicios/Credencial/credencial.service';
import { VotacionService } from '../../../Servicios/votacion.service';
import { Credencial} from '../../../Modelo/Credencial';
import { Votacion} from '../../../Modelo/Votacion';
@Component({
	selector: 'app-credencial',
	templateUrl: './credencial.component.html',
	styleUrls: ['./credencial.component.css']
})
export class CredencialComponent implements OnInit {


	clave: string="";
	htmlToAdd: string ="";
	credencial: Credencial;
	votacion: Votacion;

	constructor(private credencialServicio:CredencialService, private votacionService:VotacionService) { }

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
					this.votacionService.getVotacion(this.credencial.votacion).subscribe(res=>{
						this.votacion=res;
						if(this.votacion.tipoDeVotacion==1)
						{
							window.location.href='VotoRanking/'+this.credencial.clave;
						}
						if(this.votacion.tipoDeVotacion==2)
						{
							window.location.href='VotoPopular/'+this.credencial.clave;
						}
						if(this.votacion.tipoDeVotacion==3)
						{
							window.location.href='VotoClasificacion/'+this.credencial.clave;
						}

					});
					//window.location.href='Credencial';
				}
			});
		}
		else
		{
			this.htmlToAdd="Ingresar clave en el espacio vacio por favor."
		}
	}


}
