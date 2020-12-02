﻿import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';

import {AccountService} from '@app/services';

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private accountService: AccountService
  ) {
  }

  canActivate(): boolean {
    if (this.accountService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
    return !this.accountService.isLoggedIn();
  }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //   const account = this.accountService.accountValue;
  //   if (account) {
  //     // check if route is restricted by role
  //     if (!account.isAdmin) {
  //       // role not authorized so redirect to home page
  //       this.router.navigate(['/home']);
  //       return false;
  //     }
  //
  //     // authorized so return true
  //     return true;
  //   }
  //
  //   // not logged in so redirect to login page with the return url
  //   this.router.navigate(['/account/login'], {queryParams: {returnUrl: state.url}});
  //   return false;
  // }
}
