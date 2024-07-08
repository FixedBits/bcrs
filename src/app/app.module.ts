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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotFoundComponent } from './not-found/not-found.component';
import { EditEmployeesComponent } from './admin/edit-employees/edit-employees.component';
import { DeleteEmployeesComponent } from './admin/delete-employees/delete-employees.component';
import { CreateEmployeesComponent } from './admin/create-employees/create-employees.component';
import { ViewEmployeesComponent } from './admin/view-employees/view-employees.component';
import { EmployeesService } from './employees.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    BaseLayoutComponent,
    NavComponent,
    FooterComponent,
    EditEmployeesComponent,
    DeleteEmployeesComponent,
    CreateEmployeesComponent,
    ViewEmployeesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [EmployeesService],
  bootstrap: [AppComponent],
})
export class AppModule { }