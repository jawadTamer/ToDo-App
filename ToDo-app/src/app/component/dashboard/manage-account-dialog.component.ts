import { Component, OnInit } from '@angular/core';
import { MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatDialogContent } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AuthServicee } from '../../shared/services/services/auth.servicee';
import { TodoService } from '../../shared/services/todo.service';

@Component({
    standalone: true,
  selector: 'app-manage-account-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions,
    NgIf
  ],
  template: `
    <h2 mat-dialog-title>Manage Account</h2>
    <mat-dialog-content>
      <div class="user-info" *ngIf="userName || userEmail">
        <h3>User Information</h3>
        <p *ngIf="userName"><strong>Name:</strong> {{ userName }}</p>
        <p *ngIf="userEmail"><strong>Email:</strong> {{ userEmail }}</p>
      </div>
      <p>What would you like to do?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button color="primary" (click)="logout()">Logout</button>
      <button mat-button color="warn" (click)="deleteAccount()">Delete Account</button>
      <button mat-button (click)="close()">Cancel</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .user-info {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f5f5f5;
      border-radius: 5px;
    }
    .user-info h3 {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 18px;
    }
    .user-info p {
      margin: 5px 0;
    }
  `]
})
export class ManageAccountDialogComponent implements OnInit {
  userName: string | null = null;
  userEmail: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<ManageAccountDialogComponent>,
    private router: Router,
    private authService: AuthServicee,
    private todoService: TodoService
  ) {}

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName');
    this.userEmail = localStorage.getItem('userEmail');
    
    // Try to get current user info if email is not available
    if (!this.userEmail) {
      this.authService.getCurrentUser().subscribe({
        next: (userData) => {
          if (userData && userData.email) {
            this.userEmail = userData.email;
            localStorage.setItem('userEmail', userData.email);
          }
          if (userData && userData.name && !this.userName) {
            this.userName = userData.name;
            localStorage.setItem('userName', userData.name);
          }
        },
        error: () => {
          console.log('Could not fetch user information');
        }
      });
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    this.dialogRef.close();
    this.router.navigate(['/login']);
  }

  deleteAccount() {
    // Use SweetAlert2 for confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete your account? This action cannot be undone and will delete all your tasks.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Show loading state
        Swal.fire({
          title: 'Deleting...',
          text: 'Deleting your tasks and account',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // First delete all tasks
        this.todoService.deleteAllUserTasks().subscribe({
          next: (result) => {
            console.log('Tasks deletion result:', result);
            
            // Then delete the account
            this.authService.deleteAccount().subscribe({
              next: () => {
                localStorage.removeItem('token');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
                this.dialogRef.close();
                this.router.navigate(['/login']);
                Swal.fire('Deleted!', 'Your account and all tasks have been deleted.', 'success');
              },
              error: (err: any) => {
                Swal.fire('Failed!', 'Failed to delete account: ' + (err.error?.message || err.message), 'error');
              }
            });
          },
          error: (err: any) => {
            console.error('Error deleting tasks:', err);
            Swal.fire({
              title: 'Warning',
              text: 'Could not delete all tasks. Do you still want to delete your account?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Yes, delete account',
              cancelButtonText: 'Cancel'
            }).then((confirmResult) => {
              if (confirmResult.isConfirmed) {
                this.authService.deleteAccount().subscribe({
                  next: () => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('userEmail');
                    this.dialogRef.close();
                    this.router.navigate(['/login']);
                    Swal.fire('Deleted!', 'Your account has been deleted.', 'success');
                  },
                  error: (accountErr: any) => {
                    Swal.fire('Failed!', 'Failed to delete account: ' + (accountErr.error?.message || accountErr.message), 'error');
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}