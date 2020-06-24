import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioSesionComponent } from './Componentes/Autenticacion/inicio-sesion/inicio-sesion.component';
import { AppComponent } from './app.component';
import { VotacionCrearComponent } from './Componentes/Votacion/votacion-crear/votacion-crear.component';
import { UsuarioPerfilComponent } from './Componentes/Usuario/usuario-perfil/usuario-perfil.component';
import { UsuarioEditarComponent } from './Componentes/Usuario/usuario-editar/usuario-editar.component';
import { VotacionListaComponent } from './Componentes/Votacion/votacion-lista/votacion-lista.component';


const routes: Routes = [
  {path: '', component: InicioSesionComponent},
  {path: 'CrearVotacion', component: VotacionCrearComponent},
  {path: 'perfil/:name', component: UsuarioPerfilComponent},
  {path: 'perfil-eidtar/:name', component: UsuarioEditarComponent},
  {path: 'votacion-lista/:name', component: VotacionListaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
