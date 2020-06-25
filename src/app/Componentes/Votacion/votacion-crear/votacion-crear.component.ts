import { Component, OnInit } from '@angular/core';
import { VotacionService } from './../../../Servicios/votacion.service'
import { Votacion } from 'src/app/Modelo/Votacion';

@Component({
  selector: 'app-votacion-crear',
  templateUrl: './votacion-crear.component.html',
  styleUrls: ['./votacion-crear.component.css']
})
export class VotacionCrearComponent implements OnInit {

  votaciones: Votacion[] = [];

  constructor(public votacionService: VotacionService) { 
    
  }

  /*getVotacion(){
    this.votacionService.getVotaciones().subscribe();
  }*/

  ngOnInit() {
    this.getVotacion();
    //this.getVotacion();
  }

  getVotacion(){
    this.votacionService.getVotaciones().subscribe(res => {
      this.votaciones = res
      console.log(this.votaciones);
    });
  }

}
