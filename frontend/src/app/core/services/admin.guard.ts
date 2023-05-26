import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthService
  ) {}
  //checks if user is admin before allowing them onto the page. Or redirects to /unauthorized
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.authenticationService.currentUserValue;
    if (
      currentUser?.userRoles?.filter(
        (userRole) => userRole?.role?.role === 'admin'
      ).length
    ) {
      return true;
    }
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
