import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-grupo-editar',
  templateUrl: './grupo-editar.component.html',
  styleUrls: ['./grupo-editar.component.css']
})
export class GrupoEditarComponent implements OnInit {
  id:string;
  constructor(private routeParams: ActivatedRoute) { }
  ngOnInit(): void {
    this.routeParams.params.subscribe(params => {
      this.id = params['id'];
    });
  }

}
