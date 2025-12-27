import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'dashboard' },
	{
		path: 'dashboard',
		loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then((m) => m.DashboardComponent)
	},
	{
		path: 'catalogs',
		children: [
			{
				path: 'items',
				loadComponent: () => import('./features/catalogs/items/items.component').then((m) => m.ItemsComponent)
			},
			{
				path: 'units',
				loadComponent: () => import('./features/catalogs/units/units.component').then((m) => m.UnitsComponent)
			},
			{
				path: 'factors',
				loadComponent: () => import('./features/catalogs/factors/factors.component').then((m) => m.FactorsComponent)
			},
			{ path: '', pathMatch: 'full', redirectTo: 'items' }
		]
	},
	{
		path: 'customers',
		loadComponent: () => import('./features/customers/customers/customers.component').then((m) => m.CustomersComponent)
	},
	{
		path: 'employees',
		loadComponent: () => import('./features/employees/employees/employees.component').then((m) => m.EmployeesComponent)
	},
	{
		path: 'materials',
		loadComponent: () => import('./features/materials/materials/materials.component').then((m) => m.MaterialsComponent)
	},
	{
		path: 'quotations',
		loadComponent: () => import('./features/quotations/quotations/quotations.component').then((m) => m.QuotationsComponent)
	},
	{ path: '**', redirectTo: 'dashboard' }
];
