
 /**
 * Title: view-employees.component.ts
 * Author: Victor Soto
 * Date: 07/05/2024
 * Description: View all employees
 */

import { Component, OnInit } from '@angular/core'; // Import Angular core dependencies
import { EmployeesService } from '../../employees.service';  // Import EmployeesService
import { ActivatedRoute, Router } from '@angular/router';

interface Employee {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phoneNumber: string;
  _id: string;
  isDisabled: boolean;
}

@Component({
  selector: 'app-view-employees',
  templateUrl: './view-employees.component.html',
  styleUrls: ['./view-employees.component.css']
})



export class ViewEmployeesComponent implements OnInit {
  employees: Employee[] = []; // Initialize employees as an array of employees
  isDisabled: boolean;

  constructor(
    private employeesService: EmployeesService) {
      this.isDisabled = true
    }  // Inject EmployeesService

    ngOnInit() {
    this.employeesService.getUsers().subscribe((data: Employee[]) => {  // Use EmployeesService to get users
      this.employees = data;
    });
  }

   // A function to disable the user
  deleteUser(_id: string) {

    if(_id !== undefined){
      if(!confirm(`Are you sure you want to disable this employee?`)) {
        return;
      }

      this.employeesService.deleteUser(_id).subscribe({



      next: response => {
        console.log('User disabled successfully.', response);

      },

      error: error => {
        console.error('Error disabling user', error);
      }
    });
    } else {
      console.log('The _id is undefined.')
    }
  }
}






