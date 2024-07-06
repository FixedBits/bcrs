/**
 * Title: app.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 */

// imports statements
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { NavComponent } from './layouts/nav/nav.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { FaqComponent } from './faq/faq.component';
import { ProfileComponent } from './profile/profile.component';
import { EmployeeListComponent } from './admin/employees/employee-list/employee-list.component';
import { EmployeeCreateComponent } from './admin/employees/employee-create/employee-create.component';
import { EmployeeDeleteComponent } from './admin/employees/employee-delete/employee-delete.component';
import { ViewEmployeesComponent } from './employees/view-employees/view-employees.component';
import { EditEmployeesComponent } from './employees/edit-employees/edit-employees.component';
import { DeleteEmployeesComponent } from './employees/delete-employees/delete-employees.component';
import { CreateEmployeesComponent } from './employees/create-employees/create-employees.component';
import { AdminComponent } from './admin/admin/admin.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BaseLayoutComponent,
    NavComponent,
    FooterComponent,
    FaqComponent,
    ProfileComponent,
    EmployeeListComponent,
    EmployeeCreateComponent,
    EmployeeDeleteComponent,
    ViewEmployeesComponent,
    EditEmployeesComponent,
    DeleteEmployeesComponent,
    CreateEmployeesComponent,
    AdminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
