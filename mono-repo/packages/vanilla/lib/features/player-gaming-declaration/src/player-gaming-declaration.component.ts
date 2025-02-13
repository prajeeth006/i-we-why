import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
    ClaimsConfig,
    ClientConfigService,
    DslService,
    HtmlNode,
    MessageScope,
    NativeAppService,
    NativeEventType,
    NavigationService,
    UserService,
    ViewTemplateForClient,
} from '@frontend/vanilla/core';
import { CrossProductLayoutComponent } from '@frontend/vanilla/features/cross-product-layout';
import { MessagePanelComponent } from '@frontend/vanilla/features/message-panel';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { RouteDataService } from '@frontend/vanilla/shared/routing';
import { first } from 'rxjs';

import { ACCEPTED_STATUS, IS_POST_LOGIN } from './player-gaming-declaration-constants';
import { PlayerGamingDeclarationTrackingService } from './player-gaming-declaration-tracking.service';
import { PlayerGamingDeclarationService } from './player-gaming-declaration.service';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, TrustAsHtmlPipe, CrossProductLayoutComponent, MessagePanelComponent],
    selector: 'vn-gaming-declaration-page',
    templateUrl: 'player-gaming-declaration.html',
})
export class PlayerGamingDeclarationComponent implements OnInit, OnDestroy {
    readonly content = signal<ViewTemplateForClient | undefined>(undefined);
    readonly MessageScope = MessageScope;

    private isPostLogin: boolean;

    constructor(
        private gamingDeclarationService: PlayerGamingDeclarationService,
        private routeData: RouteDataService,
        private navigationService: NavigationService,
        private clientConfig: ClientConfigService,
        private user: UserService,
        private trackingService: PlayerGamingDeclarationTrackingService,
        private activatedRoute: ActivatedRoute,
        private nativeApp: NativeAppService,
        private html: HtmlNode,
        private dslService: DslService,
    ) {}

    ngOnInit() {
        this.isPostLogin = this.activatedRoute.snapshot.queryParamMap.get('_isPostLogin') === IS_POST_LOGIN;
        this.dslService
            .evaluateContent(this.routeData.getInitData())
            .pipe(first())
            .subscribe((item: ViewTemplateForClient) => {
                this.content.set(item);
            });
        this.trackingService.trackLoad(this.isPostLogin);
        this.html.setCssClass('gaming-declaration', true);
    }

    ngOnDestroy() {
        this.html.setCssClass('gaming-declaration', false);
    }

    accept() {
        this.gamingDeclarationService.accept({ status: ACCEPTED_STATUS }).subscribe(() => {
            this.trackingService.trackAccept(this.isPostLogin);
            this.clientConfig.reload([ClaimsConfig]).then(() => {
                if (this.user.gamingDeclarationFlag?.toUpperCase() !== ACCEPTED_STATUS) {
                    //Saving to cookie just in case Claim is not refreshed at this point.
                    this.gamingDeclarationService.setCookie();
                }
                this.nativeApp.sendToNative({ eventName: NativeEventType.GAMING_DECLARATION_ACCEPTED });
                const returnUrl = this.gamingDeclarationService.returnPath();

                if (returnUrl) {
                    this.navigationService.goTo(returnUrl);
                    this.gamingDeclarationService.removeReturnPath();
                } else {
                    this.navigationService.goToLastKnownProduct({ forceReload: true });
                }
            });
        });
    }
}
