import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

import { TodoService } from '../../shared/services/todo.service';
import { todo } from '../../shared/Model/todo';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CreateTaskComponent implements OnInit {
  taskForm: FormGroup;
  categories: string[] = ['Work', 'Personal', 'Urgent'];
  priorities: string[] = ['Low', 'Medium', 'High'];
  statuses: string[] = ['pending', 'in-progress', 'completed'];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      category: ['', Validators.required],
      priority: ['Low', Validators.required],
      tags: [[]],
      status: ['pending', Validators.required],
      date: ['', [Validators.required, this.minDateValidator()]],
    });
  }

  ngOnInit(): void {}

  minDateValidator() {
    return (control: any) => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today ? null : { minDate: true };
    };
  }

  addTag(event: any): void {
    const tag = event.target.value.trim();
    if (tag && !this.taskForm.get('tags')?.value.includes(tag)) {
      const currentTags = [...this.taskForm.get('tags')?.value, tag];
      this.taskForm.get('tags')?.setValue(currentTags);
      event.target.value = '';
    }
  }

  removeTag(tag: string): void {
    const currentTags = this.taskForm.get('tags')?.value.filter((t: string) => t !== tag);
    this.taskForm.get('tags')?.setValue(currentTags);
  }

  createTask(): void {
    if (this.taskForm.invalid) {
      this.toastr.warning('Please fill in all required fields correctly.', 'Validation Error');
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const newTask: todo = this.taskForm.value;
    newTask.date = new Date(newTask.date).toISOString();

    this.todoService.createtodo(newTask).subscribe({
      next: (task: any) => {
        this.toastr.success('Task created successfully!', 'Success');
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        let errorMessage = 'Failed to create task. Please try again.';
        if (err.status === 0) {
          errorMessage = 'Network error. Check your connection.';
        } else if (err.status === 403 || err.status === 401) {
          errorMessage = 'Authentication or permission error.';
        } else if (err.status === 400) {
          errorMessage = 'Invalid data. Please check the fields.';
        }
        this.toastr.error(errorMessage, 'Error');
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
