import { todo } from './../../shared/Model/todo';
import { TodoService } from './../../shared/services/todo.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.css'],
  styles: [`
    .form-group small.text-muted {
      display: block;
      margin-top: 5px;
      margin-bottom: 10px;
    }
    input[formControlName="tags"] {
      border-color: #6c757d;
      background-color: #f8f9fa;
    }
    input[formControlName="tags"]:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
    .loading-spinner {
      text-align: center;
      padding: 20px;
      font-size: 18px;
      color: #555;
      background-color: #f8f9fa;
      border-radius: 4px;
      margin-bottom: 20px;
    }
  `]
})
export class UpdateTaskComponent implements OnInit, AfterViewInit {
  taskForm: FormGroup;
  taskId: string | null = null;
  isSubmitting = false;
  originalTask: todo | null = null;
  isLoading: boolean = true;
  
  // Define default values and options
  defaultStatus: string = 'Incomplete';
  categories: string[] = ['Work', 'Personal', 'Other'];
  priorities: string[] = ['Low', 'Medium', 'High'];
  statuses: string[] = ['Complete', 'Incomplete'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService
  ) {
    // Initialize form with empty values
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      category: ['', Validators.required],
      priority: ['', Validators.required],
      tags: ['', Validators.required],
      status: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      console.log('Fetching task with ID:', this.taskId);
      this.loadTaskData();
    }
  }

  ngAfterViewInit(): void {
    // If we still have loading issues after 1000ms, try to repopulate form
    setTimeout(() => {
      if (this.isLoading && this.originalTask) {
        console.log('Delayed form population triggered');
        this.populateFormWithTask(this.originalTask);
      }
    }, 1000);
  }

  loadTaskData(): void {
    if (!this.taskId) return;
    
    this.isLoading = true;
    this.todoService.getbyid(this.taskId).subscribe({
      next: (task: todo) => {
        console.log('Task data received:', task);
        this.originalTask = { ...task };
        
        // Store original task in localStorage as backup
        localStorage.setItem('tempTask', JSON.stringify(task));
        
        // Populate form with task data
        this.populateFormWithTask(task);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching task:', err);
        alert('Failed to load task. Please try again.');
        this.isLoading = false;
        
        // Try to recover from localStorage if available
        const savedTask = localStorage.getItem('tempTask');
        if (savedTask) {
          try {
            const parsedTask = JSON.parse(savedTask);
            if (parsedTask.id === this.taskId) {
              console.log('Recovering task from localStorage');
              this.populateFormWithTask(parsedTask);
            }
          } catch (e) {
            console.error('Error parsing saved task:', e);
          }
        }
      }
    });
  }

  populateFormWithTask(task: todo): void {
    console.log('Populating form with task:', task);
    
    // Process tags
    let tagsString = '';
    if (Array.isArray(task.tags) && task.tags.length > 0) {
      tagsString = task.tags.join(',');
      console.log('Tags joined as string:', tagsString);
    } else if (typeof task.tags === 'string') {
      // In case the tags are already a string
      tagsString = task.tags;
      console.log('Tags already a string:', tagsString);
    } else if (!task.tags) {
      // Handle undefined or null tags
      tagsString = '';
      console.log('Tags are undefined or null, using empty string');
    }
    
    console.log('Tags string for form:', tagsString);
    
    // Format date
    let dateValue = '';
    try {
      if (task.date) {
        dateValue = new Date(task.date).toISOString().substring(0, 16);
      }
    } catch (e) {
      console.error('Error formatting date:', e);
    }
    
    // Normalize status
    let statusValue = this.defaultStatus;
    if (task.status) {
      const statusLower = task.status.toLowerCase();
      if (statusLower === 'complete' || statusLower === 'completed') {
        statusValue = 'Complete';
      } else {
        statusValue = 'Incomplete';
      }
    }
    
    // Normalize category
    let categoryValue = '';
    if (task.category) {
      categoryValue = task.category;
      // If category is not in our list, use the first one
      if (!this.categories.includes(categoryValue)) {
        categoryValue = this.categories[0];
      }
    }
    
    console.log('Category value:', categoryValue);
    
    // Set each form control individually to avoid issues
    this.taskForm.get('title')?.setValue(task.title || '');
    this.taskForm.get('content')?.setValue(task.content || '');
    this.taskForm.get('category')?.setValue(categoryValue);
    this.taskForm.get('priority')?.setValue(task.priority || '');
    this.taskForm.get('tags')?.setValue(tagsString);
    this.taskForm.get('status')?.setValue(statusValue);
    this.taskForm.get('date')?.setValue(dateValue);
    
    console.log('Form values after population:', this.taskForm.value);
    
    // Force update validity after a delay
    setTimeout(() => {
      this.taskForm.updateValueAndValidity();
      console.log('Form values after validity update:', this.taskForm.value);
      
      // Double check empty fields and repopulate if needed
      if (!this.taskForm.get('category')?.value && categoryValue) {
        console.log('Category still empty, forcing value:', categoryValue);
        this.taskForm.get('category')?.setValue(categoryValue, { emitEvent: true });
      }
      
      if (!this.taskForm.get('status')?.value && statusValue) {
        console.log('Status still empty, forcing value:', statusValue);
        this.taskForm.get('status')?.setValue(statusValue, { emitEvent: true });
      }
      
      if (!this.taskForm.get('tags')?.value && tagsString) {
        console.log('Tags still empty, forcing value:', tagsString);
        this.taskForm.get('tags')?.setValue(tagsString, { emitEvent: true });
      }
    }, 300);
  }

  updateTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    
    // Process tags - handle different formats
    let tags: string[] = [];
    const tagsValue = this.taskForm.get('tags')?.value;
    
    if (tagsValue) {
      if (typeof tagsValue === 'string') {
        // Split comma-separated string to array
        tags = tagsValue.split(',')
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag !== '');
      } else if (Array.isArray(tagsValue)) {
        // Use array directly, filtering empty values
        tags = tagsValue.filter((tag: string) => tag !== '');
      }
    }
    
    // If still no tags, use original ones as fallback
    if (tags.length === 0 && this.originalTask && this.originalTask.tags) {
      if (Array.isArray(this.originalTask.tags)) {
        tags = [...this.originalTask.tags];
      } else if (typeof this.originalTask.tags === 'string') {
        tags = (this.originalTask.tags as string).split(',')
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag !== '');
      }
    }
    
    // If still no tags, set a default
    if (tags.length === 0) {
      tags = ['general'];
    }
    
    // Get form values
    const formValues = this.taskForm.value;
    
    // Create updated task object
    const updatedTask: todo = {
      ...(this.originalTask || {}), // Use original task as base
      id: this.taskId ? parseInt(this.taskId) : undefined,
      title: formValues.title || this.originalTask?.title || '',
      content: formValues.content || this.originalTask?.content || '',
      category: formValues.category || this.originalTask?.category || '',
      priority: formValues.priority || this.originalTask?.priority || '',
      tags: tags,
      status: formValues.status || this.defaultStatus,
      date: new Date(formValues.date || new Date()).toISOString()
    };

    console.log('Updating task with data:', updatedTask);
    
    this.todoService.updatetodo(updatedTask).subscribe({
      next: (task: todo) => {
        console.log('Task updated successfully:', task);
        // Clean up temporary storage
        localStorage.removeItem('tempTask');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error updating task:', err);
        let errorMessage = 'Failed to update task. Please try again.';
        if (err.status === 404) {
          errorMessage = 'Task not found.';
        } else if (err.status === 401 || err.status === 403) {
          errorMessage = 'Unauthorized: Please log in again.';
        }
        alert(errorMessage);
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
