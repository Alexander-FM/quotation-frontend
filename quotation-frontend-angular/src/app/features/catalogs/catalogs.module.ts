import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CatalogsRoutingModule } from './catalogs-routing.module';
import { CatalogsComponent } from './catalogs.component';
import { ItemsComponent } from './items/items.component';
import { UnitsComponent } from './units/units.component';
import { FactorsComponent } from './factors/factors.component';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    CatalogsComponent,
    ItemsComponent,
    UnitsComponent,
    FactorsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    CatalogsRoutingModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ToolbarModule,
    ToastModule
  ]
})
export class CatalogsModule { }
