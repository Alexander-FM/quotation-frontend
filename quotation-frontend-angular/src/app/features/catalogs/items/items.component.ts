import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CatalogService } from '../../../core/services/catalog.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
  providers: [MessageService]
})
export class ItemsComponent implements OnInit {
  items: any[] = [];
  item: any = {};
  itemDialog: boolean = false;
  loading: boolean = false;

  constructor(
    private catalogService: CatalogService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems() {
    this.loading = true;
    this.catalogService.listItems().subscribe({
      next: (data) => {
        this.items = data;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudieron cargar los items'});
        this.loading = false;
      }
    });
  }

  openNew() {
    this.item = {};
    this.itemDialog = true;
  }

  editItem(item: any) {
    this.item = {...item};
    this.itemDialog = true;
  }

  deleteItem(item: any) {
    if (confirm('¿Está seguro de eliminar este item?')) {
      this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Item eliminado'});
    }
  }

  hideDialog() {
    this.itemDialog = false;
  }

  saveItem() {
    if (this.item.name && this.item.code) {
      this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Item guardado'});
      this.itemDialog = false;
      this.loadItems();
    }
  }
}
