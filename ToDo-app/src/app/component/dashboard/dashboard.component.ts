import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TaskService } from '../../shared/services/task.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, transition, style, animate } from '@angular/animations';

interface Todo {
  task: string;
  dueDate: string;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  animations: [
    trigger('transitionMessages', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['task', 'dueDate', 'status', 'actions'];
  dataSource!: MatTableDataSource<Todo>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  todos: Todo[] = [

  ];

  completedTasks: number = 0;
  pendingTasks: number = 0;

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.fetchTasks();
    this.calculateTaskStatus();
  }

  fetchTasks() {
    this.taskService.getTasks().subscribe(
      (tasks:any) => {
        this.todos = tasks;
        this.dataSource = new MatTableDataSource(this.todos);
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      },
      (error) => {
        console.error('Error fetching tasks', error);
      }
    );
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  toggleStatus(todo: Todo) {
    todo.status = todo.status === 'Complete' ? 'Incomplete' : 'Complete';
    this.dataSource.data = [...this.todos];
    this.calculateTaskStatus();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  calculateTaskStatus() {
    this.completedTasks = this.todos.filter(todo => todo.status === 'Complete').length;
    this.pendingTasks = this.todos.filter(todo => todo.status === 'Incomplete').length;
  }

  scrollToTable() {
    const tableElement = document.getElementById('taskTable');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
