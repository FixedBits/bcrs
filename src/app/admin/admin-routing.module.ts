/**
 * DeVonte' Ellis
 * 7-5-24
 * Admin Routing Module
 */

// import statements
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { roleGuard } from "../guards/role.guard";

//imports for component pages
import { AdminComponent } from "./admin.component";
import { CreateEmployeesComponent } from "../admin/create-employees/create-employees.component";
import { DeleteEmployeesComponent } from "../admin/delete-employees/delete-employees.component";
import { EditEmployeesComponent } from "../admin/edit-employees/edit-employees.component";
import { ViewEmployeesComponent } from "../admin/view-employees/view-employees.component";

// defining main routes for the admin component
const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'create-employees',
        component: CreateEmployeesComponent,
        title: 'BCRS: New Employees'
      },
      {
        path: 'delete-employees',
        component: DeleteEmployeesComponent,
        title: 'BCRS Delete Employees'
      },
      {
        path: 'edit-employees',
        component: EditEmployeesComponent,
        title: 'BCRS Edit Employees'
      },
      {
        path: 'view-employees',
        component: ViewEmployeesComponent,
        title: 'BCRS View Employee'
      }
    ],
    canActivate: [roleGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminRoutingModule { }