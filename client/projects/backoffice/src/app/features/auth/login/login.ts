import {Component, inject, signal} from '@angular/core';
import {AuthService, ButtonComponent, InputComponent, NotificationService} from "shared";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import {MenuService} from '../../../core/menu/menu-service';

@Component({
  selector: 'raiiaa-login',
  imports: [
    ButtonComponent,
    FormsModule,
    InputComponent,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss', '../auth.scss'],
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly menuService = inject(MenuService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  isLoading = signal(false);

  loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  get emailControl(): FormControl {
    return this.loginForm.controls.email;
  }

  get passwordControl(): FormControl {
    return this.loginForm.controls.password;
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);

    const { email, password } = this.loginForm.getRawValue();

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        // In a real app, store the token here (e.g., localStorage or cookie)
        this.notificationService.show('success', 'Login successful!');
        this.menuService.loadMenu();
        this.isLoading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login error', err);
        this.notificationService.show('error', 'Invalid email or password.');
        this.isLoading.set(false);
      },
    });
  }
}
