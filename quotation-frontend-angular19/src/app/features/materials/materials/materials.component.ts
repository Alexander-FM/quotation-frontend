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
  displayDialog = false;
  materialForm!: FormGroup;
  isEditMode = false;
  loading = false;
  hasFactorAdjustment = false;
  selectedFactorId: number | null = null;
  isPrintingFactorSelected = false;

  constructor(
    private materialService: MaterialService,
    private unitOfMeasurementService: UnitOfMeasurementService,
    private adjustmentFactorService: AdjustmentFactorService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initForm();

  }

  ngOnInit(): void {
    this.loadMaterials();
    this.loadUnitsOfMeasurement();
    this.loadAdjustmentFactors();
  }

  initForm(): void {
    this.materialForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(255)]],
      unitCost: [null, [Validators.required, Validators.min(0.01)]],
      unidadOfMeasurementName: ['', [Validators.required, Validators.maxLength(20)]],
      adjustmentFactorName: [''],
      adjustmentFactorValue: [null],
      hasFactorAdjustment: [false],
      thicknessMicrons: [null],
      defaultWidth: [null],
      defaultLength: [null],
      areaCoverage: [null],
      isActive: [true]
    });
  }

  private normalizeCalcType(value: any): MaterialCalculationTypeEnum | null {
    if (!value) return null;
    const map: Record<string, MaterialCalculationTypeEnum> = {
      SIMPLE: MaterialCalculationTypeEnum.SIMPLE,
      Simple: MaterialCalculationTypeEnum.SIMPLE,
      YIELD_BASED: MaterialCalculationTypeEnum.YIELD_BASED,
      'Basado en el rendimiento': MaterialCalculationTypeEnum.YIELD_BASED,
      VOLUME_DM: MaterialCalculationTypeEnum.VOLUME_DM,
      'Volumen en decímetros cúbicos': MaterialCalculationTypeEnum.VOLUME_DM,
      AREA: MaterialCalculationTypeEnum.AREA,
      Area: MaterialCalculationTypeEnum.AREA
    };
    const direct = map[value];
    if (direct) return direct;
    const isEnumValue = Object.values(MaterialCalculationTypeEnum).includes(value as MaterialCalculationTypeEnum);
    return isEnumValue ? (value as MaterialCalculationTypeEnum) : null;
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
    this.hasFactorAdjustment = false;
    this.selectedFactorId = null;
    this.isPrintingFactorSelected = false;
    this.displayDialog = true;
  }

  onAdjustmentFactorToggle(event: any): void {
    this.hasFactorAdjustment = event.checked;
    this.isPrintingFactorSelected = false;
    if (!this.hasFactorAdjustment) {
      this.selectedFactorId = null;
      this.materialForm.patchValue({
        adjustmentFactorName: null,
        adjustmentFactorValue: null,
        thicknessMicrons: null,
        defaultWidth: null,
        defaultLength: null,
        areaCoverage: null
      });
      // Remover validadores
      this.materialForm.get('thicknessMicrons')?.clearValidators();
      this.materialForm.get('defaultWidth')?.clearValidators();
      this.materialForm.get('defaultLength')?.clearValidators();
      this.materialForm.get('areaCoverage')?.clearValidators();
    } else {
      // Agregar validadores
      this.setValidatorsForPrintingFactor();
    }
    this.materialForm.get('thicknessMicrons')?.updateValueAndValidity();
    this.materialForm.get('defaultWidth')?.updateValueAndValidity();
    this.materialForm.get('defaultLength')?.updateValueAndValidity();
    this.materialForm.get('areaCoverage')?.updateValueAndValidity();
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

      // Si el factor contiene "impresion" o "impresión", mostrar areaCoverage y limpiar otros campos
      const nameL = selectedFactor.name.toLowerCase();
      this.isPrintingFactorSelected = nameL.includes('impresion') || nameL.includes('impresión');
      if (this.isPrintingFactorSelected) {
        this.materialForm.patchValue({
          thicknessMicrons: null,
          defaultWidth: null,
          defaultLength: null
        });
        // Remover validadores de los 3 campos
        this.materialForm.get('thicknessMicrons')?.clearValidators();
        this.materialForm.get('defaultWidth')?.clearValidators();
        this.materialForm.get('defaultLength')?.clearValidators();
        // Agregar validador solo para areaCoverage
        this.materialForm.get('areaCoverage')?.setValidators([Validators.required, Validators.min(0.01)]);
      } else {
        this.materialForm.patchValue({
          areaCoverage: null
        });
        // Remover validador de areaCoverage
        this.materialForm.get('areaCoverage')?.clearValidators();
        // Agregar validadores para los 3 campos
        this.materialForm.get('thicknessMicrons')?.setValidators([Validators.required, Validators.min(1)]);
        this.materialForm.get('defaultWidth')?.setValidators([Validators.required, Validators.min(0.01)]);
        this.materialForm.get('defaultLength')?.setValidators([Validators.required, Validators.min(0.01)]);
      }
      this.materialForm.get('thicknessMicrons')?.updateValueAndValidity();
      this.materialForm.get('defaultWidth')?.updateValueAndValidity();
      this.materialForm.get('defaultLength')?.updateValueAndValidity();
      this.materialForm.get('areaCoverage')?.updateValueAndValidity();
    }
  }

  private setValidatorsForPrintingFactor(): void {
    if (this.isPrintingFactorSelected) {
      this.materialForm.get('areaCoverage')?.setValidators([Validators.required, Validators.min(0.01)]);
      this.materialForm.get('thicknessMicrons')?.clearValidators();
      this.materialForm.get('defaultWidth')?.clearValidators();
      this.materialForm.get('defaultLength')?.clearValidators();
    } else {
      this.materialForm.get('thicknessMicrons')?.setValidators([Validators.required, Validators.min(1)]);
      this.materialForm.get('defaultWidth')?.setValidators([Validators.required, Validators.min(0.01)]);
      this.materialForm.get('defaultLength')?.setValidators([Validators.required, Validators.min(0.01)]);
      this.materialForm.get('areaCoverage')?.clearValidators();
    }
  }

  editMaterial(mat: MaterialResponseDto): void {
    this.isEditMode = true;
    this.hasFactorAdjustment = !!mat.hasFactorAdjustment;

    // Buscar el factor de ajuste por nombre para obtener su ID
    if (mat.adjustmentFactorName) {
      const factor = this.adjustmentFactors.find(f => f.name === mat.adjustmentFactorName);
      this.selectedFactorId = factor?.id || null;

      // Detectar si es factor de impresión
      const nameL = mat.adjustmentFactorName.toLowerCase();
      this.isPrintingFactorSelected = nameL.includes('impresion') || nameL.includes('impresión');
    } else {
      this.selectedFactorId = null;
      this.isPrintingFactorSelected = false;
    }

    this.materialForm.patchValue({
      id: mat.id,
      name: mat.name,
      description: mat.description || '',
      unitCost: mat.unitCost,
      unidadOfMeasurementName: mat.unidadOfMeasurementName,
      adjustmentFactorName: mat.adjustmentFactorName || '',
      adjustmentFactorValue: mat.adjustmentFactorValue || null,
      hasFactorAdjustment: mat.hasFactorAdjustment || false,
      thicknessMicrons: mat.thicknessMicrons || null,
      defaultWidth: mat.defaultWidth || null,
      defaultLength: mat.defaultLength || null,
      areaCoverage: mat.areaCoverage || null,
      isActive: mat.isActive
    });
    this.displayDialog = true;
  }

  getCalculationTypeLabel(value: any): string {
    const normalized = this.normalizeCalcType(value);
    if (normalized) return normalized as unknown as string;
    if (typeof value === 'string' && value.length > 0) {
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    }
    return '-';
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
      hasFactorAdjustment: this.hasFactorAdjustment,
      adjustmentFactorName: this.hasFactorAdjustment ? formValue.adjustmentFactorName : null,
      adjustmentFactorValue: this.hasFactorAdjustment ? formValue.adjustmentFactorValue : null,
      thicknessMicrons: this.hasFactorAdjustment && !this.isPrintingFactorSelected ? formValue.thicknessMicrons : null,
      defaultWidth: this.hasFactorAdjustment && !this.isPrintingFactorSelected ? formValue.defaultWidth : null,
      defaultLength: this.hasFactorAdjustment && !this.isPrintingFactorSelected ? formValue.defaultLength : null,
      areaCoverage: this.hasFactorAdjustment && this.isPrintingFactorSelected ? formValue.areaCoverage : null
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
