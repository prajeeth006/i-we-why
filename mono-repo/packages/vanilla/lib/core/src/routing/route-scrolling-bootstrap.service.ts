import { Location } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

import { OnAppInit } from '../bootstrap/bootstrapper.service';
import { SessionStoreKey } from '../browser/browser.models';
import { SessionStoreService } from '../browser/store/session-store.service';
import { WindowEvent } from '../browser/window/window-ref.service';
import { WINDOW } from '../browser/window/window.token';
import { Page } from '../client-config/page.client-config';
import { DslService } from '../dsl/dsl.service';
import { HeaderService } from '../lazy/service-providers/header.service';
import { NavigationService } from '../navigation/navigation.service';
import { WorkerType } from '../web-worker/web-worker.models';
import { WebWorkerService } from '../web-worker/web-worker.service';

class RouteScrollInfo {
    routeScrollPositions: { [url: string]: number } = {};
    activeUrl: string;
}

@Injectable()
export class RouteScrollingBootstrapService implements OnAppInit {
    private isHistoryNavigation: boolean;
    private isFirstNavigation: boolean = true;
    private routeScrollInfo: RouteScrollInfo;
    readonly #window = inject(WINDOW);

    constructor(
        private location: Location,
        private router: Router,
        private sessionStoreService: SessionStoreService,
        private navigationService: NavigationService,
        private headerService: HeaderService,
        private webWorkerService: WebWorkerService,
        private dslService: DslService,
        private page: Page,
    ) {}

    onAppInit() {
        this.dslService.evaluateExpression<boolean>(this.page.scrollBehaviorEnabledCondition).subscribe((enabled: boolean) => {
            this.restoreScrollPosition(enabled);
        });
    }

    private restoreScrollPosition(restoreScroll: boolean) {
        if ('scrollRestoration' in this.#window.history) {
            this.#window.history.scrollRestoration = 'manual';
        }

        this.restoreState();

        if (restoreScroll) {
            this.#window.addEventListener(WindowEvent.Scroll, () => {
                this.routeScrollInfo.routeScrollPositions[this.navigationService.location.url()] = this.#window.scrollY;
            });

            this.#window.addEventListener(WindowEvent.BeforeUnload, () => {
                this.sessionStoreService.set(SessionStoreKey.RouteScrollInfo, this.routeScrollInfo);
            });

            this.location.subscribe(() => {
                this.isHistoryNavigation = true;
            });
        }

        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            if (!restoreScroll) {
                this.#window.scrollTo(0, 0);
            } else if (this.navigationService.location.hash) {
                this.webWorkerService.createWorker(WorkerType.RouteScrollingTimeout, { timeout: 0 }, () => {
                    this.#window.scrollTo(0, 0);
                    this.scrollToAnchor(this.navigationService.location.hash, Date.now() + 3000);
                });
            } else {
                if (this.isHistoryNavigation) {
                    this.restoreRouteScroll();
                } else {
                    if (this.isFirstNavigation) {
                        this.restoreRouteScroll(true);
                    } else {
                        this.webWorkerService.createWorker(WorkerType.RouteScrollingTimeout, { timeout: 0 }, () => {
                            this.#window.scrollTo(0, 0);
                            this.webWorkerService.removeWorker(WorkerType.RouteScrollingTimeout);
                        });
                    }
                }
            }

            this.isHistoryNavigation = false;
            this.isFirstNavigation = false;
            this.routeScrollInfo.activeUrl = this.navigationService.location.url();
        });
    }

    private restoreState() {
        const info = this.sessionStoreService.get<RouteScrollInfo>(SessionStoreKey.RouteScrollInfo);

        this.routeScrollInfo = info || new RouteScrollInfo();

        if (info) {
            this.sessionStoreService.remove(SessionStoreKey.RouteScrollInfo);
        }
    }

    private restoreRouteScroll(onlyIfOnActiveUrl?: boolean) {
        if (!onlyIfOnActiveUrl || this.routeScrollInfo.activeUrl === this.navigationService.location.url()) {
            const offset = this.routeScrollInfo.routeScrollPositions[this.navigationService.location.url()] || 0;

            this.webWorkerService.createWorker(WorkerType.RouteScrollingTimeout, { timeout: 0 }, () => {
                this.scrollToPosition(offset, Date.now() + 3000);
            });
        }
    }

    private scrollToPosition(offsetY: number, timeout: number) {
        this.webWorkerService.removeWorker(WorkerType.RouteScrollingTimeout);

        const body = this.#window.document.body;
        const html = this.#window.document.documentElement;

        // From http://stackoverflow.com/a/1147768
        const documentHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);

        if (documentHeight - this.#window.innerHeight >= offsetY || Date.now() > timeout) {
            this.doubleTapScrollTo(offsetY);
        } else {
            this.webWorkerService.createWorker(WorkerType.RouteScrollingTimeout, { timeout: 50 }, () => {
                this.scrollToPosition(offsetY, timeout);
            });
        }
    }

    private doubleTapScrollTo(offsetY: number) {
        this.#window.scrollTo(0, offsetY);
        this.webWorkerService.createWorker(WorkerType.RouteScrollingTimeout, { timeout: 0 }, () => {
            this.#window.scrollTo(0, offsetY);
            this.webWorkerService.removeWorker(WorkerType.RouteScrollingTimeout);
        });
    }

    private async scrollToAnchor(anchor: string, timeout: number) {
        this.webWorkerService.removeWorker(WorkerType.RouteScrollingTimeout);

        const element = this.#window.document.querySelector(`#${anchor}`);

        if (element) {
            element.scrollIntoView();
            await firstValueFrom(this.headerService.whenReady);
            this.#window.scrollTo(0, this.#window.scrollY - this.headerService.getHeaderHeight());
        } else if (Date.now() <= timeout) {
            this.webWorkerService.createWorker(WorkerType.RouteScrollingTimeout, { timeout: 50 }, () => {
                this.scrollToAnchor(anchor, timeout);
            });
        }
    }
}
