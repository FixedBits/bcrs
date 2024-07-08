
/**
 * Title: employee.service.ts
 * Author: Victor Soto
 * Date: 07/07/2024
 * Description: Service file for employees.
 */

import { Injectable } from '@angular/core'; // Import Injectable decorator
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { Observable } from 'rxjs'; // Import Observable

@Injectable({  // Decorator to mark class as injectable
  providedIn: 'root'  // Service provided in root
})
export class EmployeesService {  // Define service class

  constructor(private http: HttpClient) { }  // Inject HttpClient in constructor

  getUsers(): Observable<any> {  // Method to get users
    return this.http.get('/api/users');  // HTTP GET request
  }
}