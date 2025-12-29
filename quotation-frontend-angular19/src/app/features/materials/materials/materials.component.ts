import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MaterialService } from '../../../services/material.service';
import { MaterialRequestDto, MaterialResponseDto, MaterialCalculationTypeEnum } from '../../../models/material.model';
import { ErrorParser } from '../../../utils/error-parser.util';
import { UnitOfMeasurementResponseDto } from '../../../models/unit-of-measurement.model';
import { UnitOfMeasurementService } from '../../../services/unit-of-measurement.service';
import { AdjustmentFactorService } from '../../../services/adjustment-factor.service';
import { AdjustmentFactorResponseDto } from '../../../models/adjustment-factor.model';

@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    SelectModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.scss'
})
export class MaterialsComponent implements OnInit {
  materials: MaterialResponseDto[] = [];
  unitsOfMeasurement: UnitOfMeasurementResponseDto[] = [];
  adjustmentFactors: AdjustmentFactorResponseDto[] = [];
  calculationTypes: { label: string; value: MaterialCalculationTypeEnum }[] = [];
  displayDialog = false;
  materialForm!: FormGroup;
  isEditMode = false;
  loading = false;
  hasAdjustmentFactor = false;
  selectedFactorId: number | null = null;

  constructor(
    private materialService: MaterialService,
    private unitOfMeasurementService: UnitOfMeasurementService,
    private adjustmentFactorService: AdjustmentFactorService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initForm();
    this.initCalculationTypes();
  }

  ngOnInit(): void {
    this.loadMaterials();
    this.loadUnitsOfMeasurement();
    this.loadAdjustmentFactors();
  }

  initForm(): void {
    this.materialForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.maxLength(255)]],
      unitCost: [null, [Validators.required, Validators.min(0.01)]],
      unidadOfMeasurementName: ['', [Validators.required, Validators.maxLength(20)]],
      calculationType: [null],
      adjustmentFactorName: ['', [Validators.maxLength(50)]],
      adjustmentFactorValue: [null],
      thicknessMicrons: [null],
      isActive: [true]
    });
  }

  initCalculationTypes(): void {
    this.calculationTypes = Object.values(MaterialCalculationTypeEnum).map(value => ({
      label: value,
      value: value as MaterialCalculationTypeEnum
    }));
  }

  loadMaterials(): void {
    this.loading = true;
    this.materialService.getAll().subscribe({
      next: (response) => {
        this.materials = response.body || [];
        this.loading = false;
      },
      error: (error) => {
        const errorInfo = ErrorParser.parse(error);
        this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
        this.loading = false;
      }
    });
  }

  loadUnitsOfMeasurement(): void {
    this.unitOfMeasurementService.getAll().subscribe({
      next: (response) => {
        this.unitsOfMeasurement = (response.body || []).filter(
          item => item.isActive
        );
      },
      error: (error) => {
        const errorInfo = ErrorParser.parse(error);
        this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
      }
    });
  }

  loadAdjustmentFactors(): void {
    this.adjustmentFactorService.getAll().subscribe({
      next: (response) => {
        this.adjustmentFactors = (response.body || []).filter(
          item => item.isActive
        );
      },
      error: (error) => {
        const errorInfo = ErrorParser.parse(error);
        this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
      }
    });
  }

  openNew(): void {
    this.isEditMode = false;
    this.materialForm.reset({ isActive: true });
    this.hasAdjustmentFactor = false;
    this.selectedFactorId = null;
    this.displayDialog = true;
  }

  onAdjustmentFactorToggle(event: any): void {
    this.hasAdjustmentFactor = event.checked;
    if (!this.hasAdjustmentFactor) {
      this.selectedFactorId = null;
      this.materialForm.patchValue({
        adjustmentFactorName: null,
        adjustmentFactorValue: null
      });
    }
  }

  onFactorSelected(factorId: number | null): void {
    if (!factorId) {
      this.materialForm.patchValue({
        adjustmentFactorName: null,
        adjustmentFactorValue: null
      });
      return;
    }

    const selectedFactor = this.adjustmentFactors.find(f => f.id === factorId);
    if (selectedFactor) {
      this.materialForm.patchValue({
        adjustmentFactorName: selectedFactor.name,
        adjustmentFactorValue: selectedFactor.value
      });

      // Si el factor contiene "impresion" o "impresión", limpiar thicknessMicrons
      const nameL = selectedFactor.name.toLowerCase();
      if (nameL.includes('impresion') || nameL.includes('impresión')) {
        this.materialForm.patchValue({ thicknessMicrons: null });
      }
    }
  }

  editMaterial(mat: MaterialResponseDto): void {
    this.isEditMode = true;
    this.hasAdjustmentFactor = !!mat.adjustmentFactorName;

    // Buscar el factor de ajuste por nombre para obtener su ID
    if (mat.adjustmentFactorName) {
      const factor = this.adjustmentFactors.find(f => f.name === mat.adjustmentFactorName);
      this.selectedFactorId = factor?.id || null;
    } else {
      this.selectedFactorId = null;
    }

    this.materialForm.patchValue({
      id: mat.id,
      name: mat.name,
      description: mat.description || '',
      unitCost: mat.unitCost,
      unidadOfMeasurementName: mat.unidadOfMeasurementName,
      calculationType: mat.calculationType || null,
      adjustmentFactorName: mat.adjustmentFactorName || '',
      adjustmentFactorValue: mat.adjustmentFactorValue || null,
      thicknessMicrons: mat.thicknessMicrons || null,
      isActive: mat.isActive
    });
    this.displayDialog = true;
  }

  deleteMaterial(mat: MaterialResponseDto): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro que deseas eliminar el material "${mat.name}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.materialService.delete(mat.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Material eliminado correctamente' });
            this.loadMaterials();
          },
          error: (error) => {
            const errorInfo = ErrorParser.parse(error);
            this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
          }
        });
      }
    });
  }

  saveMaterial(): void {
    if (this.materialForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor completa todos los campos requeridos correctamente' });
      Object.keys(this.materialForm.controls).forEach(key => this.materialForm.get(key)?.markAsTouched());
      return;
    }

    const formValue = this.materialForm.value;
    const payload: MaterialRequestDto = {
      ...formValue,
      adjustmentFactorName: this.hasAdjustmentFactor ? formValue.adjustmentFactorName : null,
      adjustmentFactorValue: this.hasAdjustmentFactor ? formValue.adjustmentFactorValue : null,
      thicknessMicrons: this.hasAdjustmentFactor ? formValue.thicknessMicrons : null
    };
    const request$ = this.isEditMode
      ? this.materialService.update(payload.id!, payload)
      : this.materialService.create(payload);

    request$.subscribe({
      next: () => {
        const message = this.isEditMode ? 'actualizado' : 'creado';
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Material ${message} correctamente` });
        this.displayDialog = false;
        this.loadMaterials();
      },
      error: (error) => {
        const errorInfo = ErrorParser.parse(error);
        this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
      }
    });
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.materialForm.reset();
  }
}
