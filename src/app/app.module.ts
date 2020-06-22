import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioSesionComponent } from './Componentes/Autenticacion/inicio-sesion/inicio-sesion.component';
import { VotacionCrearComponent } from './Componentes/Votacion/votacion-crear/votacion-crear.component';
import { UsuarioPerfilComponent } from './Componentes/Usuario/usuario-perfil/usuario-perfil.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioSesionComponent,
    VotacionCrearComponent,
    UsuarioPerfilComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
