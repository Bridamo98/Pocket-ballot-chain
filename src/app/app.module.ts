import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioSesionComponent } from './Componentes/Autenticacion/inicio-sesion/inicio-sesion.component';
import { VotacionCrearComponent } from './Componentes/Votacion/votacion-crear/votacion-crear.component';

//servicios
import { VotacionService } from './Servicios/votacion.service';
import { VotacionCrearInformacionComponent } from './Componentes/Votacion/votacion-crear-informacion/votacion-crear-informacion.component'

@NgModule({
  declarations: [
    AppComponent,
    InicioSesionComponent,
    VotacionCrearComponent,
    VotacionCrearInformacionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    VotacionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
