/**
 * Author: Evelyn, Devonte, Victor
 * Date: 7/7/24
 * Title: security.service.ts
 * Description: A service that returns API routes.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistrationModel } from './registration-model';
import { Observable } from 'rxjs';
import { selectedSecurityQuestionsModel } from './security-questions-model';

@Injectable({
  providedIn: 'root'
})

/**
 * A service is a way of reusing code.
 * The API calls might be reused.
 * For example if you create additional components that are
 * making a call to the same API.
 * So if another part of the application needs to GET an email
 * you can easily call the function inside the service.
 */

export class SecurityService {

  constructor(private http: HttpClient) { }

  signIn(email: string, password: string) {
    return this.http.post('/api/security/signin', {email, password})
  }

  registration(user: RegistrationModel) {
    //console.log(user)
    return this.http.post('/api/register/registration', {user})
  }

  verifyEmail(email: string) {
    //returns the verifyEmail function
    return this.http.post('api/security/employees/' + email, {})
  }

  changePassword(email: string, password: string): Observable<any> {
    return this.http.post('api/security/verify/users/' + email + '/reset-password', { password }) //returns the changePassword function
  }

  findSelectedSecurityQuestions(email: string){
    return this.http.get('/api/security/verify/users/' + email + '/security-questions')
  }

  //returns the verifySecurityQuestions function
  verifySecurityQuestions(email: string, securityQuestions: selectedSecurityQuestionsModel[]): Observable<any> {
    return this.http.post('/api/security/verify/users/' + email + '/security-questions', {securityQuestions})
  }
}