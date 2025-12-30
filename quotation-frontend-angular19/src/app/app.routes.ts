import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'auth/login' },
	{
		path: 'auth',
		children: [
			{
				path: 'login',
				loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent)
			},
			{ path: '', pathMatch: 'full', redirectTo: 'login' }
		]
	},
	{
		path: 'dashboard',
		canActivate: [authGuard],
		loadComponent: () => import('./features/dashboard/dashboard/dashboard.component').then((m) => m.DashboardComponent)
	},
	{
		path: 'catalogs',
		canActivate: [authGuard],
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
		canActivate: [authGuard],
		loadComponent: () => import('./features/customers/customers/customers.component').then((m) => m.CustomersComponent)
	},
	{
		path: 'employees',
		canActivate: [authGuard],
		children: [
			{
				path: 'roles',
				loadComponent: () => import('./features/employees/roles/roles.component').then((m) => m.RolesComponent)
			},
			{
				path: 'users',
				loadComponent: () => import('./features/employees/users/users.component').then((m) => m.UsersComponent)
			},
			{
				path: '',
				loadComponent: () => import('./features/employees/employees/employees.component').then((m) => m.EmployeesComponent)
			}
		]
	},
	{
		path: 'materials',
		canActivate: [authGuard],
		loadComponent: () => import('./features/materials/materials/materials.component').then((m) => m.MaterialsComponent)
	},
	{
		path: 'quotations',
		canActivate: [authGuard],
		children: [
			{
				path: 'modules',
				loadComponent: () => import('./features/quotations/modules/modules.component').then((m) => m.ModulesComponent)
			},
			{
				path: '',
				loadComponent: () => import('./features/quotations/quotations/quotations.component').then((m) => m.QuotationsComponent)
			}
		]
	},
	{ path: '**', redirectTo: 'auth/login' }
];
