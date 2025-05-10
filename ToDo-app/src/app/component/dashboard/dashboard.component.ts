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

import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import { MatDialog } from '@angular/material/dialog';
import { ManageAccountDialogComponent } from './manage-account-dialog.component';
import { NavbarStateService } from '../../shared/services/navbar-state.service';

import { Router, RouterModule } from '@angular/router';


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
  displayedColumns: string[] = ['task', 'dueDate', 'status', 'actions'];
  // Data source for the Material table
  dataSource!: MatTableDataSource<Todo>;
  // References to paginator and sort components
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Array to hold all todo tasks
  todos: Todo[] = [];

  // Counters for completed and pending tasks
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
    this.taskService.getTasks().subscribe(
      (tasks: any) => {
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

  /**
   * Toggle the status of a task between Complete and Incomplete.
   * @param todo The task to update.
   */
  toggleStatus(todo: Todo) {
    todo.status = todo.status === 'Complete' ? 'Incomplete' : 'Complete';
    this.dataSource.data = [...this.todos];
    this.calculateTaskStatus();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Calculate the number of completed and pending tasks.
   */
  calculateTaskStatus() {
    this.completedTasks = this.todos.filter(todo => todo.status === 'Complete').length;
    this.pendingTasks = this.todos.filter(todo => todo.status === 'Incomplete').length;
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
}
