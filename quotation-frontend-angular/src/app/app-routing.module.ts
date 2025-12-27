import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'catalogs',
    loadChildren: () => import('./features/catalogs/catalogs.module').then(m => m.CatalogsModule)
  },
  {
    path: 'customers',
    loadChildren: () => import('./features/customers/customers.module').then(m => m.CustomersModule)
  },
  {
    path: 'employees',
    loadChildren: () => import('./features/employees/employees.module').then(m => m.EmployeesModule)
  },
  {
    path: 'materials',
    loadChildren: () => import('./features/materials/materials.module').then(m => m.MaterialsModule)
  },
  {
    path: 'quotations',
    loadChildren: () => import('./features/quotations/quotations.module').then(m => m.QuotationsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
