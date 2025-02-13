import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import {
    ClientConfigProductName,
    ContentService,
    LoginNavigationService,
    NavigationService,
    ViewTemplateForClient,
    WINDOW,
} from '@frontend/vanilla/core';
import { HeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { first } from 'rxjs';

import { LoginDialogService } from '../login-dialog/login-dialog.service';

@Component({
    standalone: true,
    imports: [HeaderBarComponent, CommonModule],
    providers: [LoginDialogService],
    selector: 'vn-pre-login-page',
    templateUrl: 'pre-login-page.html',
})
export class PreLoginPageComponent implements OnInit {
    item: ViewTemplateForClient;
    title: string;
    origin: string | null;

    private url: string | null;

    readonly #window = inject(WINDOW);

    constructor(
        private contentService: ContentService,
        private loginDialogService: LoginDialogService,
        private navigation: NavigationService,
        private loginNavigation: LoginNavigationService,
    ) {}

    ngOnInit() {
        // ensured by guard
        this.url = this.navigation.location.search.get('url');
        this.origin = this.navigation.location.search.get('origin');

        this.contentService
            .getJson('App-v1.0/PreLogin', { product: ClientConfigProductName.SF })
            .pipe(first())
            .subscribe((data: ViewTemplateForClient) => {
                this.item = data;
                this.title = this.item.messages![`Origin_Title_${this.origin}`]!;
            });
    }

    register() {
        this.loginNavigation.goToRegistration({ appendReferrer: this.url });
    }

    login() {
        this.loginDialogService.open({ returnUrl: this.url });
    }

    back() {
        this.#window.history.back();
    }
}
