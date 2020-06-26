import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioSesionComponent } from './Componentes/Autenticacion/inicio-sesion/inicio-sesion.component';
import { VotacionCrearComponent } from './Componentes/Votacion/votacion-crear/votacion-crear.component';
import { RegistrarComponent } from './Componentes/Autenticacion/registrar/registrar.component';
import {FormsModule} from '@angular/forms';
import { VotoRankingComponent } from './Componentes/Votacion/voto-ranking/voto-ranking.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    InicioSesionComponent,
    VotacionCrearComponent,
    RegistrarComponent,
    VotoRankingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
