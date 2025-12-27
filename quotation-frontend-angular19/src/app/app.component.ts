import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MenubarModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    RippleModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi-home',
      routerLink: '/dashboard'
    },
    {
      label: 'Catalogos',
      icon: 'pi-book',
      items: [
        { label: 'Unidad de medida', icon: 'pi-compass', routerLink: '/catalogs/units' },
        { label: 'Items', icon: 'pi-list', routerLink: '/catalogs/items' },
        { label: 'Ajuste de factor', icon: 'pi-sliders-h', routerLink: '/catalogs/factors' }
      ]
    },
    {
      label: 'Clientes',
      icon: 'pi-users',
      routerLink: '/customers'
    },
    {
      label: 'Empleados',
      icon: 'pi-id-card',
      items: [
        { label: 'Empleados', icon: 'pi-briefcase', routerLink: '/employees' },
        { label: 'Roles', icon: 'pi-lock', disabled: true },
        { label: 'Usuarios', icon: 'pi-user', disabled: true }
      ]
    },
    {
      label: 'Cotizaciones',
      icon: 'pi-wallet',
      items: [
        { label: 'Modulos', icon: 'pi-sitemap', disabled: true },
        { label: 'Cotizaciones', icon: 'pi-file-edit', routerLink: '/quotations' }
      ]
    },
    {
      label: 'Materiales',
      icon: 'pi-box',
      routerLink: '/materials'
    }
  ];
}
