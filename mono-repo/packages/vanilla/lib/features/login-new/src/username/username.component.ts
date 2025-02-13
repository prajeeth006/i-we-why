import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

import { FormElementTemplateForClient, TrackingDirective } from '@frontend/vanilla/core';
import { FormFieldComponent, UsernameMobileNumberComponent, Validators } from '@frontend/vanilla/shared/forms';

@Component({
    standalone: true,
    selector: 'vn-username',
    templateUrl: 'username.html',
    imports: [CommonModule, ReactiveFormsModule, FormFieldComponent, UsernameMobileNumberComponent, TrackingDirective],
})
export class UsernameComponent implements OnInit {
    @Input() content: FormElementTemplateForClient;
    @Input() isMobileLoginEnabled: boolean;

    form: FormGroup;
    trackingData = {
        'page.referringAction': 'Login_Centered_Email_Typed',
        'page.siteSection': 'Authentication',
    };

    constructor(
        private formGroupDirective: FormGroupDirective,
        private formBuilder: FormBuilder, // private loginStoreService: LoginStoreService, // private validationHelperService: ValidationHelperService,
    ) {}

    ngOnInit() {
        this.form = this.formGroupDirective.form;

        // this.form.addControl(
        //     'username',
        //     this.formBuilder.control(this.loginStoreService.LastVisitor, this.validationHelperService.createValidators('usernameLogin')),
        // );

        this.form.addControl('username', this.formBuilder.control('', [Validators.required]));
    }

    onBlurUserId() {
        throw new Error('Method not implemented.');
    }

    onFocusUserId() {
        throw new Error('Method not implemented.');
    }

    usernameChanged() {
        throw new Error('Method not implemented.');
    }

    isMobileChanged() {
        throw new Error('Method not implemented.');
    }
}
