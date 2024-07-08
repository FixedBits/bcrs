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
import { ViewEmployeesComponent } from './employees/view-employees/view-employees.component';
import { EditEmployeesComponent } from './employees/edit-employees/edit-employees.component';
import { DeleteEmployeesComponent } from './employees/delete-employees/delete-employees.component';
import { CreateEmployeesComponent } from './employees/create-employees/create-employees.component';
import { AdminComponent } from './admin/admin/admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BaseLayoutComponent,
    NavComponent,
    FooterComponent,
    FaqComponent,
    ProfileComponent,
    ViewEmployeesComponent,
    EditEmployeesComponent,
    DeleteEmployeesComponent,
    CreateEmployeesComponent,
    AdminComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }