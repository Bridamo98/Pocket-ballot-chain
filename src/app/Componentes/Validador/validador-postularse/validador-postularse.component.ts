import { Transaccion } from './../../../Modelo/Blockchain/transaccion';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Usuario } from 'src/app/Modelo/Usuario';
//peer handler
declare var inicializar: any;
declare var establecerConexion: any;
declare var enviarMensaje: any;
//blockchain
declare var imprimir: any;


@Component({
  selector: 'app-validador-postularse',
  templateUrl: './validador-postularse.component.html',
  styleUrls: ['./validador-postularse.component.css']
})
export class ValidadorPostularseComponent implements OnInit {

  usuario: Usuario = new Usuario('', 0, '', '');
  transaccion: Transaccion = new Transaccion(3, 2 , 'init' , ['brandonn', 'diegonnn'] );


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
    imprimir();
    console.log(this.transaccion);
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
