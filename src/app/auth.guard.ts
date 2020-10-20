import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { UsuarioService } from './Servicios/Usuario/usuario.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private usuarioService: UsuarioService, private router: Router) {}
  canActivate() {
    if (this.usuarioService.estaLogeado()) {
      this.usuarioService.setUserIsValid(true);
      return true;
    }
    this.router.navigate(['/']);
      this.usuarioService.setUserIsValid(false);
      return false;
  }

  isLoggedOut() {
    if (this.usuarioService.estaLogeado()) {
      return false;
    }
    this.router.navigate(['/Perfil']);
    return true;
  }
}
