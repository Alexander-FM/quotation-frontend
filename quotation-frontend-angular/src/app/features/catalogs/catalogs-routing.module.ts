import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsComponent } from './items/items.component';
import { UnitsComponent } from './units/units.component';
import { FactorsComponent } from './factors/factors.component';

const routes: Routes = [
  { path: 'items', component: ItemsComponent },
  { path: 'units', component: UnitsComponent },
  { path: 'factors', component: FactorsComponent },
  { path: '', redirectTo: 'items', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogsRoutingModule { }
