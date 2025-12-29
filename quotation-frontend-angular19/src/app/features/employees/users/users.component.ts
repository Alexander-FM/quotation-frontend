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
import { MultiSelectModule } from 'primeng/multiselect';
import { UserService } from '../../../services/user.service';
import { RoleService } from '../../../services/role.service';
import { UserRequestDto, UserResponseDto } from '../../../models/user.model';
import { RoleResponseDto } from '../../../models/role.model';

@Component({
  selector: 'app-users',
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
    TagModule,
    MultiSelectModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: UserResponseDto[] = [];
  roles: RoleResponseDto[] = [];
  displayDialog = false;
  userForm!: FormGroup;
  isEditMode = false;
  loading = false;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  initForm(): void {
    this.userForm = this.fb.group({
      id: [null],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      isActive: [true, [Validators.required]],
      roles: [[], [Validators.required]]
    });
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (response) => {
        this.users = response.body || [];
        this.loading = false;
      },
      error: (error) => {
        const errorMessage = this.getErrorMessage(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
        this.loading = false;
      }
    });
  }

  loadRoles(): void {
    this.roleService.getAll().subscribe({
      next: (response) => {
        this.roles = (response.body || []).filter(r => r.isActive);
      },
      error: (error) => {
        const errorMessage = this.getErrorMessage(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
      }
    });
  }

  openNew(): void {
    this.isEditMode = false;
    this.userForm.reset({ isActive: true, roles: [] });
    this.displayDialog = true;
  }

  editUser(user: UserResponseDto): void {
    this.isEditMode = true;
    this.userForm.patchValue({
      id: user.id,
      username: user.username,
      password: '',
      isActive: user.isActive,
      roles: user.roles
    });
    this.displayDialog = true;
  }

  deleteUser(user: UserResponseDto): void {
    this.confirmationService.confirm({
      message: `¿Estás seguro que deseas eliminar el usuario "${user.username}"?`,
      header: 'Confirmar eliminación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.delete(user.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Usuario eliminado correctamente' });
            this.loadUsers();
          },
          error: (error) => {
            const errorMessage = this.getErrorMessage(error);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
          }
        });
      }
    });
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor completa los campos requeridos' });
      Object.keys(this.userForm.controls).forEach(key => this.userForm.get(key)?.markAsTouched());
      return;
    }

    const formValue = this.userForm.value;
    const selectedRoles = (formValue.roles || []) as RoleResponseDto[];
    const mappedRoles = selectedRoles.map(r => ({ id: r.id, roleName: r.roleName, isActive: r.isActive }));
    const request: UserRequestDto = {
      id: formValue.id,
      username: formValue.username,
      password: formValue.password,
      isActive: formValue.isActive,
      roles: mappedRoles
    };

    const request$ = this.isEditMode
      ? this.userService.update(request.id!, request)
      : this.userService.create(request);

    request$.subscribe({
      next: () => {
        const message = this.isEditMode ? 'actualizado' : 'creado';
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: `Usuario ${message} correctamente` });
        this.displayDialog = false;
        this.loadUsers();
      },
      error: (error) => {
        const errorMessage = this.getErrorMessage(error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage });
      }
    });
  }

  hideDialog(): void {
    this.displayDialog = false;
    this.userForm.reset();
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
