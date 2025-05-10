import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TodoService } from '../../shared/services/todo.service';
import { todo } from '../../shared/Model/todo';
import { MatIconModule } from '@angular/material/icon';

interface Todo {
  id?: number;
  task: string;
  dueDate: string;
  status: string;
}

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule,MatIconModule],
   templateUrl: './task-view.component.html',
  styleUrl: './task-view.component.css'
})
export class TaskViewComponent implements OnInit {
  task?: Todo;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const id = idParam ? +idParam : null;
      if (id !== null) {
        this.fetchTask(id);
      } else {
        this.loading = false;
        this.task = undefined;
      }
    });
  }

  fetchTask(id: number) {
    this.loading = true;
    this.todoService.getbyid(id.toString()).subscribe({
      next: (task: todo | undefined) => {
        if (task) {
          // Map the todo to the Todo interface
          this.task = {
            id: task.id ? +task.id : undefined, // Adjust as necessary
            task: task.title, // Assuming title corresponds to task
            dueDate: task.date, // Assuming date corresponds to dueDate
            status: task.status,
          };
        } else {
          this.task = undefined;
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching task by id:', err);
        this.task = undefined;
        this.loading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
