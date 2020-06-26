import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioSesionComponent } from './Componentes/Autenticacion/inicio-sesion/inicio-sesion.component';
import { AppComponent } from './app.component';
import { RegistrarComponent } from './Componentes/Autenticacion/registrar/registrar.component';
import { VotacionCrearComponent } from './Componentes/Votacion/votacion-crear/votacion-crear.component';
import { VotoRankingComponent } from './Componentes/Votacion/voto-ranking/voto-ranking.component';
const routes: Routes = [
  {path: '', component: InicioSesionComponent},
  {path: 'Registrar', component: RegistrarComponent},
  {path: 'CrearVotacion', component: VotacionCrearComponent},
  {path: 'VotoRanking', component: VotoRankingComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
