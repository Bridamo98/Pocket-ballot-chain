import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthGuard } from './auth.guard';


import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InicioSesionComponent } from './Componentes/Autenticacion/inicio-sesion/inicio-sesion.component';
import { VotacionCrearComponent } from './Componentes/Votacion/votacion-crear/votacion-crear.component';

import { RegistrarComponent } from './Componentes/Autenticacion/registrar/registrar.component';
import { VotoRankingComponent } from './Componentes/Votacion/voto-ranking/voto-ranking.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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

//servicios
import { VotacionService } from './Servicios/votacion.service';
import { OpcionService } from './Servicios/Opcion/opcion.service';
import { CredencialService } from './Servicios/Credencial/credencial.service';
import { UsuarioService } from './Servicios/Usuario/usuario.service';
import { VotacionCrearInformacionComponent } from './Componentes/Votacion/votacion-crear-informacion/votacion-crear-informacion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CredencialComponent } from './Componentes/Autenticacion/credencial/credencial.component';
import { TokenInterceptorService } from './Servicios/token-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    InicioSesionComponent,
    VotacionCrearComponent,
    RegistrarComponent,
    VotoRankingComponent,
    VotoClasificacionComponent,
    VotoPopularComponent,
    GrupoCrearComponent,
    GrupoVerComponent,
    GrupoListarComponent,
    GrupoEditarComponent,
    UsuarioPerfilComponent,
    UsuarioEditarComponent,
    VotacionListaComponent,
    VotacionReporteComponent,
    ValidadorPostularseComponent,
    VotacionCrearInformacionComponent,
    CredencialComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    VotacionService,
    OpcionService,
    CredencialService,
    UsuarioService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
