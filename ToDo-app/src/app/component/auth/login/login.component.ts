import { Component } from '@angular/core';
import { NgIf, KeyValuePipe, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../shared/services/auth.service/auth.service';
import { AuthResponse, UserData } from '../../../shared/services/auth.service/auth.models';
interface FormErrors {
  general?: string;
  [key: string]: string | undefined;
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, KeyValuePipe, NgFor, RouterModule],
  selector: 'app-login',
  templateUrl:'./login.component.html'
})
export class LoginComponent {
   loginForm: FormGroup;
  formErrors: FormErrors = {};
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

 onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response: AuthResponse) => {
          console.log('Login successful!', response);
          if (response.token) {
            localStorage.setItem('token', response.token); // <-- change 'authToken' to 'token'
            if (response.name) {
              localStorage.setItem('userName', response.name);
              this.proceedAfterLogin();
            } else {
              this.authService.getUserByEmail(this.loginForm.value.email).subscribe({
                next: (user: UserData | undefined) => {
                  if (user && user.name) {
                    localStorage.setItem('userName', user.name);
                  }
                  this.proceedAfterLogin();
                },
                error: (error: HttpErrorResponse) => {
                  console.log('Error fetching user data:', error);
                  this.proceedAfterLogin();
                }
              });
            }
          } else {
            this.formErrors = { general: 'No token received from server.' };
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log('Login error:', error);
          if (error.error?.errors) {
            this.formErrors = error.error.errors;
          } else if (error.error?.message) {
            this.formErrors = { general: error.error.message };
          } else {
            this.formErrors = { general: 'Login failed. Please check your credentials.' };
          }
          Swal.fire({
            icon: 'error',
            title: 'Login failed!',
            text: this.formErrors.general || 'Please check your email or password.',
            confirmButtonText: 'Try Again'
          });
        },
        complete: () => {
          console.log('Login request completed');
        }
      });
    } else {
      this.formErrors = { general: 'Please fill in all required fields correctly.' };
      this.loginForm.markAllAsTouched();
    }
  }
 private proceedAfterLogin(): void {
    this.formErrors = {};
    Swal.fire({
      icon: 'success',
      title: 'Login successful!',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      this.router.navigateByUrl('/dashboard');
    });
  }
}
