import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RoleService } from '../../../services/role.service';
import { RoleResponseDto, RoleRequestDto } from '../../../models/role.model';import { ErrorParser } from '../../../utils/error-parser.util';
@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CheckboxModule,
    ToastModule,
    ConfirmDialogModule,
    TagModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {
  roles: RoleResponseDto[] = [];
  displayDialog = false;
  roleForm!: FormGroup;
  isEditMode = false;
  loading = false;

  constructor(
    private roleService: RoleService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  initForm(): void {
    this.roleForm = this.fb.group({
      id: [null],
      roleName: ['', [Validators.required]],
      description: [''],
      isActive: [true]
    });
  }

  loadRoles(): void {
    this.loading = true;
    this.roleService.getAll().subscribe({
      next: (response) => {
        this.roles = response.body || [];
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
    this.roleForm.reset({ isActive: true });
    this.displayDialog = true;
  }

  editRole(role: RoleResponseDto): void {
    this.isEditMode = true;
    this.roleForm.patchValue(role);
    this.displayDialog = true;
  }

  deleteRole(role: RoleResponseDto): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro que deseas eliminar el rol "${role.roleName}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roleService.delete(role.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Rol eliminado correctamente' });
            this.loadRoles();
          },
          error: (error) => {
            const errorInfo = ErrorParser.parse(error);
            this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
          }
        });
      }
    });
  }

  saveRole(): void {
    if (this.roleForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor completa todos los campos requeridos' });
      Object.keys(this.roleForm.controls).forEach(key => {
        this.roleForm.get(key)?.markAsTouched();
      });
      return;
    }

    const roleData: RoleRequestDto = this.roleForm.value;
    const request = this.isEditMode
      ? this.roleService.update(roleData.id!, roleData)
      : this.roleService.create(roleData);

    request.subscribe({
      next: () => {
        const message = this.isEditMode ? 'actualizado' : 'creado';
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Rol ${message} correctamente` });
        this.displayDialog = false;
        this.loadRoles();
      },
      error: (error) => {
        const errorInfo = ErrorParser.parse(error);
        this.messageService.add({ severity: 'error', summary: errorInfo.summary, detail: errorInfo.detail });
      }
    });
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.roleForm.reset();
  }

}
