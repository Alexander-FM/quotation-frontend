import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TextareaModule  } from 'primeng/textarea';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UnitOfMeasurementService } from '../../../services/unit-of-measurement.service';
import { UnitOfMeasurementResponseDto, UnitOfMeasurementRequestDto } from '../../../models/unit-of-measurement.model';

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    TextareaModule,
    InputSwitchModule,
    TagModule,
    TooltipModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './units.component.html',
  styleUrl: './units.component.scss'
})
export class UnitsComponent implements OnInit {
  units: UnitOfMeasurementResponseDto[] = [];
  loading = false;
  dialogVisible = false;
  isEditMode = false;
  form!: FormGroup;

  constructor(
    private unitService: UnitOfMeasurementService,
    private formBuilder: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadUnits();
  }

  initForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      isActive: [true]
    });
  }

  loadUnits(): void {
    this.loading = true;
    this.unitService.getAll().subscribe({
      next: (response) => {
        this.units = response.body;
        this.loading = false;
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las unidades' });
        this.loading = false;
      }
    });
  }

  openDialog(): void {
    this.isEditMode = false;
    this.form.reset({ isActive: true });
    this.dialogVisible = true;
  }

  editUnit(unit: UnitOfMeasurementResponseDto): void {
    this.isEditMode = true;
    this.form.patchValue(unit);
    this.dialogVisible = true;
  }

  deleteUnit(unit: UnitOfMeasurementResponseDto): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro que deseas eliminar "${unit.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.unitService.delete(unit.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Unidad eliminada correctamente' });
            this.loadUnits();
          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo eliminar la unidad' });
          }
        });
      }
    });
  }

  saveUnit(): void {
    if (this.form.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'Por favor completa los campos requeridos' });
      return;
    }

    const request: UnitOfMeasurementRequestDto = this.form.value;
    const operation$ = this.isEditMode
      ? this.unitService.update(request.id!, request)
      : this.unitService.create(request);

    operation$.subscribe({
      next: () => {
        const message = this.isEditMode ? 'actualizada' : 'creada';
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Unidad ${message} correctamente` });
        this.dialogVisible = false;
        this.loadUnits();
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar la unidad' });
      }
    });
  }

  closeDialog(): void {
    this.dialogVisible = false;
    this.form.reset();
  }
}
