import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DsSocialButton, DsSocialButtonAppArray } from '@frontend/ui/social-button';
import { FormElementTemplateForClient, LoginProvider, LoginProviderProfile, UtilsService } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { LoginProvidersService } from '@frontend/vanilla/shared/login-providers';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LoginContentService } from './login-content.service';

@Component({
    standalone: true,
    imports: [CommonModule, DsSocialButton, IconCustomComponent],
    selector: 'vn-login-provider-button',
    templateUrl: 'login-provider-button.html',
})
export class LoginProviderButtonComponent implements OnInit {
    @Input({ transform: (value: string) => value as LoginProvider }) provider: LoginProvider;
    @Output() loginEvent = new EventEmitter<boolean>();
    dsProvider: DsSocialButtonAppArray;
    readonly Provider = LoginProvider;
    profile$: Observable<LoginProviderProfile>;
    buttonForm: FormElementTemplateForClient | undefined;
    disabled: boolean;

    constructor(
        private loginProvidersService: LoginProvidersService,
        private loginContentService: LoginContentService,
        private utilsService: UtilsService,
    ) {}

    ngOnInit() {
        this.profile$ = this.loginProvidersService.providersProfile.pipe(
            map(
                (profiles: LoginProviderProfile[] | null) =>
                    profiles?.find((profile: LoginProviderProfile) => profile.provider === this.provider) || { provider: this.provider },
            ),
        );
        this.buttonForm = this.loginContentService.content.form[this.provider + 'button'];
        this.dsProvider = <DsSocialButtonAppArray>this.provider;
    }

    emmitLogin(isConnected: boolean) {
        this.disabled = true;
        this.loginEvent.emit(isConnected);
    }

    getLabel(profileName?: string): string {
        return profileName
            ? this.utilsService.format(this.loginContentService.content.messages?.ContinueAs || '', profileName)
            : this.buttonForm?.label || '';
    }

    getBackgroundImage(isConnected: boolean) {
        const contentName = this.provider + (isConnected ? 'icon' : 'image');
        const content: any = this.loginContentService.content.children[contentName];
        const src: string = content?.image?.src;

        return src ? { 'background-image': `url(${src})` } : null;
    }
}
