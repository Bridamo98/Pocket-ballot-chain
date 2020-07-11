import { Component, OnInit } from '@angular/core';
import { Opcion } from 'src/app/Modelo/Opcion';
import { VotacionService } from './../../../Servicios/votacion.service'
import { NgbInputDatepicker, NgbDatepicker, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-votacion-crear-informacion',
  templateUrl: './votacion-crear-informacion.component.html',
  styleUrls: ['./votacion-crear-informacion.component.css']
})
export class VotacionCrearInformacionComponent implements OnInit {


  //atributos de la opcion
  nombre;
  identificacion;
  descripcion;
  opciones = [];
  //atributos de la votacion
  fechaLimite;
  votacionDescripcion = "falta colocar la descripcion";;
  tipo: string;
  cantiVotos: number;
  
  status;


  constructor(public votacionService: VotacionService, private rutaActiva: ActivatedRoute, private router: Router, private modalService: NgbModal) {
    this.tipo = this.rutaActiva.snapshot.params.tipo;
    this.cantiVotos = this.rutaActiva.snapshot.params.cantiVotos;
  }

  ngOnInit(): void {
    if(this.cantiVotos == undefined){
      console.log("Esta undefinido");
      this.cantiVotos = 1;
    }
    else{
      console.log(this.cantiVotos);
    }
    if(this.tipo !== "Popular" && this.tipo !== "Ranking" && this.tipo !== "Clasificacion"){
      this.router.navigate(['CrearVotacion']);
    }
  }

  showModal(modal){
    this.modalService.open(modal);
  }

  crearOpcion(){
    this.opciones.push({id:this.identificacion, nombre:this.nombre, descripcion:this.descripcion});
  }

  crearVotacion(){
    console.log("Funciona");
    let votacion = {fecha: "2020-10-10", tipoVotacion: this.tipo, descripcion: this.votacionDescripcion, votos: this.cantiVotos};
    this.votacionService.addVotacion(votacion).subscribe(status => console.log(status));
    
    for (let index = 0; index < this.opciones.length; index++) {
      //this.votacionService.addOpcion()
    }
  }

  public changeListener(files: FileList){
    console.log(files);
    if(files && files.length > 0) {
       let file : File = files.item(0); 
         console.log(file.name);
         console.log(file.size);
         console.log(file.type);
         let reader: FileReader = new FileReader();
         reader.readAsText(file);
         reader.onload = (e) => {
            let csv: string = reader.result as string;
            console.log(csv);
         }
      }
  }
}
