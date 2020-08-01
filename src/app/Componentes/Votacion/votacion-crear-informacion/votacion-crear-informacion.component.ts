import { Component, OnInit } from '@angular/core';
import { Opcion } from 'src/app/Modelo/Opcion';
import { VotacionService } from './../../../Servicios/votacion.service';
import { NgbInputDatepicker, NgbDatepicker, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger } from '@angular/animations';

declare var $: any;


@Component({
  selector: 'app-votacion-crear-informacion',
  templateUrl: './votacion-crear-informacion.component.html',
  styleUrls: ['./votacion-crear-informacion.component.css']
})
export class VotacionCrearInformacionComponent implements OnInit {

  //atributos de validacion
  msgErrorFecha: string;
  msgErrorCredenciales: string;
  //atributos de la opcion
  nombre;
  identificacion;
  descripcion;
  opciones = [];
  //atributos de la votacion
  cantidadCredenciales;
  cantidadCredencialesValid = false;
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

    $(function () {
      $('[data-toggle="popover"]').popover({
        html: true,
        trigger: "manual",
      });
    })


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

  fechaError(){
    console.log(this.fechaLimite);
    if(this.fechaLimite !== null){
      if(typeof this.fechaLimite === 'string'){
        console.log(false);
        document.getElementById('date').setAttribute('title', "Error en la entrada");
        document.getElementById('date').setAttribute('data-content', "<ul><li type = 'square'> El formato debe ser año-mes-dia </li></ul>");
        $('#date').popover("show");
      }
      else{
        console.log(true);
        $('#date').popover("hide");
      }
    }
  }

  credencialesError(){
    let expresionRegular = /^[0-9]{1,8}$/
    console.log(this.cantidadCredenciales);
    if(this.cantidadCredenciales !== null){
      if(this.cantidadCredenciales.match(expresionRegular)){
        console.log(true);
        this.cantidadCredencialesValid = true;
        $('#credencial').popover("hide");
      }
      else{
        console.log(false);
        document.getElementById('credencial').setAttribute('title', "Error en la entrada");
        document.getElementById('credencial').setAttribute('data-content', "<ul><li type = 'square'> Debe ser un valor numérico </li><li type = 'square'> Debe contener menos de 8 cifras </li></ul>");
        this.cantidadCredencialesValid = false;
        $('#credencial').popover("show");
      }
    }
  }
}
