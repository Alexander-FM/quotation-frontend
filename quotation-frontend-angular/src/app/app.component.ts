import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  menuItems: MenuItem[] = [];
  sidebarItems: MenuItem[] = [];

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Dashboard',
        icon: 'pi pi-home',
        routerLink: ['/']
      }
    ];

    this.sidebarItems = [
      {
        label: 'Catálogos',
        icon: 'pi pi-list',
        items: [
          { label: 'Items', icon: 'pi pi-circle', routerLink: ['/catalogs/items'] },
          { label: 'Unidades de medida', icon: 'pi pi-circle', routerLink: ['/catalogs/units'] },
          { label: 'Ajustes de factor', icon: 'pi pi-circle', routerLink: ['/catalogs/factors'] }
        ]
      },
      {
        label: 'Entidades',
        icon: 'pi pi-users',
        items: [
          { label: 'Clientes', icon: 'pi pi-user', routerLink: ['/customers'] },
          { label: 'Empleados', icon: 'pi pi-id-card', routerLink: ['/employees'] },
          { label: 'Materiales', icon: 'pi pi-box', routerLink: ['/materials'] }
        ]
      },
      {
        label: 'Cotizaciones',
        icon: 'pi pi-file',
        items: [
          { label: 'Listado', icon: 'pi pi-list', routerLink: ['/quotations'] },
          { label: 'Módulos', icon: 'pi pi-th-large', routerLink: ['/quotations/modules'] }
        ]
      }
    ];
  }
}
