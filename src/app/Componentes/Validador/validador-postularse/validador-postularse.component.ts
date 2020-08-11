import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { Usuario } from 'src/app/Modelo/Usuario';

declare var Peer: any;

@Component({
  selector: 'app-validador-postularse',
  templateUrl: './validador-postularse.component.html',
  styleUrls: ['./validador-postularse.component.css']
})
export class ValidadorPostularseComponent implements OnInit {

  usuario: Usuario = new Usuario('', 0, '', '');

  peer;
  conn;
  peer_id;
  otro_peer_id;
  msj;

  constructor(
    private router: Router,
    private rutaActiva: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {  }

  ngOnInit(): void {

    this.peer = new Peer({
      host: location.hostname,
      port: 9000,
      path: '/peerjs'
    });
    setTimeout(() => {
      this.peer_id = this.peer.id
    }, 3000);
    

    this.peer.on('connection', function (connection) {
      this.conn = connection;
      this.peer_id = connection.peer;
      console.log('peer connection: ' + this.peer_id);
      this.conn.on('data', function (data) {
        // Will print 'this is a test'
        console.log(data);
      });
    });

    this.peer.on('error', function (err) {
      alert('Error: ' + err);
      console.log(err);
    })
  }

  serValidador(): void {
    console.log('serValidador');
    //this.router.navigate(['*/'+this.usuario.nombre]);
  }

  establecerConexion():boolean {
    
    if (this.otro_peer_id) {
      this.peer_id = this.otro_peer_id;
      this.conn = this.peer.connect(this.peer_id);
      this.conn.on('open', function () {
        this.conn.send('confirmacion');
        console.log('Enviando confirmacion');
      });
      this.conn.on('data', function (data) {
        console.log(data);
      });
    } else {
      alert('Ingresa un peerId');
      return false;
    }
  }

  enviarMensaje():void{
    
    console.log('Enviando mensaje ' + this.msj);
    this.conn.send(this.msj); 
  }

}
