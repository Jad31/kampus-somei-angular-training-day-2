import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MissionGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Simuler une vérification d'autorisation
    const isAuthorized = Math.random() > 0.2; // 80% de chance d'être autorisé

    if (!isAuthorized) {
      return this.router.createUrlTree(['/']); // Redirection vers la page d'accueil
    }

    return true;
  }
}
