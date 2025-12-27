import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Catálogos', path: '/catalogs/items' },
    { label: 'Clientes', path: '/customers' },
    { label: 'Empleados', path: '/employees' },
    { label: 'Materiales', path: '/materials' },
    { label: 'Cotizaciones', path: '/quotations' }
  ];
}
