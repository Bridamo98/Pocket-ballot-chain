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


const routes: Routes = [
  {path: '', component: InicioSesionComponent},
  {path: 'Registrar', component: RegistrarComponent},
  {path: 'CrearVotacion', component: VotacionCrearComponent},
  {path: 'CrearGrupo', component: GrupoCrearComponent},
  {path: 'VerGrupo/:origen/:id', component: GrupoVerComponent},
  {path: 'ListarGrupos', component: GrupoListarComponent},
  {path: 'EditarGrupo/:id', component: GrupoEditarComponent},
  {path: 'CrearVotacion', component: VotacionCrearComponent},
  {path: 'perfil/:nombre', component: UsuarioPerfilComponent},
  {path: 'perfil-editar/:nombre', component: UsuarioEditarComponent},
  {path: 'votacion-lista/:nombre', component: VotacionListaComponent},
  {path: 'votacion-reporte/:id', component: VotacionReporteComponent},
  {path: 'validador-postularse/:nombre', component: ValidadorPostularseComponent},
  {path: 'CrearVotacion/:tipo', component: VotacionCrearInformacionComponent},
  {path: 'CrearVotacion/:tipo/:cantiVotos', component: VotacionCrearInformacionComponent},
  {path: 'VotoRanking', component: VotoRankingComponent},
  {path: 'VotoClasificacion', component: VotoClasificacionComponent},
  {path: 'VotoPopular', component: VotoPopularComponent},
    {path: 'Credencial', component: CredencialComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
