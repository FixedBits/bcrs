import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminComponent } from "./admin.component";
import { ViewEmployeesComponent } from "./view-employees/view-employees.component";
import { CreateEmployeesComponent } from "./create-employees/create-employees.component";
import { DeleteEmployeesComponent } from "./delete-employees/delete-employees.component";
import { EditEmployeesComponent } from "./edit-employees/edit-employees.component";
import { RouterModule } from "@angular/router";
import { PieGraphComponent } from "./pie-graph/pie-graph.component";

@NgModule({
  declarations: [
    AdminComponent,
    ViewEmployeesComponent,
    CreateEmployeesComponent,
    DeleteEmployeesComponent,
    EditEmployeesComponent,
    PieGraphComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  exports: [
    AdminComponent,
    ViewEmployeesComponent,
    CreateEmployeesComponent,
    DeleteEmployeesComponent,
    EditEmployeesComponent,
    RouterModule
  ]
})

export class AdminModule {}