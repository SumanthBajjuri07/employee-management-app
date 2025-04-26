import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Employee } from '../models/employee.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  employees$ = this.employeesSubject.asObservable();

  constructor(private supabaseService: SupabaseService) {
    this.loadEmployees();
  }

  private async loadEmployees(): Promise<void> {
    try {
      const employees = await this.supabaseService.getEmployees();
      this.employeesSubject.next(employees);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  }

  async getEmployees(): Promise<Employee[]> {
    return this.supabaseService.getEmployees();
  }

  async getEmployee(id: string): Promise<Employee> {
    return this.supabaseService.getEmployee(id);
  }

  async createEmployee(employee: Employee): Promise<Employee> {
    const newEmployee = await this.supabaseService.createEmployee(employee);
    const currentEmployees = this.employeesSubject.value;
    this.employeesSubject.next([newEmployee, ...currentEmployees]);
    return newEmployee;
  }

  async updateEmployee(id: string, employee: Employee): Promise<Employee> {
    const updatedEmployee = await this.supabaseService.updateEmployee(id, employee);
    const currentEmployees = this.employeesSubject.value;
    const index = currentEmployees.findIndex(emp => emp.id === id);
    if (index !== -1) {
      currentEmployees[index] = updatedEmployee;
      this.employeesSubject.next([...currentEmployees]);
    }
    return updatedEmployee;
  }

  async deleteEmployee(id: string): Promise<void> {
    await this.supabaseService.deleteEmployee(id);
    const currentEmployees = this.employeesSubject.value;
    this.employeesSubject.next(currentEmployees.filter(emp => emp.id !== id));
  }
} 