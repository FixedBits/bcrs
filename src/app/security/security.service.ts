import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistrationModel } from './registration-model';

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
}
