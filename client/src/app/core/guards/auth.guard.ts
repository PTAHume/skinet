import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { map } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';

@Injectable({
  providedIn: 'root',
})
class PermissionsService {
  constructor(private accountService: AccountService, private router: Router) {}

  canAccess(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.accountService.currentUserSource$.pipe(
      map((auth) => {
        if (auth) {
          return true;
        } else {
          this.router.navigate(['/account/login'], {
            queryParams: { returnUrl: state.url },
          });
          return false;
        }
      })
    );
  }
}

export const AuthGuard: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(PermissionsService).canAccess(next, state);
};
