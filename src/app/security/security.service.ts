import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistrationModel } from './registration-model';
import { Observable } from 'rxjs';
import { selectedSecurityQuestionsModel } from './security-questions-model';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private http: HttpClient) { }

  signIn(email: string, password: string) {
    return this.http.post('/api/security/signin', {email, password})
  }

  registration(user: RegistrationModel) {
    //console.log(user)
    return this.http.post('/api/security/registration', {user})
  }

  verifyEmail(email: string) {
    //returns the verifyEmail function
    return this.http.post('api/security/verify/employees/' + email, {})
  }

  changePassword(email: string, password: string): Observable<any> {
    return this.http.post('api/security/users' + email + '/reset-password', { password }) //returns the changePassword function
  }

  findSelectedSecurityQuestions(email: string){
    return this.http.get('/api/verify/' + email + '/security-questions')
  }

  //returns the verifySecurityQuestions function
  verifySecurityQuestions(email: string, securityQuestions: selectedSecurityQuestionsModel[]): Observable<any> {
    return this.http.post('/api/users' + email + '/security-questions', {securityQuestions})
  }
}