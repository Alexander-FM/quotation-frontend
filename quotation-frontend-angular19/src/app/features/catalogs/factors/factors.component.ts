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
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdjustmentFactorService } from '../../../services/adjustment-factor.service';
import { AdjustmentFactorRequestDto, AdjustmentFactorResponseDto } from '../../../models/adjustment-factor.model';

@Component({
  selector: 'app-factors',
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
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './factors.component.html',
  styleUrl: './factors.component.scss'
})
export class FactorsComponent implements OnInit {
  factors: AdjustmentFactorResponseDto[] = [];
  dialogVisible = false;
  form!: FormGroup;
  isEditMode = false;

  constructor(
    private factorService: AdjustmentFactorService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadFactors();
  }

  initForm(): void {
    this.form = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      value: [null, [Validators.required, Validators.min(0.01), Validators.max(99999999.99)]],
      isActive: [true]
    });
  }

  loadFactors(): void {
    this.factorService.getAll().subscribe({
      next: (response) => {
        this.factors = response.body;
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

  editFactor(factor: AdjustmentFactorResponseDto): void {
    this.isEditMode = true;
    this.form.patchValue(factor);
    this.dialogVisible = true;
  }

  deleteFactor(factor: AdjustmentFactorResponseDto): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro que deseas eliminar "${factor.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.factorService.delete(factor.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Factor eliminado correctamente' });
            this.loadFactors();
          },
          error: (err) => {
            const errorMessage = this.getErrorMessage(err);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
          }
        });
      }
    });
  }

  saveFactor(): void {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'Por favor completa los campos requeridos' });
      return;
    }

    const request: AdjustmentFactorRequestDto = this.form.value;
    const operation$ = this.isEditMode
      ? this.factorService.update(request.id!, request)
      : this.factorService.create(request);

    operation$.subscribe({
      next: () => {
        const message = this.isEditMode ? 'actualizado' : 'creado';
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Factor ${message} correctamente` });
        this.dialogVisible = false;
        this.loadFactors();
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
