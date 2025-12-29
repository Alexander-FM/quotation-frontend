import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';
import { EmployeeService } from '../../../services/employee.service';
import { EmployeeRequestDto, EmployeeResponseDto } from '../../../models/employee.model';
import { CatalogItemService } from '../../../services/catalog-item.service';
import { CatalogItemResponseDto } from '../../../models/catalog-item.model';
import { UserService } from '../../../services/user.service';
import { UserResponseDto } from '../../../models/user.model';
import { ErrorParser } from '../../../utils/error-parser.util';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CheckboxModule,
    SelectModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss'
})
export class EmployeesComponent implements OnInit {
  employees: EmployeeResponseDto[] = [];
  documentTypes: CatalogItemResponseDto[] = [];
  users: UserResponseDto[] = [];
  displayDialog = false;
  employeeForm!: FormGroup;
  isEditMode = false;
  loading = false;

  constructor(
    private employeeService: EmployeeService,
    private catalogItemService: CatalogItemService,
    private userService: UserService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadEmployees();
    this.loadDocumentTypes();
    this.loadUsers();
    this.setupDocumentTypeValidation();
  }

  initForm(): void {
    this.employeeForm = this.fb.group({
      id: [null],
      fullName: ['', [Validators.required]],
      documentTypeCode: ['', [Validators.required]],
      documentNumber: ['', [Validators.required, Validators.maxLength(20)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(9), Validators.pattern(/^[0-9+\-()\s]+$/)]],
      phoneNumber2: ['', [Validators.maxLength(9), Validators.pattern(/^[0-9+\-()\s]*$/)]],
      streetAddress: ['', [Validators.required]],
      userId: [null, [Validators.required]],
      isActive: [true]
    });
  }

  setupDocumentTypeValidation(): void {
    this.employeeForm.get('documentTypeCode')?.valueChanges.subscribe(documentType => {
      this.updateDocumentNumberValidation(documentType);
    });
  }

  updateDocumentNumberValidation(documentType: string): void {
    const ctrl = this.employeeForm.get('documentNumber');
    if (!ctrl) return;
    switch (documentType) {
      case 'RUC':
        ctrl.setValidators([
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          Validators.pattern(/^[0-9]+$/)
        ]);
        break;
      case 'DNI':
        ctrl.setValidators([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(8),
          Validators.pattern(/^[0-9]+$/)
        ]);
        break;
      default:
        ctrl.setValidators([
          Validators.required,
          Validators.maxLength(20)
        ]);
        break;
    }
    ctrl.updateValueAndValidity();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAll().subscribe({
      next: (response) => {
        this.employees = response.body || [];
        this.loading = false;
      },
      error: (error) => {
        const errorInfo = ErrorParser.parse(error);
        this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
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
        const errorInfo = ErrorParser.parse(error);
        this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
      }
    });
  }

  loadUsers(): void {
    this.userService.getAll().subscribe({
      next: (response) => {
        this.users = response.body || [];
      },
      error: (error) => {
        const errorInfo = ErrorParser.parse(error);
        this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
      }
    });
  }

  openNew(): void {
    this.isEditMode = false;
    this.employeeForm.reset({ isActive: true });
    this.displayDialog = true;
  }

  editEmployee(emp: EmployeeResponseDto): void {
    this.isEditMode = true;
    this.employeeForm.patchValue({
      id: emp.id,
      fullName: emp.fullName,
      documentTypeCode: emp.documentTypeCode,
      documentNumber: emp.documentNumber,
      phoneNumber: emp.phoneNumber,
      phoneNumber2: emp.phoneNumber2 || '',
      streetAddress: emp.streetAddress,
      userId: emp.userResponseDto?.id,
      isActive: emp.isActive
    });
    this.displayDialog = true;
  }

  deleteEmployee(emp: EmployeeResponseDto): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro que deseas eliminar al empleado "${emp.fullName}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.employeeService.delete(emp.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Empleado eliminado correctamente' });
            this.loadEmployees();
          },
          error: (error) => {
            const errorInfo = ErrorParser.parse(error);
            this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
          }
        });
      }
    });
  }

  saveEmployee(): void {
    if (this.employeeForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor completa todos los campos requeridos correctamente' });
      Object.keys(this.employeeForm.controls).forEach(key => this.employeeForm.get(key)?.markAsTouched());
      return;
    }

    const payload: EmployeeRequestDto = this.employeeForm.value;
    const request$ = this.isEditMode
      ? this.employeeService.update(payload.id!, payload)
      : this.employeeService.create(payload);

    request$.subscribe({
      next: () => {
        const message = this.isEditMode ? 'actualizado' : 'creado';
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Empleado ${message} correctamente` });
        this.displayDialog = false;
        this.loadEmployees();
      },
      error: (error) => {
        const errorInfo = ErrorParser.parse(error);
        this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
      }
    });
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.employeeForm.reset();
  }

}
