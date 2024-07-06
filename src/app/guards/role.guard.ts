/**
 * DeVonte' Ellis
 * 7-5-24
 * Role Guard Creation
 */


// Imports
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
//Injectable needed as well? *test for reference*
import { Injectable } from '@angular/core';

//export role guard function
export const roleGuard: CanActivateFn = (route, state) => {
  const cookie = inject(CookieService); //injects the cookie service
  let sessionUser = JSON.parse(cookie.get('session_user')) //grabs the session_user cookie

  console.log('sessionUser', sessionUser)
  if (!sessionUser) {
    console.log('You must be logged in to have access to this page!') //if session user cookie isn't set, then the following message will appear
    //redirect to sign in page if the session user cookie isn't set.
    const router = inject(Router)
    router.navigate(['/security/signin'], { queryParams: { returnUrl: state.url }}) //redirects to signin page
    return false
  }

  //checks if sessionUser has a 'role' property. Returns false if not.
  if (sessionUser.role !== 'admin') {
    console.log('You must be an admin to access this page!');
    const router = inject(Router);
    router.navigate(['/security/signin'], { queryParams: { returnUrl: state.url }}) //redirects to signin page
    return false
  }

  return true;
};