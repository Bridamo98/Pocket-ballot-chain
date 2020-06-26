import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioSesionComponent } from './Componentes/Autenticacion/inicio-sesion/inicio-sesion.component';
import { AppComponent } from './app.component';
import { VotacionCrearComponent } from './Componentes/Votacion/votacion-crear/votacion-crear.component';
import { GrupoCrearComponent } from './Componentes/Grupo/grupo-crear/grupo-crear.component';
import { GrupoVerComponent } from './Componentes/Grupo/grupo-ver/grupo-ver.component';
import { GrupoListarComponent } from './Componentes/Grupo/grupo-listar/grupo-listar.component';
import { GrupoEditarComponent } from './Componentes/Grupo/grupo-editar/grupo-editar.component';



const routes: Routes = [
  {path: '', component: InicioSesionComponent},
  { path: 'CrearVotacion', component: VotacionCrearComponent },
  { path: 'CrearGrupo', component: GrupoCrearComponent },
  { path: 'VerGrupo/:origen/:id', component: GrupoVerComponent },
  { path: 'ListarGrupos', component: GrupoListarComponent },
  { path: 'EditarGrupo/:id', component: GrupoEditarComponent }




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
