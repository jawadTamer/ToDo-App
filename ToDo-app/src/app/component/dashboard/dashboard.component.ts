import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TaskService } from '../../shared/services/task.service';
import { TodoService } from '../../shared/services/todo.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, transition, style, animate } from '@angular/animations';
import Swal from 'sweetalert2';

import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { MatDialog } from '@angular/material/dialog';
import { ManageAccountDialogComponent } from './manage-account-dialog.component';
import { NavbarStateService } from '../../shared/services/navbar-state.service';

import { Router, RouterModule } from '@angular/router';

interface Todo {
  id?: number;
  email?: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  tags: string[];
  status: string;
  date: string;
  _id?: string;
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
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
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
  // Columns to display in the tasks table
  displayedColumns: string[] = ['title', 'date', 'status', 'actions'];
  // Data source for the Material table
  dataSource!: MatTableDataSource<Todo>;
  // Reference to sort component
  @ViewChild(MatSort) sort!: MatSort;

  // Array to hold all todo tasks
  todos: Todo[] = [];

  // Counters for completed and pending tasks
  completedTasks: number = 0;
  pendingTasks: number = 0;

  // Loading state
  isLoading: boolean = true;

  constructor(
    private taskService: TaskService,
    private todoService: TodoService,
    private dialog: MatDialog,
    private navbarState: NavbarStateService,
    private Router: Router
  ) {}

  // Store the user's name for display
  userName: string = '';

  // Lifecycle hook: runs when component initializes
  ngOnInit() {
    this.userName = localStorage.getItem('userName') || '';
    this.fetchTasks();
    this.calculateTaskStatus();
  }

  /**
   * Fetch tasks from the server and update the data source.
   */
  fetchTasks() {
    this.isLoading = true;
    this.todoService.getalltodo().subscribe(
      (tasks: any) => {
        this.todos = tasks;
        this.dataSource = new MatTableDataSource(this.todos);
        this.calculateTaskStatus();
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching tasks', error);
        this.isLoading = false;
      }
    );
  }

  on() {
    this.Router.navigateByUrl('/add');
  }

  // Lifecycle hook: runs after the view has been initialized
  ngAfterViewInit() {
    if (this.dataSource) {
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

  /**
   * Toggle the status of a task between Complete and Incomplete.
   * @param todo The task to update.
   */
  toggleStatus(todo: Todo) {
    // Toggle the status
    const newStatus = todo.status === 'Complete' ? 'Incomplete' : 'Complete';
    todo.status = newStatus;
    
    // Update the UI immediately
    this.dataSource.data = [...this.todos];
    this.calculateTaskStatus();
    
    // Update the task in the backend
    const updatedTodo = { ...todo, status: newStatus };
    this.todoService.updatetodo(updatedTodo).subscribe({
      next: (response) => {
        console.log('Task status updated successfully:', response);
      },
      error: (error) => {
        console.error('Error updating task status:', error);
        // Revert the status change in case of error
        todo.status = todo.status === 'Complete' ? 'Incomplete' : 'Complete';
        this.dataSource.data = [...this.todos];
        this.calculateTaskStatus();
      }
    });
  }

  /**
   * Calculate the number of completed and pending tasks.
   */
  calculateTaskStatus() {
    this.completedTasks = this.todos.filter(todo => todo.status === 'Complete').length;
    this.pendingTasks = this.todos.filter(todo => todo.status === 'Incomplete' || todo.status === 'pending' || todo.status === 'in-progress').length;
  }

  /**
   * Scroll smoothly to the tasks table in the view.
   */
  scrollToTablee() {
    const tableElement = document.getElementById('taskTable');
    if (tableElement) {
      tableElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  openManageAccountDialog() {
    this.dialog.open(ManageAccountDialogComponent, {
      width: '350px'
    });
  }

  deleteTask(task: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this task?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.todoService.deletetodo(task._id || task.id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Task has been deleted.', 'success');
            this.todos = this.todos.filter(t => (t._id || t.id) !== (task._id || task.id));
            this.dataSource.data = [...this.todos];
            this.calculateTaskStatus();
          },
          error: () => {
            Swal.fire('Error!', 'Failed to delete task.', 'error');
          }
        });
      }
    });
  }
}
