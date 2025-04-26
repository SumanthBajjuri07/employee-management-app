import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { AvatarService } from '../../services/avatar.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-form',
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">{{ isEditMode ? 'Edit Employee' : 'Add New Employee' }}</h1>

      <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()" class="max-w-lg">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name">
            Name
          </label>
          <input
            id="name"
            type="text"
            formControlName="name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            [class.border-red-500]="employeeForm.get('name')?.invalid && employeeForm.get('name')?.touched"
          >
          <div *ngIf="employeeForm.get('name')?.invalid && employeeForm.get('name')?.touched" class="text-red-500 text-xs mt-1">
            Name is required
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="company_name">
            Company Name
          </label>
          <input
            id="company_name"
            type="text"
            formControlName="company_name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            [class.border-red-500]="employeeForm.get('company_name')?.invalid && employeeForm.get('company_name')?.touched"
          >
          <div *ngIf="employeeForm.get('company_name')?.invalid && employeeForm.get('company_name')?.touched" class="text-red-500 text-xs mt-1">
            Company name is required
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            formControlName="email"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            [class.border-red-500]="employeeForm.get('email')?.invalid && employeeForm.get('email')?.touched"
          >
          <div *ngIf="employeeForm.get('email')?.invalid && employeeForm.get('email')?.touched" class="text-red-500 text-xs mt-1">
            Please enter a valid email address
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="contact_no">
            Contact Number
          </label>
          <input
            id="contact_no"
            type="tel"
            formControlName="contact_no"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            [class.border-red-500]="employeeForm.get('contact_no')?.invalid && employeeForm.get('contact_no')?.touched"
          >
          <div *ngIf="employeeForm.get('contact_no')?.invalid && employeeForm.get('contact_no')?.touched" class="text-red-500 text-xs mt-1">
            Contact number is required
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="designation">
            Designation
          </label>
          <input
            id="designation"
            type="text"
            formControlName="designation"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            [class.border-red-500]="employeeForm.get('designation')?.invalid && employeeForm.get('designation')?.touched"
          >
          <div *ngIf="employeeForm.get('designation')?.invalid && employeeForm.get('designation')?.touched" class="text-red-500 text-xs mt-1">
            Designation is required
          </div>
        </div>

        <div class="flex items-center justify-between">
          <button
            type="submit"
            [disabled]="employeeForm.invalid"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            [class.opacity-50]="employeeForm.invalid"
          >
            {{ isEditMode ? 'Update' : 'Add' }} Employee
          </button>
          <button
            type="button"
            (click)="goBack()"
            class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private avatarService: AvatarService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      company_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contact_no: ['', Validators.required],
      designation: ['', Validators.required],
      avatar: ['']
    });
  }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.employeeId;

    if (this.isEditMode && this.employeeId) {
      this.loadEmployee();
    } else {
      this.employeeForm.patchValue({
        avatar: this.avatarService.generateRandomAvatar()
      });
    }
  }

  private async loadEmployee(): Promise<void> {
    try {
      if (this.employeeId) {
        const employee = await this.employeeService.getEmployee(this.employeeId);
        this.employeeForm.patchValue(employee);
      }
    } catch (error) {
      console.error('Error loading employee:', error);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.employeeForm.valid) {
      try {
        if (this.isEditMode && this.employeeId) {
          await this.employeeService.updateEmployee(this.employeeId, this.employeeForm.value);
        } else {
          await this.employeeService.createEmployee(this.employeeForm.value);
        }
        this.router.navigate(['/employees']);
      } catch (error) {
        console.error('Error saving employee:', error);
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
} 