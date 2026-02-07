import {Component, inject, signal} from '@angular/core';
import {AuthService, ButtonComponent, InputComponent, NotificationService} from "shared";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'raiiaa-register',
  imports: [
    ButtonComponent,
    FormsModule,
    InputComponent,
    RouterLink,
    ReactiveFormsModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss', '../auth.scss'],
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  isLoading = signal(false);

  registerForm = new FormGroup({
    full_name: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  get fullNameControl(): FormControl {
    return this.registerForm.controls.full_name;
  }

  get emailControl(): FormControl {
    return this.registerForm.controls.email;
  }

  get passwordControl(): FormControl {
    return this.registerForm.controls.password;
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);

    const payload = this.registerForm.getRawValue();

    this.authService.register(payload).subscribe({
      next: (response) => {
        console.log('Registration success:', response.data.message);
        this.notificationService.show('success', 'Registration successful! Please sign in.');
        this.isLoading.set(false);
        this.router.navigate(['/admin/auth/login']);
      },
      error: (err) => {
        console.error('Registration error', err);
        this.notificationService.show('error', 'Registration failed. Please try again.');
        this.isLoading.set(false);
      },
    });
  }
}
