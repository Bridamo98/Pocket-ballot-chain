import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioSesionComponent } from './Componentes/Autenticacion/inicio-sesion/inicio-sesion.component';
import { AppComponent } from './app.component';
import { RegistrarComponent } from './Componentes/Autenticacion/registrar/registrar.component';
import { VotacionCrearComponent } from './Componentes/Votacion/votacion-crear/votacion-crear.component';
import { VotoRankingComponent } from './Componentes/Votacion/voto-ranking/voto-ranking.component';
import { VotoClasificacionComponent } from './Componentes/Votacion/voto-clasificacion/voto-clasificacion.component';
import { VotoPopularComponent } from './Componentes/Votacion/voto-popular/voto-popular.component';
import { GrupoCrearComponent } from './Componentes/Grupo/grupo-crear/grupo-crear.component';
import { GrupoVerComponent } from './Componentes/Grupo/grupo-ver/grupo-ver.component';
import { GrupoListarComponent } from './Componentes/Grupo/grupo-listar/grupo-listar.component';
import { GrupoEditarComponent } from './Componentes/Grupo/grupo-editar/grupo-editar.component';
import { UsuarioPerfilComponent } from './Componentes/Usuario/usuario-perfil/usuario-perfil.component';
import { UsuarioEditarComponent } from './Componentes/Usuario/usuario-editar/usuario-editar.component';
import { VotacionListaComponent } from './Componentes/Votacion/votacion-lista/votacion-lista.component';
import { VotacionReporteComponent } from './Componentes/Votacion/votacion-reporte/votacion-reporte.component';
import { ValidadorPostularseComponent } from './Componentes/Validador/validador-postularse/validador-postularse.component';
import { VotacionCrearInformacionComponent } from './Componentes/Votacion/votacion-crear-informacion/votacion-crear-informacion.component';
import { CredencialComponent } from './Componentes/Autenticacion/credencial/credencial.component';
import { AuthGuard } from './auth.guard';
import { ValidadorComponent } from './Componentes/Validador/validador/validador.component';

const routes: Routes = [
  {path: '', component: InicioSesionComponent},
  {path: 'Registrar', component: RegistrarComponent },
  {path: 'CrearGrupo', component: GrupoCrearComponent, canActivate: [AuthGuard]},
  {path: 'VerGrupo/:origen/:id', component: GrupoVerComponent, canActivate: [AuthGuard]},
  {path: 'ListarGrupos', component: GrupoListarComponent, canActivate: [AuthGuard]},
  {path: 'EditarGrupo/:id', component: GrupoEditarComponent, canActivate: [AuthGuard]},
  {path: 'CrearGrupo', component: GrupoCrearComponent},
  {path: 'VerGrupo/:origen/:id', component: GrupoVerComponent},
  {path: 'ListarGrupos', component: GrupoListarComponent},
  {path: 'EditarGrupo/:id', component: GrupoEditarComponent},
  {path: 'Inicio', component: UsuarioPerfilComponent, canActivate: [AuthGuard]},
  {path: 'PerfilEditar', component: UsuarioEditarComponent, canActivate: [AuthGuard]},
  {path: 'VotacionLista', component: VotacionListaComponent, canActivate: [AuthGuard]},
  {path: 'VotacionReporte/:id', component: VotacionReporteComponent},
  {path: 'ValidadorPostularse', component: ValidadorPostularseComponent, canActivate: [AuthGuard]},
  {path: 'CrearVotacion', component: VotacionCrearComponent, canActivate: [AuthGuard]},
  {path: 'TipoVotacion/:grupo', component: VotacionCrearComponent, canActivate: [AuthGuard]},
  {path: 'CrearVotacion/:tipo', component: VotacionCrearInformacionComponent, canActivate: [AuthGuard]},
  {path: 'CrearVotacion/:tipo/:grupo', component: VotacionCrearInformacionComponent, canActivate: [AuthGuard]},
  {path: 'CrearVotacion/:tipo/:cantiVotos', component: VotacionCrearInformacionComponent, canActivate: [AuthGuard]},
  {path: 'CrearVotacion/:tipo/:cantiVotos/:grupo', component: VotacionCrearInformacionComponent, canActivate: [AuthGuard]},
  {path: 'VotoRanking/:id', component: VotoRankingComponent, canActivate: [AuthGuard]},
  {path: 'VotoClasificacion/:id', component: VotoClasificacionComponent, canActivate: [AuthGuard]},
  {path: 'VotoPopular/:id', component: VotoPopularComponent, canActivate: [AuthGuard]},
  {path: 'Credencial', component: CredencialComponent, canActivate: [AuthGuard]},
  {path: 'Validador', component: ValidadorComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
