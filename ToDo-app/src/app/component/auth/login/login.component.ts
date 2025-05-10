import { Component } from '@angular/core';
import { NgIf , KeyValuePipe , NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators , ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service/auth.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule , NgIf , KeyValuePipe , NgFor, RouterModule],
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  formErrors: any = {};

  constructor(private fb: FormBuilder, private authService: AuthService , private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Login successful!', response);
          localStorage.setItem('token', response.token);

        
          if (response.name) {
            localStorage.setItem('userName', response.name);
            
            this.formErrors = {};
            Swal.fire({
              icon: 'success',
              title: 'Login successful!',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.router.navigateByUrl('/dashboard');
            });
          } else if (this.loginForm.value.email) {
       
            this.authService.getUserByEmail(this.loginForm.value.email).subscribe(user => {
              if (user && user.name) {
                localStorage.setItem('userName', user.name);
              }
              this.formErrors = {};
              Swal.fire({
                icon: 'success',
                title: 'Login successful!',
                showConfirmButton: false,
                timer: 1500
              }).then(() => {
                this.router.navigateByUrl('/dashboard');
              });
            });
          }
        },
        error: (error) => {
          console.log('Login error:', error);
          this.formErrors = error;

          Swal.fire({
            icon: 'error',
            title: 'Login failed!',
            text: 'Please check your email or password.',
            confirmButtonText: 'Try Again'
          });
        }
      });
    }
  }
}
