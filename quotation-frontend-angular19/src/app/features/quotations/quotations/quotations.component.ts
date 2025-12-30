import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';
import { QuotationService } from '../../../services/quotation.service';
import { CustomerService } from '../../../services/customer.service';
import { EmployeeService } from '../../../services/employee.service';
import { ModuleService } from '../../../services/module.service';
import { MaterialService } from '../../../services/material.service';
import { QuotationResponseDto, QuotationState } from '../../../models/quotation.model';
import { ErrorParser } from '../../../utils/error-parser.util';

@Component({
  selector: 'app-quotations',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './quotations.component.html',
  styleUrl: './quotations.component.scss'
})
export class QuotationsComponent implements OnInit {
  quotations: QuotationResponseDto[] = [];
  customers: any[] = [];
  employees: any[] = [];
  modules: any[] = [];
  materials: any[] = [];
  displayDialog = false;
  quotationForm!: FormGroup;
  isEditMode = false;
  loading = false;
  expandedRows: any = {};

  QuotationState = QuotationState;

  constructor(
    private quotationService: QuotationService,
    private customerService: CustomerService,
    private employeeService: EmployeeService,
    private moduleService: ModuleService,
    private materialService: MaterialService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadQuotations();
    this.loadCustomers();
    this.loadEmployees();
    this.loadModules();
    this.loadMaterials();
  }

  initForm(): void {
    this.quotationForm = this.fb.group({
      id: [null],
      customerDocumentNumber: ['', [Validators.required]],
      employeeDocumentNumber: ['', [Validators.required]],
      details: this.fb.array([])
    });
  }

  get details(): FormArray {
    return this.quotationForm.get('details') as FormArray;
  }

  getSubItems(detailIndex: number): FormArray {
    return this.details.at(detailIndex).get('subItems') as FormArray;
  }

  createDetailGroup(): FormGroup {
    return this.fb.group({
      id: [null],
      moduleId: [null, [Validators.required]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      transportationCost: [0],
      laborCost: [0],
      packingCost: [0],
      subItems: this.fb.array([])
    });
  }

  createSubItemGroup(): FormGroup {
    return this.fb.group({
      id: [null],
      materialId: [null, [Validators.required]],
      quantity: [0, [Validators.required, Validators.min(0.0001)]],
      rawMaterialCost: [0, [Validators.required, Validators.min(0)]],
      pieces: [1, [Validators.required, Validators.min(1)]]
    });
  }

  addDetail(): void {
    this.details.push(this.createDetailGroup());
  }

  removeDetail(index: number): void {
    this.details.removeAt(index);
  }

  addSubItem(detailIndex: number): void {
    this.getSubItems(detailIndex).push(this.createSubItemGroup());
  }

  removeSubItem(detailIndex: number, subIndex: number): void {
    this.getSubItems(detailIndex).removeAt(subIndex);
  }

  loadQuotations(): void {
    this.loading = true;
    this.quotationService.getAll().subscribe({
      next: (response) => {
        this.quotations = response.body || [];
        this.loading = false;
      },
      error: (error) => {
        const errorInfo = ErrorParser.parse(error);
        this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
        this.loading = false;
      }
    });
  }

  loadCustomers(): void {
    this.customerService.getAll().subscribe({
      next: (response) => {
        this.customers = (response.body || []).filter(c => c.isActive);
      },
      error: (error) => {
        const errorInfo = ErrorParser.parse(error);
        this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
      }
    });
  }

  loadEmployees(): void {
    this.employeeService.getAll().subscribe({
      next: (response) => {
        this.employees = (response.body || []).filter(e => e.isActive);
      },
      error: (error) => {
        const errorInfo = ErrorParser.parse(error);
        this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
      }
    });
  }

  loadModules(): void {
    this.moduleService.getAll().subscribe({
      next: (response) => {
        this.modules = (response.body || []).filter(m => m.isActive);
      },
      error: (error) => {
        const errorInfo = ErrorParser.parse(error);
        this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
      }
    });
  }

  loadMaterials(): void {
    this.materialService.getAll().subscribe({
      next: (response) => {
        this.materials = response.body || [];
      },
      error: (error) => {
        const errorInfo = ErrorParser.parse(error);
        this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
      }
    });
  }

  openNew(): void {
    this.isEditMode = false;
    this.quotationForm.reset();
    this.details.clear();
    this.addDetail();
    this.displayDialog = true;
  }

  editQuotation(quot: QuotationResponseDto): void {
    // Validar estado
    if (quot.state !== QuotationState.BORRADOR) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Edición no permitida',
        detail: `El estado está en "${quot.state}". Solo se puede editar cotizaciones en estado BORRADOR.`
      });
      return;
    }

    this.isEditMode = true;

    // Cargar datos completos desde el backend
    this.quotationService.getById(quot.id).subscribe({
      next: (response) => {
        const quotation = response.body;
        if (quotation) {
          this.quotationForm.patchValue({
            id: quotation.id,
            customerDocumentNumber: quotation.customerDocumentNumber,
            employeeDocumentNumber: quotation.employeeDocumentNumber
          });

          // Limpiar y cargar details
          this.details.clear();
          quotation.details.forEach(detail => {
            const detailGroup = this.createDetailGroup();
            detailGroup.patchValue({
              id: detail.id,
              moduleId: detail.module?.id,
              quantity: detail.quantity,
              transportationCost: detail.transportationCost ?? 0,
              laborCost: detail.laborCost ?? 0,
              packingCost: detail.packingCost ?? 0
            });

            // Cargar subItems
            const subItemsArray = detailGroup.get('subItems') as FormArray;
            detail.subItems.forEach(subItem => {
              const subItemGroup = this.createSubItemGroup();
              subItemGroup.patchValue({
                id: subItem.id,
                materialId: subItem.materialId,
                quantity: subItem.quantity,
                rawMaterialCost: subItem.rawMaterialCost,
                pieces: subItem.pieces
              });
              subItemsArray.push(subItemGroup);
            });

            this.details.push(detailGroup);
          });

          this.displayDialog = true;
        }
      },
      error: (error) => {
        const errorInfo = ErrorParser.parse(error);
        this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
      }
    });
  }

  deleteQuotation(quot: QuotationResponseDto): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro que deseas eliminar la cotización #${quot.id}?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.quotationService.delete(quot.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cotización eliminada correctamente' });
            this.loadQuotations();
          },
          error: (error) => {
            const errorInfo = ErrorParser.parse(error);
            this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
          }
        });
      }
    });
  }

  saveQuotation(): void {
    if (this.quotationForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor completa todos los campos requeridos correctamente' });
      Object.keys(this.quotationForm.controls).forEach(key => this.quotationForm.get(key)?.markAsTouched());
      return;
    }

    const formValue = this.quotationForm.value;

    // Construir payload con estructura correcta
    const payload: any = {
      id: formValue.id,
      customerDocumentNumber: formValue.customerDocumentNumber,
      employeeDocumentNumber: formValue.employeeDocumentNumber,
      details: formValue.details.map((detail: any) => ({
        id: detail.id,
        module: { id: detail.moduleId },
        quantity: detail.quantity,
        transportationCost: detail.transportationCost ?? 0,
        laborCost: detail.laborCost ?? 0,
        packingCost: detail.packingCost ?? 0,
        subItems: detail.subItems.map((subItem: any) => ({
          id: subItem.id,
          materialId: subItem.materialId,
          quantity: subItem.quantity,
          rawMaterialCost: subItem.rawMaterialCost,
          pieces: subItem.pieces
        }))
      }))
    };

    const request$ = this.isEditMode
      ? this.quotationService.update(payload.id!, payload)
      : this.quotationService.create(payload);

    request$.subscribe({
      next: () => {
        const message = this.isEditMode ? 'actualizada' : 'creada';
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Cotización ${message} correctamente` });
        this.displayDialog = false;
        this.loadQuotations();
      },
      error: (error) => {
        const errorInfo = ErrorParser.parse(error);
        this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
      }
    });
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.quotationForm.reset();
    this.details.clear();
  }

  getStateSeverity(state: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    switch (state) {
      case QuotationState.BORRADOR:
        return 'secondary';
      case QuotationState.EN_REVISION:
        return 'info';
      case QuotationState.APROBADO:
        return 'success';
      case QuotationState.RECHAZADO:
        return 'danger';
      default:
        return 'contrast';
    }
  }
}

