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
      if (idParam) {
        this.fetchTask(idParam);
      } else {
        this.loading = false;
        this.task = undefined;
      }
    });
  }

  fetchTask(id: string) {
    this.loading = true;
    this.todoService.getbyid(id).subscribe({
      next: (task: todo | undefined) => {
        if (task) {
          let standardStatus = 'Incomplete';
          if (task.status) {
            if (task.status.toLowerCase() === 'complete' || 
                task.status.toLowerCase() === 'completed') {
              standardStatus = 'Complete';
            }
          }
          
          // Map the todo to the Todo interface
          this.task = {
            id: task.id ? +task.id : undefined, // Adjust as necessary
            task: task.title, // Assuming title corresponds to task
            dueDate: task.date, // Assuming date corresponds to dueDate
            status: standardStatus,
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
