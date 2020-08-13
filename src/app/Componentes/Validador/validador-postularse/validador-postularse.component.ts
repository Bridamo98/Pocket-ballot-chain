import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Usuario } from 'src/app/Modelo/Usuario';

declare var inicializar: any;
declare var establecerConexion: any;
declare var enviarMensaje: any;

@Component({
  selector: 'app-validador-postularse',
  templateUrl: './validador-postularse.component.html',
  styleUrls: ['./validador-postularse.component.css']
})
export class ValidadorPostularseComponent implements OnInit {

  usuario: Usuario = new Usuario('', 0, '', '');

  #peer;
  otro_peer_id;
  msj;

  constructor(
    private router: Router,
    private rutaActiva: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {  }

  ngOnInit(): void {
    inicializar();
  }

  serValidador(): void {
    console.log('serValidador');
  }

  establecerConexion():void {
    establecerConexion(this.otro_peer_id);
  }

  enviarMensaje():void{
    enviarMensaje(this.msj);
  }

}
