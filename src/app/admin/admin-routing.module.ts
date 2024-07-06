/**
 * DeVonte' Ellis
 * 7-5-24
 * Admin Routing Module
 */

// import statements
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { roleGuard } from "../guards/role.guard";
import { CanActivateFn } from '@angular/router';

//imports for component pages
import { AdminComponent } from "./admin/admin.component";
import { CreateEmployeesComponent } from "../employees/create-employees/create-employees.component";
import { DeleteEmployeesComponent } from "../employees/delete-employees/delete-employees.component";
import { EditEmployeesComponent } from "../employees/edit-employees/edit-employees.component";
import { ViewEmployeesComponent } from "../employees/view-employees/view-employees.component";

// defining main routes for the admin component
const routes: Routes = [
  {
    path:'',
    component: AdminComponent,
    children: [
      {
        path: '',
        component: CreateEmployeesComponent,
        title: 'BCRS: New Employees'
      },
      {
        path: '',
        component: DeleteEmployeesComponent,
        title: 'BCRS Delete Employees'
      },
      {path: '',
      component: EditEmployeesComponent,
      title: 'BCRS Edit Employees'
      },
      {path: '',
      component: ViewEmployeesComponent,
      title: 'BCRS View Employee'
      }
    ],
    canActivate: [roleGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AdminRoutingModule { }