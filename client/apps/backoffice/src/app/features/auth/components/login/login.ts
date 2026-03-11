import { Component, inject } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@template-fullstack-client/api';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Logger } from '../../../../core/logger/logger';
import { SessionService } from '../../data-access/session-service';

@Component({
    selector: 'app-login',
    imports: [Card, Password, Button, InputText, ReactiveFormsModule],
    templateUrl: './login.html',
    styleUrl: './login.css',
})
export class Login {
    private readonly authService = inject(AuthService);
    private readonly logger = inject(Logger);
    private readonly router = inject(Router);
    private readonly sessionService = inject(SessionService);
    private readonly messageService = inject(MessageService);

    loginForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required]),
    });

    onSubmit() {
        this.authService
            .login({
                email: this.loginForm.get('email')?.value ?? '',
                password: this.loginForm.get('password')?.value ?? '',
            })
            .subscribe({
                next: (response) => {
                    this.logger.info('Login successful:', response);

                    this.sessionService.initialize();
                    this.router.navigate(['/admin']); // Example navigation after successful login
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Logged in successfully',
                    });
                },
                error: (error) => {
                    this.logger.error('Login failed:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Failed to login',
                    });
                },
            });
    }
}
