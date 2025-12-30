import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ModuleService } from '../../../services/module.service';
import { ModuleRequestDto, ModuleResponseDto } from '../../../models/module.model';
import { ErrorParser } from '../../../utils/error-parser.util';

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.scss'
})
export class ModulesComponent implements OnInit {
  modules: ModuleResponseDto[] = [];
  displayDialog = false;
  moduleForm!: FormGroup;
  isEditMode = false;
  loading = false;

  constructor(
    private moduleService: ModuleService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadModules();
  }

  initForm(): void {
    this.moduleForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(255)]],
      dimensions: ['', [Validators.maxLength(100)]],
      overheadsCostPercentage: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      feePercentage: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      rebatePercentage: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      profitMarginPercentage: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      isActive: [true]
    });
  }

  loadModules(): void {
    this.loading = true;
    this.moduleService.getAll().subscribe({
      next: (response) => {
        this.modules = response.body || [];
        this.loading = false;
      },
      error: (error) => {
        const errorInfo = ErrorParser.parse(error);
        this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
        this.loading = false;
      }
    });
  }

  openNew(): void {
    this.isEditMode = false;
    this.moduleForm.reset({
      isActive: true,
      overheadsCostPercentage: 0,
      feePercentage: 0,
      rebatePercentage: 0,
      profitMarginPercentage: 0
    });
    this.displayDialog = true;
  }

  editModule(mod: ModuleResponseDto): void {
    this.isEditMode = true;
    this.moduleService.getById(mod.id).subscribe({
      next: (response) => {
        const module = response.body;
        if (module) {
          this.moduleForm.patchValue({
            id: module.id,
            name: module.name,
            description: module.description || '',
            dimensions: module.dimensions || '',
            overheadsCostPercentage: module.overheadsCostPercentage ?? 0,
            feePercentage: module.feePercentage ?? 0,
            rebatePercentage: module.rebatePercentage ?? 0,
            profitMarginPercentage: module.profitMarginPercentage ?? 0,
            isActive: module.isActive
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

  deleteModule(mod: ModuleResponseDto): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro que deseas eliminar el módulo "${mod.name}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.moduleService.delete(mod.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Módulo eliminado correctamente' });
            this.loadModules();
          },
          error: (error) => {
            const errorInfo = ErrorParser.parse(error);
            this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
          }
        });
      }
    });
  }

  saveModule(): void {
    if (this.moduleForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor completa todos los campos requeridos correctamente' });
      Object.keys(this.moduleForm.controls).forEach(key => this.moduleForm.get(key)?.markAsTouched());
      return;
    }

    const payload: ModuleRequestDto = this.moduleForm.value;
    const request$ = this.isEditMode
      ? this.moduleService.update(payload.id!, payload)
      : this.moduleService.create(payload);

    request$.subscribe({
      next: () => {
        const message = this.isEditMode ? 'actualizado' : 'creado';
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Módulo ${message} correctamente` });
        this.displayDialog = false;
        this.loadModules();
      },
      error: (error) => {
        const errorInfo = ErrorParser.parse(error);
        this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
      }
    });
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.moduleForm.reset();
  }
}
