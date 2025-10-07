import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../auth/auth';
import { Router } from '@angular/router';
import { LoginDto } from '../../auth/auth.models';
import { switchMap, filter, take } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  private auth = inject(Auth);
  private router = inject(Router);
  loginForm = new FormGroup({
    userName: new FormControl('', {nonNullable: true }),
    password: new FormControl('', {nonNullable: true }),

  });

  onSubmit() {

    if(this.loginForm.invalid) return;
    const loginDTO: LoginDto = {
      username: this.loginForm.controls.userName.value,
      password: this.loginForm.controls.password.value
    }

    this.auth.login(loginDTO).subscribe({
      next: () => {
        console.log('Login successful!');
        // Redirect to dashboard or home page
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        // Handle login error
      }
    });


  }

}
