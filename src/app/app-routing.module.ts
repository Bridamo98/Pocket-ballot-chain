import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioSesionComponent } from './Componentes/Autenticacion/inicio-sesion/inicio-sesion.component';
import { AppComponent } from './app.component';
import { RegistrarComponent } from './Componentes/Autenticacion/registrar/registrar.component';
import { VotacionCrearComponent } from './Componentes/Votacion/votacion-crear/votacion-crear.component';
import { VotoRankingComponent } from './Componentes/Votacion/voto-ranking/voto-ranking.component';
import { VotoClasificacionComponent } from './Componentes/Votacion/voto-clasificacion/voto-clasificacion.component';
import { VotoPopularComponent } from './Componentes/Votacion/voto-popular/voto-popular.component';
const routes: Routes = [
  {path: '', component: InicioSesionComponent},
  {path: 'Registrar', component: RegistrarComponent},
  {path: 'CrearVotacion', component: VotacionCrearComponent},
  {path: 'VotoRanking', component: VotoRankingComponent},
  {path: 'VotoClasificacion', component: VotoClasificacionComponent},
  {path: 'VotoPopular', component: VotoPopularComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
