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
  statuses: string[] = ['Complete', 'Incomplete'];
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
      status: ['Incomplete', Validators.required],
      date: ['', [Validators.required, this.minDateValidator()]],
    });
  }

  ngOnInit(): void {
    // Set default date to today
    const today = new Date();
    this.taskForm.get('date')?.setValue(today.toISOString().substring(0, 16));
  }

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
      // Ensure we have an array to work with
      let currentTags = this.taskForm.get('tags')?.value;
      
      // If not an array or empty, initialize it
      if (!Array.isArray(currentTags) || !currentTags) {
        currentTags = [];
      }
      
      // Add the new tag
      currentTags = [...currentTags, tag];
      this.taskForm.get('tags')?.setValue(currentTags);
      event.target.value = '';
    }
  }

  removeTag(tag: string): void {
    // Ensure we have an array to work with
    let currentTags = this.taskForm.get('tags')?.value;
    
    // If not an array or empty, nothing to remove
    if (!Array.isArray(currentTags) || !currentTags) {
      return;
    }
    
    // Remove the tag
    currentTags = currentTags.filter((t: string) => t !== tag);
    this.taskForm.get('tags')?.setValue(currentTags);
  }

  createTask(): void {
    if (this.taskForm.invalid) {
      this.toastr.warning('Please fill in all required fields correctly.', 'Validation Error');
      this.taskForm.markAllAsTouched();
      return;
    }

    if (!this.todoService.isAuthenticated()) {
      this.toastr.error('Please log in to create a task.', 'Authentication Error');
      this.router.navigate(['/login']);
      return;
    }

    this.isSubmitting = true;
    
    // Process the form values
    const formValues = this.taskForm.value;
    
    // Ensure category is one of our categories
    if (!formValues.category || !this.categories.includes(formValues.category)) {
      formValues.category = this.categories[0];
    }
    
    // Process tags to ensure we have a valid array
    let tags = formValues.tags;
    
    // If tags is a string, convert to array
    if (typeof tags === 'string') {
      tags = tags.split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag !== '');
    } 
    // If tags is not an array or is empty, set default
    else if (!Array.isArray(tags) || tags.length === 0) {
      tags = ['general'];
    }
    
    const newTask: todo = {
      ...formValues,
      tags: tags,
      date: new Date(formValues.date).toISOString(),
    };

    this.todoService.createtodo(newTask).subscribe({
      next: (task: todo) => {
        console.log('Task created successfully:', task);
        this.toastr.success('Task created successfully!', 'Success');
        this.taskForm.reset({
          title: '',
          content: '',
          category: '',
          priority: 'Low',
          tags: [],
          status: 'Incomplete',
          date: new Date().toISOString().slice(0, 16),
        });
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {
        let errorMessage = 'Failed to create task. Please try again.';
        if (err.status === 0) {
          errorMessage = 'Network error. Check your connection.';
        } else if (err.status === 401 || err.status === 403) {
          errorMessage = 'Authentication error. Please log in again.';
          this.router.navigate(['/login']);
        } else if (err.status === 400) {
          errorMessage = 'Invalid data. ' + (err.error?.message || 'Check the fields.');
        } else if (err.error?.errors) {
          errorMessage = Object.values(err.error.errors).join(', ');
        }
        this.toastr.error(errorMessage, 'Error');
        console.error('Error creating task:', err);
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