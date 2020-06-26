import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioSesionComponent } from './Componentes/Autenticacion/inicio-sesion/inicio-sesion.component';
import { AppComponent } from './app.component';
import { VotacionCrearComponent } from './Componentes/Votacion/votacion-crear/votacion-crear.component';
import { UsuarioPerfilComponent } from './Componentes/Usuario/usuario-perfil/usuario-perfil.component';
import { UsuarioEditarComponent } from './Componentes/Usuario/usuario-editar/usuario-editar.component';
import { VotacionListaComponent } from './Componentes/Votacion/votacion-lista/votacion-lista.component';
import { VotacionReporteComponent } from './Componentes/Votacion/votacion-reporte/votacion-reporte.component';
import { ValidadorPostularseComponent } from './Componentes/Validador/validador-postularse/validador-postularse.component';
import { VotacionCrearInformacionComponent } from './Componentes/Votacion/votacion-crear-informacion/votacion-crear-informacion.component';


const routes: Routes = [
  {path: '', component: InicioSesionComponent},
  {path: 'CrearVotacion', component: VotacionCrearComponent},
  {path: 'perfil/:nombre', component: UsuarioPerfilComponent},
  {path: 'perfil-editar/:nombre', component: UsuarioEditarComponent},
  {path: 'votacion-lista/:nombre', component: VotacionListaComponent},
  {path: 'votacion-reporte/:titulo', component: VotacionReporteComponent},
  {path: 'validador-postularse/:nombre', component: ValidadorPostularseComponent},
  {path: 'CrearVotacionInfo', component: VotacionCrearInformacionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
