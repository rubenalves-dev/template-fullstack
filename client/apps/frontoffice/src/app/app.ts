import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    Badge,
    Button,
    FormField,
    Input,
    Spinner,
    Tooltip,
} from '@template-fullstack-client/raiiaa-kit';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';

@Component({
    imports: [
        RouterModule,
        Button,
        Input,
        Badge,
        Tooltip,
        Spinner,
        FormField,
        ReactiveFormsModule,
    ],
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    protected title = 'frontoffice';

    protected form = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
    });
}
