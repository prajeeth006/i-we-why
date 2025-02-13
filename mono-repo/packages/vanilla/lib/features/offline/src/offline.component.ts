import { OverlayRef } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService, DynamicHtmlDirective, Logger, NetworkService, ViewTemplate, WINDOW } from '@frontend/vanilla/core';
import { filter } from 'rxjs/operators';

import { OfflineConfig } from './offline.client-config';

@Component({
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DynamicHtmlDirective],
    selector: 'vn-offline',
    templateUrl: 'offline.html',
})
export class OfflineComponent implements OnInit {
    private networkService = inject(NetworkService);
    private offlineConfig = inject(OfflineConfig);
    private authService = inject(AuthService);
    private overlayRef = inject(OverlayRef);
    private log = inject(Logger);

    readonly #window = inject(WINDOW);

    content = signal<ViewTemplate>(this.offlineConfig.content);

    private readonly destroyRef = inject(DestroyRef);

    ngOnInit() {
        this.networkService.events
            .pipe(
                takeUntilDestroyed(this.destroyRef),
                filter((e) => e.online),
            )
            .subscribe((e) => this.refresh(e.source === 'windowEvent'));
    }

    async refresh(runApiCheck: boolean) {
        try {
            if (runApiCheck) {
                await this.authService.isAuthenticated();
            }

            if (this.networkService.isOnline) {
                this.overlayRef.detach();
            }
        } catch (err) {
            // this shouldn't really happen
            if (this.networkService.isOnline) {
                this.log.error('Api check for online network returned unexpected error. This check should not fail if the network is online.', err);
                this.#window.location.reload();
            }
        }
    }
}
