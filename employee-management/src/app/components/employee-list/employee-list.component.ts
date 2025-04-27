import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-employee-list',
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Employee Management</h1>
        <button (click)="addEmployee()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Add Employee
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let employee of employees" class="bg-white p-4 rounded-lg shadow">
          <div class="flex items-center space-x-4">
            <img [src]="employee.avatar" alt="Avatar" class="w-16 h-16 rounded-full">
            <div>
              <h2 class="text-xl font-semibold">{{ employee.name }}</h2>
              <p class="text-gray-600">{{ employee.designation }}</p>
            </div>
          </div>
          <div class="mt-4">
            <p><strong>Company:</strong> {{ employee.company_name }}</p>
            <p><strong>Email:</strong> {{ employee.email }}</p>
            <p><strong>Contact:</strong> {{ employee.contact_no }}</p>
          </div>
          <div class="mt-4 flex space-x-2">
            <button (click)="editEmployee(employee.id || '')" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
              Edit
            </button>
            <button (click)="deleteEmployee(employee.id || '')" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  private async loadEmployees(): Promise<void> {
    try {
      this.employees = await this.employeeService.getEmployees();
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  }

  addEmployee(): void {
    // window.location.href = 'https://sumanthbajjuri07.github.io/employee-management-app/employees/new';
    this.router.navigate(['/employees/new']);
  }

  editEmployee(id: string): void {
    if (id) {
      // window.location.href = `https://sumanthbajjuri07.github.io/employee-management-app/employees/edit/${id}`;
      this.router.navigate(['/employees/edit', id]);
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    if (id && confirm('Are you sure you want to delete this employee?')) {
      try {
        await this.employeeService.deleteEmployee(id);
        this.loadEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  }
} 