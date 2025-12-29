import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CatalogItemService } from '../../../services/catalog-item.service';
import { CatalogItemRequestDto, CatalogItemResponseDto } from '../../../models/catalog-item.model';

@Component({
  selector: 'app-items',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './items.component.html',
  styleUrl: './items.component.scss'
})
export class ItemsComponent implements OnInit {
  items: CatalogItemResponseDto[] = [];
  dialogVisible = false;
  form!: FormGroup;
  isEditMode = false;

  categories = [
    { label: 'TIPO_DOCUMENTO', value: 'TIPO_DOCUMENTO' },
    { label: 'TIPO_IDENTIFICACION', value: 'TIPO_IDENTIFICACION' },
    { label: 'TIPO_CAMBIO', value: 'TIPO_CAMBIO' },
    { label: 'OTROS', value: 'OTROS' }
  ];

  constructor(
    private itemService: CatalogItemService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadItems();
  }

  initForm(): void {
    this.form = this.fb.group({
      id: [null],
      category: ['', Validators.required],
      code: ['', Validators.required],
      description: [''],
      isActive: [true]
    });
  }

  loadItems(): void {
    this.itemService.getAll().subscribe({
      next: (response) => {
        this.items = response.body;
      },
      error: (err) => {
        const errorMessage = this.getErrorMessage(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
      }
    });
  }

  openDialog(): void {
    this.isEditMode = false;
    this.form.reset({ isActive: true });
    this.dialogVisible = true;
  }

  editItem(item: CatalogItemResponseDto): void {
    this.isEditMode = true;
    this.form.patchValue(item);
    this.dialogVisible = true;
  }

  deleteItem(item: CatalogItemResponseDto): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro que deseas eliminar "${item.code}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.itemService.delete(item.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Item eliminado correctamente' });
            this.loadItems();
          },
          error: (err) => {
            const errorMessage = this.getErrorMessage(err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
          }
        });
      }
    });
  }

  saveItem(): void {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'Por favor completa los campos requeridos' });
      return;
    }

    const request: CatalogItemRequestDto = this.form.value;
    const operation$ = this.isEditMode
      ? this.itemService.update(request.id!, request)
      : this.itemService.create(request);

    operation$.subscribe({
      next: () => {
        const message = this.isEditMode ? 'actualizado' : 'creado';
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Item ${message} correctamente` });
        this.dialogVisible = false;
        this.loadItems();
      },
      error: (err) => {
        const errorMessage = this.getErrorMessage(err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.error?.body?.message) {
      return error.error.body.message;
    }
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'Ocurrió un error al procesar la solicitud';
  }
}
