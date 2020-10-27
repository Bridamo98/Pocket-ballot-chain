import { Component, OnInit } from '@angular/core';
import { Opcion } from 'src/app/Modelo/Opcion';
import { VotacionService } from './../../../Servicios/votacion.service';
import { NgbInputDatepicker, NgbDatepicker, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger } from '@angular/animations';
import { UsuarioService } from 'src/app/Servicios/usuario.service';
import { Usuario } from 'src/app/Modelo/Usuario';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { environment } from 'src/environments/environment';

declare var $: any;

@Component({
  selector: 'app-votacion-crear-informacion',
  templateUrl: './votacion-crear-informacion.component.html',
  styleUrls: ['./votacion-crear-informacion.component.css']
})
export class VotacionCrearInformacionComponent implements OnInit {

  //Autocompletado
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  //errores
  msgErrorFecha = "<ul><li type = 'square'> El formato debe ser año-mes-dia </li></ul>";
  msgErrorCredenciales = "<ul><li type = 'square'> Debe ser un valor numérico </li><li type = 'square'> Debe contener menos de 8 cifras </li></ul>";
  //variables
  usuario: Usuario;
  //atributos de la opcion
  nombre;
  identificacion;
  descripcion;
  opciones = [];
  //atributos de la votacion
  tituloVotacion;
  cantidadCredenciales;
  fechaLimite;
  fechaInicio;
  votacionDescripcion;
  tipo: string;
  cantiVotos: number;
  participantes = []
  participanteParaAgregar;
  //optencion de usuarios
  nombreUsuarios = [];
  //Validacion de todo el formulario
  formularioValidado = false;
  fechaInicioValida = false;
  fechaLimiteValida = false;
  cantCredencialesValida = false;

  horaFinal = -1;
  minutoFinal = -1;
  horaInicial = -1;
  minutoInicial = -1;

  status;

  horasPosibles = []
  minutosPosibles = []

  constructor(public votacionService: VotacionService, private rutaActiva: ActivatedRoute, private router: Router, private modalService: NgbModal, private usuarioService: UsuarioService) {
    this.tipo = this.rutaActiva.snapshot.params.tipo;
    this.cantiVotos = this.rutaActiva.snapshot.params.cantiVotos;
  }

  ngOnInit(): void {

    for (let index = 0; index < 24; index++) {
      this.horasPosibles[index] = index;
    }
    for (let index = 0; index < 60; index++) {
      this.minutosPosibles[index] = index;
    }

    this.usuarioService.getUsuarios().subscribe(result => {
       let auxiliar = result;
       auxiliar.forEach(element => {
         //console.log("nombre: " + element.nombre);
         this.nombreUsuarios.push(element.nombre);
       });
       console.log(this.nombreUsuarios);
       //autocompletado
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );
    });

    this.getUsuario();
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


  getUsuario(): void {
    this.usuarioService.getUsuario()
      .subscribe(
        result => {
          this.usuario = result;
          if (this.usuario === null || this.usuario === undefined) {
            this.router.navigate(['/']);
          }
        }
      );
  }

  showModal(modal){
    this.modalService.open(modal);
  }

  crearOpcion(){
    this.opciones.push({nombre:this.nombre, descripcion:this.descripcion});
    this.nombre = '';
    this.descripcion = '';
  }

  crearVotacion(){
    let tipoDeVotacionID;
    let RespuestaVotacion;
    let IdVotacion;
    if(this.tipo == 'Popular'){
      tipoDeVotacionID = environment.popular;
    } else if(this.tipo == 'Ranking'){
      tipoDeVotacionID = environment.ranking;
    } else if(this.tipo == 'Clasificacion'){
      tipoDeVotacionID = environment.clasificacion;
    }
    if(this.descripcion == null || this.descripcion == undefined){
      this.descripcion = '';
    }

    if(this.horaInicial == -1){
      this.horaInicial = 0;
    }
    if(this.horaFinal == -1){
      this.horaFinal = 0;
    }
    if(this.minutoFinal == -1){
      this.minutoFinal = 0;
    }
    if(this.minutoInicial == -1){
      this.minutoInicial = 0;
    }

    let dateInicio = new Date(this.fechaInicio['year']+'-'+this.fechaInicio['month']+'-'+this.fechaInicio['day']);
    dateInicio.setDate(this.fechaInicio['day']);
    dateInicio.setHours(this.horaInicial);
    dateInicio.setMinutes(this.minutoInicial);
    let dateFinal = new Date(this.fechaLimite['year']+'-'+this.fechaLimite['month']+'-'+this.fechaLimite['day']);
    dateFinal.setDate(this.fechaLimite['day']);
    dateFinal.setHours(this.horaFinal);
    dateFinal.setMinutes(this.minutoFinal);
    let fechaActual = new Date();
    let valido = true;

    if(dateInicio.getTime() >= dateFinal.getTime()){
        alert("La fecha inicio debe ser menor a la fecha final");
        valido = false;
    }
    if(dateInicio.getTime() <= fechaActual.getTime()){
      alert("La fecha inicio debe ser mayor que la actual")
      valido = false;
    }
    if(dateFinal.getTime() <= fechaActual.getTime()){
      alert("La fecha final debe ser mayor que la actual")
      valido = false;
    }
    if(valido){
      let votacion = {
        titulo: this.tituloVotacion,
        autor: this.usuario.nombre,
        fechaInicio: this.fechaToString(this.fechaInicio, dateInicio),
        fechaLimite: this.fechaToString(this.fechaLimite, dateFinal),
        tipoDeVotacion: tipoDeVotacionID,
        descripcion: this.votacionDescripcion,
        votos: this.cantiVotos,
        opciones: this.opciones,
        participantes: this.participantes
      };

      console.log("DateInicio:" + dateInicio);
      console.log("DateFinal:" + dateFinal);
      this.votacionService.addVotacion(votacion).subscribe (Status => {
        let idVotacion = Status['Id']

        if(!Status['Error']){
          console.log("Se creo con exito: " + idVotacion);
          console.log(Status);
          this.router.navigate(['/VotacionLista']);
        }

      });
    }
  }

  private fechaToString(fecha, date: Date): string{
    return fecha['year']+'-'+fecha['month']+'-'+fecha['day']+' '
    +date.getHours()+':'+date.getMinutes()+':00';
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
        document.getElementById('date').setAttribute('data-content', this.msgErrorFecha);
        $('#date').popover("show");
        document.getElementById('date').classList.add('is-invalid');
        this.fechaLimiteValida = false;
      }
      else{
        console.log(true);
        $('#date').popover("hide");
        document.getElementById('date').classList.remove('is-invalid');
        this.fechaLimiteValida = true;
      }
    }
    else{
      document.getElementById('date').classList.remove('is-invalid');
      $('#date').popover("hide");
      this.fechaLimiteValida = false;
    }
    this.validarFormulario();
  }

  fechaInicioError(){
    console.log(this.fechaInicio);
    if(this.fechaInicio !== null){
      if(typeof this.fechaInicio === 'string'){
        console.log(false);
        document.getElementById('dateIni').setAttribute('title', "Error en la entrada");
        document.getElementById('dateIni').setAttribute('data-content', this.msgErrorFecha);
        $('#dateIni').popover("show");
        document.getElementById('dateIni').classList.add('is-invalid');
        this.fechaInicioValida = false;
      }
      else{
        console.log(true);
        $('#dateIni').popover("hide");
        document.getElementById('dateIni').classList.remove('is-invalid');
        this.fechaInicioValida = true;
      }
    }
    else{
      document.getElementById('dateIni').classList.remove('is-invalid');
      $('#dateIni').popover("hide");
      this.fechaInicioValida = false;
    }
    this.validarFormulario();
  }

  agregarParticipante(){
    console.log(this.participanteParaAgregar);
    if(!(this.participantes.includes(this.participanteParaAgregar))){
      if(this.nombreUsuarios.includes(this.participanteParaAgregar)){
        this.participantes.push(this.participanteParaAgregar);
      }
    }
    this.participanteParaAgregar = '';
  }

  eliminarParticipante(i: number){
    this.participantes.splice(i, 1);
  }

  eliminarOpcion(i: number){
    this.opciones.splice(i, 1);
  }

  validarFormulario(){
    if(!(this.tituloVotacion == null || this.tituloVotacion == '')){
        if(this.fechaInicioValida){
          if(this.fechaLimiteValida){
            this.formularioValidado = true;
          } else{
            this.formularioValidado = false;
          }
        } else{
          this.formularioValidado = false;
        }
    } else{
      this.formularioValidado = false;
    }

    if(this.formularioValidado){
      console.log('funcionando');
      $("#formularioEnviar").removeAttr('disabled');
    } else {
      console.log("titulo: " + this.tituloVotacion + "\ncreden: " + this.cantCredencialesValida + "\nini: " + this.fechaInicioValida + "\nfin: " + this.fechaLimiteValida);
      console.log('no funcionando');
      document.getElementById('formularioEnviar').setAttribute('disabled', 'true');
    }
  }

  errorTitulo(){
    this.validarFormulario();
  }

  credencialesError(){
    let expresionRegular = /^[0-9]{1,8}$/
    console.log(this.cantidadCredenciales);
    if(!(this.cantidadCredenciales == null || this.cantidadCredenciales == '')){
      if(this.cantidadCredenciales.match(expresionRegular)){
        console.log(true);
        $('#credencial').popover("hide");
        document.getElementById('credencial').classList.remove('is-invalid');
        this.cantCredencialesValida = true;
      }
      else{
        console.log(false);
        document.getElementById('credencial').setAttribute('title', "Error en la entrada");
        document.getElementById('credencial').setAttribute('data-content', this.msgErrorCredenciales);
        $('#credencial').popover("show");
        document.getElementById('credencial').classList.add('is-invalid');
        this.cantCredencialesValida = false;
      }
    }
    else{
      $('#credencial').popover("hide");
      document.getElementById('credencial').classList.remove('is-invalid');
      this.cantCredencialesValida = false;
    }
    this.validarFormulario();
  }


  //filtro para el autocompletado
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.nombreUsuarios.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
}
