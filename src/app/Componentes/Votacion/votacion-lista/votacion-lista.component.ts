import { ManejadorMensajesService } from './../../../Controladores/manejador-mensajes.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from 'src/app/Modelo/Usuario';
import { Votacion } from 'src/app/Modelo/Votacion';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { VotacionService } from '../../../Servicios/votacion.service';
import { UsuarioService } from '../../../Servicios/usuario.service';
import { VotarService } from '../../../Servicios/votar.service';//Para probar envio de transacciones

declare var inicializar: any;
declare var mensajesServicio: any;
declare var votarServicio: any;
declare var desconectar: any;


@Component({
  selector: 'app-votacion-lista',
  templateUrl: './votacion-lista.component.html',
  styleUrls: ['./votacion-lista.component.css']
})
export class VotacionListaComponent implements OnInit, OnDestroy {

  usuario: Usuario = new Usuario('', 0, '', '');
  votaciones: Votacion[];
  misVotaciones: Votacion[] = [];
  votacionesInscrito: Votacion[] = [];
  pasa = false; // Indica si la siguiente pantalla a la que si dirige debe mantener la conexión con los peer
  desfase = 20000;

  constructor(
    private router: Router,
    private votacionService: VotacionService,
    private usuarioService: UsuarioService,
    private mensajeServicio: ManejadorMensajesService,
    private votarService: VotarService//Para probar envio de transacciones
  ) {
    votarServicio = this.votarService;
   }

  ngOnInit(): void {
    inicializar();
    mensajesServicio = this.mensajeServicio;
    this.iniciarVista();
  }

  ngOnDestroy(): void {
    if (!this.pasa){
      this.cerrarValidador();
    }
  }

  async iniciarVista(): Promise<void> {
    this.usuario = await this.getUsuario();
    if (this.usuario === null || this.usuario === undefined) {
      this.router.navigate(['/']);
    }
    this.votaciones = await this.getVotaciones();
    this.misVotaciones = await this.getVotacionesAutor();
    await this.actualizarParticipantes(this.votaciones);
    await this.actualizarParticipantes(this.misVotaciones);
    this.actualizarVotaciones(this.votaciones);
  }

  // Solicita al servicio el usuario
  getUsuario(): Promise<Usuario> {
    return new Promise<Usuario>((resolve, reject) =>
      this.usuarioService.getUsuario().subscribe(resolve, reject)
    );
  }

  // Solicita al servicio las votaciones
  getVotaciones(): Promise<Votacion[]> {
    return new Promise<Votacion[]>((resolve, reject) =>
      this.votacionService.getVotacionesUsuarioVis().subscribe(resolve, reject)
    );
  }

  // Solicita al servicio las votaciones
  getVotacionesAutor(): Promise<Votacion[]> {
    return new Promise<Votacion[]>((resolve, reject) =>
      this.votacionService.getVotacionesAutor(this.usuario.nombre.valueOf()).subscribe(resolve, reject)
    );
  }

  getParticipantes(id: number): Promise<Usuario[]>{
    return new Promise<Usuario[]>((resolve, reject) =>
      this.votacionService.getParticipanteVotacion(id).subscribe(resolve, reject)
    );
  }

  actualizarParticipantes(votaciones: Votacion[]): Promise<void[]> {
    return Promise.all(
      votaciones.map(async votacion => {
        votacion.participantes = await this.getParticipantes(votacion.id.valueOf());
      })
    );
  }

  salir(votacion: Votacion, votaciones: Votacion[]): void {
    if (confirm('¿Está seguro de salir de esta votación?')) {
      votaciones.splice(votaciones.indexOf(votacion), 1);
      this.votacionService.deleteUsuarioVotacionVis(votacion.id.valueOf(), this.usuario.nombre.toString()).subscribe(
        result => { console.log(result) }
      );
    }
  }

  ordenarPorTitulo(votaciones: Votacion[]): void {
    votaciones.sort(function (a, b) {
      const tituloA = a.titulo.toUpperCase();
      const tituloB = b.titulo.toUpperCase();
      if (tituloA < tituloB) {
        return -1;
      }
      if (tituloA > tituloB) {
        return 1;
      }
      return 0;
    });
  }

  ordenarPorParticipantes(votaciones: Votacion[]) {
    votaciones.sort(function (a, b) {
      return a.participantes.length - b.participantes.length;
    });
  }

  crearVotacion(): void {
    this.router.navigate(['/CrearVotacion']);
  }

  verInvitaciones(): void {
    console.log('verVotaciones');
    //this.router.navigate(['*/'+this.usuario.nombre]);
  }

  async verVotacion(idVotacion: string, votaciones: Votacion[]): Promise<void> {
    const votacion = votaciones.filter(v => v.id.valueOf() === +idVotacion)[0];
    if (new Date().getTime() < new Date(votacion.fechaInicio).getTime()){
      alert('La votación no ha iniciado');
      return;
    }
    if (new Date().getTime() < new Date(votacion.fechaLimite).getTime()){
      if (!await this.comprobarVotos(+idVotacion, this.usuario.nombre.valueOf())){
        alert('No hay votos disponibles');
        return;
      }
      if (this.votaciones.filter(v => v.id.valueOf() === +idVotacion).length > 0){
        switch(votacion.tipoDeVotacion.valueOf()){
          case environment.ranking:
            this.pasa = true;
            this.router.navigate(['VotoRanking/' + idVotacion]);
            break;
          case environment.popular:
            this.pasa = true;
            this.router.navigate(['VotoPopular/' + idVotacion]);
            break;
          case environment.clasificacion:
            this.pasa = true;
            this.router.navigate(['VotoClasificacion/' + idVotacion]);
            break;
        }
      }else{
        alert('La votación no ha finalizado y el usuario no es un participante');
      }
    }else if (new Date().getTime() >= new Date(votacion.fechaLimite).getTime() + this.desfase) {
      this.pasa = true;
      this.router.navigate(['VotacionReporte/' + idVotacion]);
    }
  }

  actualizarVotaciones(votaciones: Votacion[]): void {
    for (const votacion of votaciones) {
      this.votacionesInscrito.push(votacion);
    }
  }

  verificarFecha(votacion: Votacion): string{
    const tiempo: number = new Date().getTime();
    const tiempoLimite: number = new Date(votacion.fechaLimite).getTime();
    if (tiempo < tiempoLimite){
      return "Votar";
    }else if (tiempo >= tiempoLimite && tiempo <= tiempoLimite + this.desfase){
      return "Finalizando";
    }
    return "Resultados";
  }

  verificarFechaInicial(votacion: Votacion): boolean{
    if (new Date().getTime() < new Date(votacion.fechaInicio).getTime()){
      return false;
    }
    return true;
  }

  async comprobarVotos(idVotacion: number, nombre: string): Promise<boolean>{
    const votos = await this.getVotosDisponibles(idVotacion, nombre);
    if (votos['votosDisponibles'] > 0){
      return true;
    }
    return false;
  }

  getVotosDisponibles(idVotacion: number, nombre: string): Promise<object>{
    return this.votacionService.getVotosDisponibles(idVotacion, nombre).toPromise();
  }

  cerrarValidador(): void{
    desconectar();
  }
}
