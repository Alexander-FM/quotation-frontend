import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs';

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
    RippleModule,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  menuItems: MenuItem[] = [];
  showMenu = false;
  username: string | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    // Escuchar cambios de ruta para mostrar/ocultar menú
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.showMenu = !this.router.url.includes('/auth');
        this.username = this.authService.getUsername();
      });
  }

  ngOnInit(): void {
    this.showMenu = !this.router.url.includes('/auth');
    this.initMenu();
  }

  initMenu(): void {
    this.menuItems = [
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
          { label: 'Roles', icon: 'pi-lock', routerLink: '/employees/roles' },
          { label: 'Usuarios', icon: 'pi-user', routerLink: '/employees/users' }
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

  logout(): void {
    this.authService.logout();
  }
}
