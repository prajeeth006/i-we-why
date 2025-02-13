import { Component, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Mock, Stub } from 'moxxi';
import { BehaviorSubject, Subject } from 'rxjs';

import { RecaptchaEnterpriseService } from '../src/recaptcha-enterprise.service';

@Component({
    standalone: true,
    selector: 'vn-re-captcha',
    template: '',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: TestReCaptchaComponent,
            multi: true,
        },
    ],
})
export class TestReCaptchaComponent implements ControlValueAccessor {
    @Stub() reload: jasmine.Spy;
    @Stub() execute: jasmine.Spy;

    isEnabled = signal<boolean>(false);

    writeValue() {
        console.info('Method not implemented.');
    }

    registerOnChange() {
        console.info('Method not implemented.');
    }

    registerOnTouched() {
        console.info('Method not implemented.');
    }

    setDisabledState?() {
        console.info('Method not implemented.');
    }
}

@Mock({ of: RecaptchaEnterpriseService })
export class RecaptchaEnterpriseServiceMock {
    scriptLoaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
    success: Subject<string> = new Subject();
    recaptchaToken: Subject<string> = new Subject();
    action: string;
    @Stub() initReCaptchaAPI: jasmine.Spy;
    @Stub() executeRecaptcha: jasmine.Spy;
    @Stub() resetCaptcha: jasmine.Spy;
    @Stub() renderRecaptcha: jasmine.Spy;
}
