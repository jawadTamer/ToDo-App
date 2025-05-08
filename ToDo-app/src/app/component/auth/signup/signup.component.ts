import { Component } from '@angular/core';
import { NgIf, KeyValuePipe, NgFor } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service/auth.service';
import { UserData } from '../../../shared/services/auth.service/auth.models';

// ✨ import sweetalert
import Swal from 'sweetalert2';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, KeyValuePipe, NgFor, RouterModule],
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent {
  signupForm: FormGroup;
  formErrors: any = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router  // أضفنا Router هنا
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      age: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const userData: UserData = this.signupForm.value;

      this.authService.register(userData).subscribe({
        next: (response) => {
          console.log('Signup successful!', response);
          localStorage.setItem('token', response.token);
          this.formErrors = {};

          Swal.fire({
            icon: 'success',
            title: 'Signup Successful!',
            text: 'Your account has been created. You can now log in.',
            confirmButtonText: 'Go to Login'
          }).then(() => {
            this.router.navigateByUrl('/login');
          });
        },
        error: (errors) => {
          console.log('Signup errors:', errors);
          this.formErrors = errors;

          Swal.fire({
            icon: 'error',
            title: 'Signup Failed!',
            text: 'Please check the form and try again.',
            confirmButtonText: 'Try Again'
          });
        }
      });
    }
  }
}
