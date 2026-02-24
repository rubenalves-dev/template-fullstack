import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    Badge,
    Button as RaiiaaButton,
    FormField,
    Input,
    Select,
    Spinner,
    Tooltip,
    toSelectItems,
} from '@template-fullstack-client/raiiaa-kit';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';

@Component({
    imports: [
        RouterModule,
        RaiiaaButton,
        Input,
        Badge,
        Tooltip,
        Spinner,
        FormField,
        ReactiveFormsModule,
        Select,
        Button,
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

    protected listItems = [
        {
            id: 1,
            name: 'John',
            age: 25,
            city: 'New York',
        },
        {
            id: 2,
            name: 'Jane',
            age: 30,
            city: 'Paris',
        },
        {
            id: 3,
            name: 'Bob',
            age: 20,
            city: 'London',
        },
        {
            id: 4,
            name: 'Alice',
            age: 22,
            city: 'Berlin',
        },
        {
            id: 5,
            name: 'Mary',
            age: 23,
            city: 'Madrid',
        },
        {
            id: 6,
            name: 'Peter',
            age: 24,
            city: 'Rome',
        },
    ];

    selectList = toSelectItems(
        this.listItems,
        'name',
        'id',
        (item) => item.id == 2,
    );
}
