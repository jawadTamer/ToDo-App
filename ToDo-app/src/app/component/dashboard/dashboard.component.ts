import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TaskService } from '../../shared/services/task.service';
import { TodoService } from '../../shared/services/todo.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

import { Router, RouterModule } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import Swal from 'sweetalert2';  

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, transition, style, animate } from '@angular/animations';

import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { ManageAccountDialogComponent } from './manage-account-dialog.component';
import { NavbarStateService } from '../../shared/services/navbar-state.service';

import { Router, RouterModule } from '@angular/router';



interface Todo {
  id?: number;
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
    CommonModule,

    NavbarComponent,
    FooterComponent,
    ManageAccountDialogComponent,

    RouterModule
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

  todos: Todo[] = [];
  completedTasks: number = 0;
  pendingTasks: number = 0;


 
  constructor(
    private taskService: TaskService,
    private dialog: MatDialog,
    private navbarState: NavbarStateService ,
  private Router:Router
  ) {}


  // Store the user's name for display

  userName: string = '';

  constructor(
    private taskService: TaskService,
    private router: Router,
    private dialog: MatDialog,
    private todoservice: TodoService
  ) {}

  ngOnInit() {
    this.userName = localStorage.getItem('userName') || '';
    this.fetchTasks();
  }

  fetchTasks() {
    this.taskService.getTasks().subscribe({
      next: (tasks: Todo[]) => {
        this.todos = tasks;
        this.dataSource = new MatTableDataSource(this.todos);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.calculateTaskStatus();
      },
      error: (error) => {
        console.error('Error fetching tasks', error);
      }
    });
  }

 on(){
  this.Router.navigateByUrl('/add');
 }
  // Lifecycle hook: runs after the view has been initialized

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    // Observe when the table is in view
    const table = document.getElementById('taskTable');
    if (table) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          this.navbarState.setTasksActive(entry.isIntersecting);
        },
        { threshold: 0.5 }
      );
      observer.observe(table);
    }
  }

  scrollToTable() {
    const tableElement = document.getElementById('taskTable');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth' });
      this.navbarState.setTasksActive(true);
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


  viewTask(taskId: number | undefined) {
    if (taskId !== undefined) {
      this.router.navigate(['/task-view', taskId.toString()]);
    } else {
      console.warn('Task ID is missing, cannot navigate to task view.');
    }
  }

  scrollToTable() {

    const tableElement = document.getElementById('taskTable');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth' });
    }
  }


  updateTask(todo: Todo) {
    if (todo.id !== undefined) {
      this.router.navigate(['/update-task', todo.id.toString()]);
    } else {
      console.warn('Task ID is missing, cannot navigate to update page.');
    }
  }

   deleteTask(todo: Todo) {
    if (todo.id === undefined) {
      console.warn('Task ID is missing, cannot delete task.');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the task: "${todo.task}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
      focusCancel: true
    }).then(result => {
      if (result.isConfirmed) {
        this.todoservice.deletetodo(todo.id!.toString()).subscribe({
          next: () => {
            this.todos = this.todos.filter(t => t.id !== todo.id);
            this.dataSource.data = this.todos;
            this.calculateTaskStatus();
            if (this.dataSource.paginator) {
              this.dataSource.paginator.firstPage();
            }
            Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
          },
          error: (error: any) => {
            console.error('Error deleting task', error);
            Swal.fire('Error', 'There was an error deleting the task.', 'error');
          }
        });
      }

      openManageAccountDialog() {
    this.dialog.open(ManageAccountDialogComponent, {
      width: '350px'

    });
  }
}

