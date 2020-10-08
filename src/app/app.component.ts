import { Component } from '@angular/core';
import { Usuario } from './Modelo/Usuario';

declare var $: any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {

  title = 'pocket-ballot-chain';

  usuario = new Usuario("Diego", 1200, "yo@aaa", "Aadadsd");

  ngOnInit(): void {
    //$('.btn-danger').html("");
    //document.getElementsByClassName('btn-danger').innerHtml = "<i class='far fa-trash-alt'></i>";
  }
}
