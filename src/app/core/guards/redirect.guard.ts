import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class RedirectGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    window.location.href = route.data['externalUrl'];
    console.log('aasdaspoijfdqwperigouhjq3p4iurtghjpq3iu5rghjpiq3u4jtgpoiq3j4tpoij1');
    return true;
  }
}
