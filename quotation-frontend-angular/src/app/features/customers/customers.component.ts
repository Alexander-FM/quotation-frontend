import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CustomerService } from '../../core/services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  providers: [MessageService]
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  customer: any = {};
  customerDialog: boolean = false;
  loading: boolean = false;

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.customerService.list().subscribe({
      next: (data) => {
        this.customers = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudieron cargar los clientes'});
        this.loading = false;
      }
    });
  }

  openNew() {
    this.customer = {};
    this.customerDialog = true;
  }

  editCustomer(customer: any) {
    this.customer = {...customer};
    this.customerDialog = true;
  }

  deleteCustomer(customer: any) {
    if (confirm('¿Está seguro de eliminar este cliente?')) {
      this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Cliente eliminado'});
    }
  }

  hideDialog() {
    this.customerDialog = false;
  }

  saveCustomer() {
    if (this.customer.name && this.customer.doc) {
      this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Cliente guardado'});
      this.customerDialog = false;
      this.loadCustomers();
    }
  }
}
