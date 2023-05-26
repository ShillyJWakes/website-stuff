import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) {}
  //checks if user is already logged in and redirects them to their home page
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser && currentUser.id) {
      this.router.navigate([currentUser.userRoles![0].role?.role]);
      return false;
    } else {
      return true;
    }
  }
}
