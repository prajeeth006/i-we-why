import { Injectable, inject } from '@angular/core';

import { first } from 'rxjs/operators';

import { OnAppInit } from '../bootstrap/bootstrapper.service';
import { WINDOW } from '../browser/window/window.token';
import { Page } from '../client-config/page.client-config';
import { DslService } from '../dsl/dsl.service';
import { HomeService } from '../home/home.service';
import { Logger } from '../logging/logger';
import { NativeAppService } from '../native-app/native-app.service';
import { NavigationService } from '../navigation/navigation.service';
import { UrlService } from '../navigation/url.service';
import { UserService } from '../user/user.service';
import { MenuAction } from './menu-actions.models';
import { MenuActionsService } from './menu-actions.service';

@Injectable()
export class MenuActionsBootstrapService implements OnAppInit {
    readonly #window = inject(WINDOW);

    constructor(
        private menuActionsService: MenuActionsService,
        private navigationService: NavigationService,
        private urlService: UrlService,
        private user: UserService,
        private homeService: HomeService,
        private dslService: DslService,
        private nativeApplication: NativeAppService,
        private page: Page,
        private log: Logger,
    ) {}

    onAppInit() {
        this.menuActionsService.register(
            MenuAction.OPEN_IN_NEW_WINDOW,
            (_origin: string, url: string, target: string, parameters: { [key: string]: string }) => {
                this.#window.open(url, target || '_blank', parameters['new-window-params']);
            },
        );
        this.menuActionsService.register(MenuAction.SET_QUERY_STRING, (_origin: string, url: string) => {
            if (url?.indexOf('?') > -1) {
                const query = url.split('?')[1]!;
                const queryParams = query.split('=');
                const currentUrl = this.urlService.current();

                currentUrl.search.set(queryParams[0]!, queryParams[1]!);
                this.navigationService.goTo(currentUrl);
            }
        });
        this.menuActionsService.register(MenuAction.REMOVE_QUERY_STRING, (_origin: string, parameter: string) => {
            const currentUrl = this.urlService.current();
            if (currentUrl.search.has(parameter)) {
                currentUrl.search.delete(parameter);
            }
            this.navigationService.goTo(currentUrl);
        });
        this.menuActionsService.register(MenuAction.GOTO_REGISTRATION, (_origin: string, url) => {
            const registrationUrl = this.urlService.appendReferrer(url, { absolute: true });
            this.navigationService.goTo(registrationUrl);
        });
        this.menuActionsService.register(MenuAction.RELOAD, () => {
            this.#window.location.reload();
        });
        this.menuActionsService.register(MenuAction.GO_BACK, () => {
            if (this.#window.history.length) {
                this.#window.history.back();
            }
        });
        this.menuActionsService.register(MenuAction.GOTO_HOME, () => {
            if (this.page.isAnonymousAccessRestricted && !this.user.isAuthenticated) {
                return;
            }
            this.homeService.goTo();
        });
        this.menuActionsService.register(MenuAction.GOTO_RATE_THE_APP, () => {
            this.nativeApplication.sendToNative({
                eventName: 'SHOW_RATETHEAPP',
            });
        });
        this.menuActionsService.register(MenuAction.SEND_TO_NATIVE, (_origin, _url, _target, parameters) => {
            this.nativeApplication.sendToNative({ eventName: parameters.eventName, parameters: parameters });
        });
        this.menuActionsService.register(MenuAction.GOTO_URL_WITH_SSO, (_origin, url) => {
            url = this.urlService.parse(url);
            if (this.user.isAuthenticated) {
                url.search.set('_sso', this.user.ssoToken);
            }
            this.navigationService.goTo(url.absUrl());
        });
        this.menuActionsService.register(MenuAction.REMIND_ME_LATER_ACTION, (_origin, _url, _target, parameters) => {
            const cookieName = parameters?.cookieName;
            const expiration = parameters?.expiration;

            if (cookieName) {
                const dslAction = `c.Counter.Increment("${cookieName}", ${expiration})`;

                this.dslService
                    .executeAction(dslAction)
                    .pipe(first())
                    .subscribe(() => this.log.debug('Counter.Increment DSL action executed'));
            }
        });
    }
}
