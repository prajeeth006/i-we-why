import { AnimationEvent, animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DsButton } from '@frontend/ui/button';
import { CurrencyPipe, DeviceService, MenuContentItem, ToastrQueueService, ToastrType, WebWorkerService, WorkerType } from '@frontend/vanilla/core';
import { HeaderBarComponent } from '@frontend/vanilla/features/header-bar';
import { AnimatedOverlayRef } from '@frontend/vanilla/features/overlay';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { ClipboardService } from '@frontend/vanilla/shared/clipboard';
import { ShareService } from '@frontend/vanilla/shared/share';

import { ReferredFriendsConfig } from '../referred-friends.client-config';
import { ReferReward, ReferStatus, ReferredFriend } from '../referred-friends.models';
import { ReferredFriendsService } from '../referred-friends.service';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, HeaderBarComponent, CurrencyPipe, TrustAsHtmlPipe, DsButton],
    selector: 'vn-refer-friend-overlay',
    templateUrl: 'refer-friend-overlay.html',
    styleUrls: ['../../../../../../themepark/themes/whitelabel/components/refer-friend/styles.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('flyInOut', [
            state('left', style({ transform: 'translateX(0)' })),
            state('right', style({ transform: 'translateX(0)' })),
            state('bottom', style({ transform: 'translateY(200%)' })),
            state('top', style({ transform: 'translateY(0%)' })),
            transition('left => right', animate('500ms ease-out')),
            transition('right => left', animate('500ms ease-in')),
            transition('bottom => top', animate('500ms ease-out')),
            transition('top => bottom', animate('500ms ease-in')),
        ]),
    ],
})
export class ReferFriendOverlayComponent implements OnInit {
    config = inject(ReferredFriendsConfig);
    deviceService = inject(DeviceService);
    private animatedOverlayRef = inject(AnimatedOverlayRef);
    private clipboardService = inject(ClipboardService);
    private destroyRef = inject(DestroyRef);
    private referredFriendsService = inject(ReferredFriendsService);
    private shareService = inject(ShareService);
    private toastrQueueService = inject(ToastrQueueService);
    private webWorkerService = inject(WebWorkerService);

    readonly state = signal<string | undefined>(undefined);
    readonly referralSteps = signal<string[]>(
        Object.keys(this.config.content.body?.messages || {})
            .filter((key: string) => key.includes('step'))
            .map((key: string) => this.config.content.body?.messages?.[key] ?? ''),
    );
    readonly referralInfo = signal<[string, number][]>(
        (() => {
            {
                const messages = this.config.content.top?.messages;
                const totalBonus = this.getReferred(ReferStatus.QUALIFIED)
                    .flatMap((friend: ReferredFriend) => friend.rewards.map((reward: ReferReward) => reward.bonusAmount))
                    .reduce((a: number, b: number) => a + b, 0);

                return messages
                    ? Object.entries({
                          [messages.friendsRegistered as string]: this.getReferred(ReferStatus.REGISTERED).length,
                          [messages.completedReferrals as string]: this.getReferred(ReferStatus.QUALIFIED).length,
                          [messages.totalBonusEarned as string]: totalBonus,
                      }).filter(([key, _]: [string, number]) => key !== 'undefined')
                    : [];
            }
        })(),
    );
    readonly detailsButton = signal<MenuContentItem>(
        this.getReferred(ReferStatus.QUALIFIED).length ? this.config.trackReferralsButton : this.config.detailsButton,
    );

    private shared: boolean | undefined;

    ngOnInit() {
        if (this.animatedOverlayRef.shouldAnimate) {
            this.state.set(this.animatedOverlayRef.states.initial);

            this.webWorkerService.createWorker(WorkerType.ReferFriendOverlayTimeout, { timeout: 0 }, () => {
                this.state.set(this.animatedOverlayRef.states.on);
                this.webWorkerService.removeWorker(WorkerType.ReferFriendOverlayTimeout);
            });
        }

        this.animatedOverlayRef
            .beforeClose()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => {
                if (this.animatedOverlayRef.shouldAnimate) {
                    this.state.set(this.animatedOverlayRef.states.off);
                }

                if (this.shared === false && this.clipboardService.copy(this.config.invitationUrl.url)) {
                    this.toastrQueueService.add(ToastrType.CopyToClipboard);
                }
            });
    }

    async shareReferralLink() {
        this.shared = this.deviceService.isMobile
            ? await this.shareService.share({
                  title: this.config.shareContent.text,
                  text: this.config.shareContent.toolTip || '',
                  url: this.config.invitationUrl?.url,
              })
            : false;

        this.referredFriendsService.toggleReferFriend(false);
    }

    onAnimationEvent(event: AnimationEvent) {
        this.animatedOverlayRef.onAnimationEvent(event);
    }

    close() {
        this.referredFriendsService.toggleReferFriend(false);
    }

    private getReferred(status: ReferStatus): ReferredFriend[] {
        return this.config.referredFriends.friends.filter((friend: ReferredFriend) => friend.status === status);
    }
}
