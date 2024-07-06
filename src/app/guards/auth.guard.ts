/**
 * DeVonte' Ellis
 * 7-5-24
 * Role Guard Creation
 */


// Imports

import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  return true;
};
