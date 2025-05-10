import { Component } from '@angular/core';
import { MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { MatDialogContent } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AuthServicee } from '../../shared/services/services/auth.servicee';
@Component({
    standalone: true,
  selector: 'app-manage-account-dialog',
  imports: [
    MatDialogContent,
    MatDialogActions
  ],
  template: `
    <h2 mat-dialog-title>Manage Account</h2>
    <mat-dialog-content>
      <p>What would you like to do?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button color="primary" (click)="logout()">Logout</button>
      <button mat-button color="warn" (click)="deleteAccount()">Delete Account</button>
      <button mat-button (click)="close()">Cancel</button>
    </mat-dialog-actions>
  `
})
export class ManageAccountDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ManageAccountDialogComponent>,
    private router: Router,
    private authService: AuthServicee
  ) {}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.dialogRef.close();
    this.router.navigate(['/login']);
  }

  deleteAccount() {
    // Use SweetAlert2 for confirmation
    Swal.fire({
      title: 'Are you sure?',
      text: 'Are you sure you want to delete your account? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.deleteAccount().subscribe({
          next: () => {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            this.dialogRef.close();
            this.router.navigate(['/login']);
            Swal.fire('Deleted!', 'Your account has been deleted.', 'success');
          },
          error: (err: any) => {
            Swal.fire('Failed!', 'Failed to delete account: ' + (err.error?.message || err.message), 'error');
          }
        });
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}