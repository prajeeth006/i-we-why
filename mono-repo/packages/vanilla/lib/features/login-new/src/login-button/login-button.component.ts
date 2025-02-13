import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

import { FormElementTemplateForClient } from '@frontend/vanilla/core';

@Component({
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    selector: 'vn-login-button',
    templateUrl: 'login-button.html',
})
export class LoginButtonComponent implements OnInit {
    @Input() content: FormElementTemplateForClient;
    @Output() onSubmit = new EventEmitter<void>();

    form: FormGroup;
    selectedLoginOption: string; // Use enum

    constructor(
        private formGroupDirective: FormGroupDirective,
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit() {
        this.form = this.formGroupDirective.form;
        this.form.addControl('loginButton', this.formBuilder.control(''));
    }
}
