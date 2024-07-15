import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistrationModel } from './registration-model';
import { Observable } from 'rxjs';

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
}