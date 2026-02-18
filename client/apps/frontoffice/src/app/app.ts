import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    Badge,
    Button,
    Input,
    Spinner,
    Tooltip,
} from '@template-fullstack-client/raiiaa-kit';

@Component({
    imports: [RouterModule, Button, Input, Badge, Tooltip, Spinner],
    selector: 'app-root',
    templateUrl: './app.html',
    styleUrl: './app.css',
})
export class App {
    protected title = 'frontoffice';
}
