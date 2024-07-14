/**
 * Title: app-routing.module.ts
 * Author: Professor Krasso
 * Updated by Victor
 * Date: 07/07/2024
 */

// imports statements
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { HomeComponent } from './home/home.component';

// Importing the not-found component
import { NotFoundComponent } from './not-found/not-found.component';

import { AdminRoutingModule } from './admin/admin-routing.module';
import { ViewEmployeesComponent } from './admin/view-employees/view-employees.component';
import { authGuard } from './guards/auth.guard';


// routes array with a path, component, and title for each route in the application (e.g. home, about, contact, etc.)
const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'BCRS: Home' // title for the home page
      },
      {
        path: 'home',
        component: HomeComponent,
        title: 'BCRS: Home'
      },
      {
        path: 'not-found',
        component: NotFoundComponent,
        title: 'BCRS: Not Found'
      },
        {
    path: 'admin/view-employees',
          component: ViewEmployeesComponent
        },
      {
    path: 'admin',
    loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule)
  },
    ]
  },
  {
    // path for the security module (e.g. login, register, forgot password, etc.)
    path: 'security',
    loadChildren: () => import('./security/security.module').then(m => m.SecurityModule)
  },
  {
    // Redirects to not-found page
    path: '**',
    redirectTo: '/not-found'
  },

];

@NgModule({
  // imports the RouterModule and defines the routes array and other options (e.g. useHash, enableTracing, scrollPositionRestoration)
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false, scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
