import { todo } from './../../shared/Model/todo';
import { TodoService } from './../../shared/services/todo.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.css']
})
export class UpdateTaskComponent implements OnInit {
  taskForm: FormGroup;
  taskId: string | null = null;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService
  ) {
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
      this.todoService.getbyid(this.taskId).subscribe({
        next: (task: todo) => {
          this.taskForm.patchValue({
            title: task.title,
            content: task.content,
            category: task.category,
            priority: task.priority,
            tags: task.tags.join(','),
            status: task.status,
            date: new Date(task.date).toISOString().substring(0, 16)
          });
        },
        error: (err) => {
          console.error('Error fetching task:', err);
          alert('Failed to load task. Please try again.');
        }
      });
    }
  }

  updateTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const updatedTask: todo = {
      ...this.taskForm.value,
      id: this.taskId!,
      tags: this.taskForm.value.tags.split(',').map((tag: string) => tag.trim()),
      date: new Date(this.taskForm.value.date).toISOString()
    };

    this.todoService.updatetodo(updatedTask).subscribe({
      next: (task: todo) => {
        console.log('Task updated successfully:', task);
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
