import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-validador',
  templateUrl: './validador.component.html',
  styleUrls: ['./validador.component.css']
})
export class ValidadorComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    inicializar();

    this.listenerSocket.listen('voto').subscribe((data) => {

      console.log("Data recibida:", data);
      if(peer.id === data['peerValidador']){

        console.log("Mi peer id es: " + data['peerValidador']);
        console.log("Me llego esto: " + data['firma']);
        console.log("Me llego esto: " + data['firmaKey']);

        if(this.mensajeServicio.checkSing(data['voto'], data['firma'], data['firmaKey'])){
          console.log('FIRMA CORRECTA');
        }
        else{
          console.log('FIRMA ERRADA');
        }

        console.log("Voto: " + data['voto']);
        console.log('Decript: ' + this.mensajeServicio.decrypt(data['voto']));
        //validar firma
      }
    });

  }

}
