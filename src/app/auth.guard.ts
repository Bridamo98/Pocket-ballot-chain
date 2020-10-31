import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { UsuarioService } from './Servicios/Usuario/usuario.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {}
  canActivate(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.usuarioService.estaLogeado().then(
        (res) =>{
          if (res) {
            this.usuarioService.setUserIsValid(true);
            observer.next(true);
            return;
          }
          this.router.navigate(['/']);
          this.usuarioService.setUserIsValid(false);
          observer.next(false);
          return;
        }
      )

    });

  }

  isLoggedOut() {
    if (this.usuarioService.estaLogeado()) {
      return false;
    }
    this.router.navigate(['/Perfil']);
    return true;
  }
}
