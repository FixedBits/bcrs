import { AdminModule } from './admin/admin.module';
/**
 * Title: app-routing.module.ts
 * Author: Professor Krasso
 * Updated by Victor
 * Date: 07/07/2024
 */

// imports statements
import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { HomeComponent } from './home/home.component';
import { FaqComponent } from './faq/faq.component';

// Importing the not-found component
import { NotFoundComponent } from './not-found/not-found.component';

import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

// Importing the directory component
import { DirectoryComponent } from './directory/directory.component';

// Importing the Pie-Chart component
import { PieGraphComponent } from './pie-graph/pie-graph.component';
import { ServiceRepairComponent } from './service-repair/service-repair.component';
import { InvoiceComponent } from './service-repair/invoice/invoice.component';
import { MyProfileComponent } from './profile/profile.component';

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
        path: 'faq',
        component: FaqComponent,
        title: 'BCRS: Faq'
      },
      {
        path: 'service-repair',
        component: ServiceRepairComponent,
        title: 'BCRS: Service Repair Form'
      },
      {
        path: 'invoice',
        component: InvoiceComponent,
        title: 'BCRS: Invoice'
      },
      {
        path: 'directory',
        component: DirectoryComponent,
        title: 'BCRS: Employee Directory'
      },
      {
        path: 'pie-graph',
      component: PieGraphComponent,
        title: 'BCRS: Pie Graph'
      },
      {
        path: 'profile',
        component: MyProfileComponent,
        title: 'BCRS: My Profile'
      }
    ],
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
    // path for the security module (e.g. login, register, forgot password, etc.)
    // lazy loading means that it will only be loaded once it is requested(when you click on it)
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
