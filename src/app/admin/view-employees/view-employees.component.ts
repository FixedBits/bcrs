/**
 * Title: view-employees.component.ts
 * Author: Victor Soto
 * Date: 07/05/2024
 * Description: View all employees
 */

import { Component, OnInit } from '@angular/core'; // Import Angular core dependencies
import { EmployeesService } from '../../employees.service';  // Import EmployeesService

interface Employee {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phoneNumber: string;}

@Component({
  selector: 'app-root',
  templateUrl: './view-employees.component.html',
  styleUrls: ['./view-employees.component.css']
})
export class ViewEmployeesComponent implements OnInit {
  employees: Employee[] = []; // Initialize employees as an array of employees

  constructor(private employeesService: EmployeesService) { }  // Inject EmployeesService

  ngOnInit() {
   this.employeesService.getUsers().subscribe((data: Employee[]) => {  // Use EmployeesService to get users
      this.employees = data;
    });
  }
}



