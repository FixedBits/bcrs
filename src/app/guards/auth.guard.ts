/**
 * DeVonte' Ellis
 * 7-5-24
 * Auth Guard Creation
 */

// Imports
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { session } from 'server/utils/session';


export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) =>
    {
      const router:Router = inject(Router);
      const protectedRoutes: string[] = [];
      //if protected routes don't include (state.url) & session doesn't exist, then return to home route. otherwise return false
      return protectedRoutes.includes(state.url) && !session
      ? router.navigate(['/'])
      : false;
  return true;
};