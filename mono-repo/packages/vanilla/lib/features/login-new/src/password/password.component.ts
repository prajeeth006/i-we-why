import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

import { FormElementTemplateForClient } from '@frontend/vanilla/core';
import { FormFieldComponent, ValidationHintComponent, Validators } from '@frontend/vanilla/shared/forms';

@Component({
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ValidationHintComponent, FormFieldComponent],
    selector: 'vn-password',
    templateUrl: 'password.html',
})
export class PasswordComponent implements OnInit {
    @Input() content: FormElementTemplateForClient;

    form: FormGroup;
    isPasswordVisible: boolean;
    showValidationHint: boolean;

    constructor(
        private formGroupDirective: FormGroupDirective,
        private formBuilder: FormBuilder,
    ) {}

    ngOnInit() {
        this.form = this.formGroupDirective.form;

        this.form.addControl('password', this.formBuilder.control('', [Validators.required]));
    }

    onFocus() {
        throw new Error('Method not implemented.');
    }

    onChange() {
        throw new Error('Method not implemented.');
    }

    togglePasswordVisibility() {
        throw new Error('Method not implemented.');
    }
}
