import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioSesionComponent } from './Componentes/Autenticacion/inicio-sesion/inicio-sesion.component';
import { VotacionCrearComponent } from './Componentes/Votacion/votacion-crear/votacion-crear.component';
import { UsuarioPerfilComponent } from './Componentes/Usuario/usuario-perfil/usuario-perfil.component';
import { UsuarioEditarComponent } from './Componentes/Usuario/usuario-editar/usuario-editar.component';

@NgModule({
  declarations: [
    AppComponent,
    InicioSesionComponent,
    VotacionCrearComponent,
    UsuarioPerfilComponent,
    UsuarioEditarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
