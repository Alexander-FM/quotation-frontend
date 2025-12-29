import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CustomerService } from '../../../services/customer.service';
import { CatalogItemService } from '../../../services/catalog-item.service';
import { CustomerResponseDto, CustomerRequestDto } from '../../../models/customer.model';
import { CatalogItemResponseDto } from '../../../models/catalog-item.model';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CheckboxModule,
    DropdownModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {
  customers: CustomerResponseDto[] = [];
  documentTypes: CatalogItemResponseDto[] = [];
  displayDialog = false;
  customerForm!: FormGroup;
  isEditMode = false;
  loading = false;

  constructor(
    private customerService: CustomerService,
    private catalogItemService: CatalogItemService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadCustomers();
    this.loadDocumentTypes();
    this.setupDocumentTypeValidation();
  }

  initForm(): void {
    this.customerForm = this.fb.group({
      id: [null],
      companyName: ['', [Validators.required]],
      documentTypeCode: ['', [Validators.required]],
      documentNumber: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, this.phoneValidator.bind(this)]],
      phoneNumber2: ['', [this.phoneValidator.bind(this)]],
      isActive: [true]
    });
  }

  phoneValidator(control: any): { [key: string]: any } | null {
    if (!control.value) {
      return null;
    }

    const value = control.value.toString().trim();

    // Validar que solo contenga números
    if (!/^\d+$/.test(value)) {
      return { 'invalidPhone': true };
    }

    // Validar que tenga exactamente 9 dígitos
    if (value.length !== 9) {
      return { 'invalidPhoneLength': true };
    }

    return null;
  }

  setupDocumentTypeValidation(): void {
    this.customerForm.get('documentTypeCode')?.valueChanges.subscribe(documentType => {
      this.updateDocumentNumberValidation(documentType);
    });
  }

  onPhoneInput(fieldName: string, event: any): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(/[^0-9]/g, '');
    this.customerForm.get(fieldName)?.setValue(cleaned, { emitEvent: false });
  }

  updateDocumentNumberValidation(documentType: string): void {
    const documentNumberControl = this.customerForm.get('documentNumber');

    if (!documentNumberControl) return;

    switch (documentType) {
      case 'RUC':
        documentNumberControl.setValidators([
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.pattern(/^[0-9]+$/)
        ]);
        break;
      case 'DNI':
        documentNumberControl.setValidators([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          Validators.pattern(/^[0-9]+$/)
        ]);
        break;
      default:
        documentNumberControl.setValidators([
          Validators.required,
          Validators.maxLength(20)
        ]);
        break;
    }

    documentNumberControl.updateValueAndValidity();
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerService.getAll().subscribe({
      next: (response) => {
        this.customers = response.body || [];
        this.loading = false;
      },
      error: (error) => {
        const errorMessage = this.getErrorMessage(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        this.loading = false;
      }
    });
  }

  loadDocumentTypes(): void {
    this.catalogItemService.getAll().subscribe({
      next: (response) => {
        this.documentTypes = (response.body || []).filter(
          item => item.category === 'TIPO_IDENTIFICACION' && item.isActive
        );
      },
      error: (error) => {
        const errorMessage = this.getErrorMessage(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
      }
    });
  }

  openNew(): void {
    this.isEditMode = false;
    this.customerForm.reset({ isActive: true });
    this.displayDialog = true;
  }

  editCustomer(customer: CustomerResponseDto): void {
    this.isEditMode = true;
    this.customerForm.patchValue(customer);
    this.displayDialog = true;
  }

  deleteCustomer(customer: CustomerResponseDto): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro que deseas eliminar al cliente "${customer.companyName}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.customerService.delete(customer.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente eliminado correctamente' });
            this.loadCustomers();
          },
          error: (error) => {
            const errorMessage = this.getErrorMessage(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
          }
        });
      }
    });
  }

  saveCustomer(): void {
    if (this.customerForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor completa todos los campos requeridos correctamente' });
      Object.keys(this.customerForm.controls).forEach(key => {
        this.customerForm.get(key)?.markAsTouched();
      });
      return;
    }

    const customerData: CustomerRequestDto = this.customerForm.value;
    const request = this.isEditMode
      ? this.customerService.update(customerData.id!, customerData)
      : this.customerService.create(customerData);

    request.subscribe({
      next: () => {
        const message = this.isEditMode ? 'actualizado' : 'creado';
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Cliente ${message} correctamente` });
        this.displayDialog = false;
        this.loadCustomers();
      },
      error: (error) => {
        const errorMessage = this.getErrorMessage(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
      }
    });
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.customerForm.reset();
  }

  private getErrorMessage(error: any): string {
    if (error?.error?.body?.message) {
      return error.error.body.message;
    }
    if (error?.error?.message) {
      return error.error.message;
    }
    if (error?.message) {
      return error.message;
    }
    return 'Ocurrió un error al procesar la solicitud';
  }
}
