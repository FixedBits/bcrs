import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  constructor(private http: HttpClient) { }

  signIn(email: string, password: string) {
    return this.http.post('/api/security/signin', {email, password})
  }
}
