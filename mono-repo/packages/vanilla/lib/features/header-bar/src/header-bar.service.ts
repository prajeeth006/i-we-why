import { Injectable, inject } from '@angular/core';

import { AuthService, DslService, Logger, NavigationService, Page, UrlService, UserService, WINDOW } from '@frontend/vanilla/core';
import { AccountMenuDataService } from '@frontend/vanilla/shared/account-menu';
import { WorkflowService } from '@frontend/vanilla/shared/login';
import { ReplaySubject, first } from 'rxjs';

import { HeaderBarConfig } from './header-bar.client-config';

export interface HeaderBarCloseActionHandler {
    (origin: string, ...args: any[]): void | Promise<any>;
}

@Injectable({
    providedIn: 'root',
})
export class HeaderBarService {
    private handlers = new Map<string, HeaderBarCloseActionHandler>();

    private readonly enabled$$ = new ReplaySubject<boolean>(1);
    private readonly disableClose$$ = new ReplaySubject<boolean>(1);
    private readonly showBackButton$$ = new ReplaySubject<boolean>(1);
    readonly enabled$ = this.enabled$$.asObservable();
    readonly disableClose$ = this.disableClose$$.asObservable();
    readonly showBackButton$ = this.showBackButton$$.asObservable();

    readonly #window = inject(WINDOW);

    constructor(
        private workflow: WorkflowService,
        private navigation: NavigationService,
        private auth: AuthService,
        private logger: Logger,
        private accountMenuService: AccountMenuDataService,
        private urlService: UrlService,
        private user: UserService,
        private page: Page,
        private dslService: DslService,
        public config: HeaderBarConfig,
    ) {
        this.config.whenReady.pipe(first()).subscribe(() => {
            this.dslService.evaluateExpression<boolean>(this.config.isEnabledCondition).subscribe((enabled) => this.enabled$$.next(enabled));
            this.dslService
                .evaluateExpression<boolean>(this.config.disableCloseCondition)
                .subscribe((disableClose) => this.disableClose$$.next(disableClose));
            this.dslService
                .evaluateExpression<boolean>(this.config.showBackButtonCondition)
                .subscribe((showBackButton) => this.showBackButton$$.next(showBackButton));
        });
    }

    registerActions() {
        this.register('goToLastKnownProduct', () => this.navigation.goToLastKnownProduct());
        this.register('logout', () => this.logout());
        this.register('finalize', () => this.workflow.finalize());
        this.register('skip', () => this.workflow.skip());
        this.register('finalizeWorkflowWithData', (data: any) => this.workflow.finalizeWithData(data));
    }

    close() {
        if (this.accountMenuService.routerModeReturnUrl && this.user.workflowType === 0) {
            const parsedUrl = this.urlService.parse(this.accountMenuService.routerModeReturnUrl);
            if (parsedUrl.culture != this.page.lang) {
                parsedUrl.changeCulture(this.page.lang);
            }
            this.navigation.goTo(parsedUrl);
            this.accountMenuService.removeReturnUrlCookie();
            return;
        }

        const workflowCloseAction = this.config.workflowCloseAction[this.user.workflowType];
        if (workflowCloseAction) {
            this.invoke(workflowCloseAction.action, workflowCloseAction.param ? [workflowCloseAction.param] : []);
            return;
        }

        if (this.user.workflowType > 0) {
            this.logger.error(`Workflow Id ${this.user.workflowType} is not mapped in header-bar configuration.`);
            this.logout();
            return;
        }

        this.navigation.goToLastKnownProduct();
    }

    back() {
        if (this.accountMenuService.routerModeReturnUrl || this.#window.document.referrer) {
            this.#window.history.back();
            return;
        }

        this.navigation.goToLastKnownProduct();
    }

    private invoke(fname: string | undefined, args?: any[]): Promise<void> {
        args = args || [];
        let fn: HeaderBarCloseActionHandler | undefined;
        if (fname) {
            fn = this.handlers.get(fname);
        }
        const [origin, ...restArgs] = args;
        if (fn instanceof Function) {
            const result = fn.apply(null, [origin, restArgs]);
            if (result?.then) {
                return result;
            } else {
                return Promise.resolve();
            }
        }

        return Promise.reject(`Handler for header bar action ${fname} not found.`);
    }

    private logout() {
        return this.auth
            .logout({ redirectAfterLogout: false })
            .then(() => this.navigation.goToLastKnownProduct({ forceReload: true }))
            .catch(() => this.navigation.goToLastKnownProduct({ forceReload: true }));
    }

    private register(name: string, fn: HeaderBarCloseActionHandler) {
        this.handlers.set(name, fn);
    }
}
