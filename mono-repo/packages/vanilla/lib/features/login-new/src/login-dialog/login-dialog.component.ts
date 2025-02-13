import { Component } from '@angular/core';

import { LoginComponent } from '../login.component';

@Component({
    standalone: true,
    imports: [LoginComponent],
    selector: 'vn-login-dialog',
    templateUrl: 'login-dialog.html',
})
export class LoginDialogComponent {}
