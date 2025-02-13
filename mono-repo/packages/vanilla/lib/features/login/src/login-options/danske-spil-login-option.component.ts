import { Component, OnDestroy, OnInit } from '@angular/core';

import { HtmlNode, NavigationService } from '@frontend/vanilla/core';
import { TrustAsResourceUrlPipe } from '@frontend/vanilla/shared/browser';

import { LoginIntegrationConfig } from '../integration/login-integration.client-config';

@Component({
    standalone: true,
    imports: [TrustAsResourceUrlPipe],
    selector: 'lh-danske-spil-login-option',
    templateUrl: 'danske-spil-login-option.html',
})
export class DanskeSpilLoginOptionComponent implements OnInit, OnDestroy {
    url: string;

    constructor(
        private config: LoginIntegrationConfig,
        private htmlNode: HtmlNode,
        private navigationService: NavigationService,
    ) {}

    ngOnInit(): void {
        this.config.whenReady.subscribe(() => {
            this.url = this.config.options.loginUrl + this.getLoginSuccessPage();
            this.htmlNode.setCssClass('danske-spil-login', true);
        });
    }

    ngOnDestroy(): void {
        this.htmlNode.setCssClass('danske-spil-login', false);
    }

    private getLoginSuccessPage(): string {
        return encodeURIComponent(
            `${this.navigationService.location.baseUrl()}/${this.navigationService.location.culture}/labelhost/danske-spil-login-success`,
        );
    }
}
