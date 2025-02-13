import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewEncapsulation, inject, signal } from '@angular/core';

import {
    CommonMessages,
    DateTimeService,
    HtmlNode,
    LocalStoreKey,
    LocalStoreService,
    SlotName,
    WebWorkerService,
    WorkerType,
} from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { ClockConfig } from './clock.client-config';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'vn-clock',
    templateUrl: 'clock.html',
    styleUrls: ['../../../../../themepark/themes/whitelabel/components/clock/styles.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClockComponent implements OnInit, OnDestroy {
    @Input() format: string;
    @Input() slotName: SlotName;

    readonly time = signal<Date>(new Date());

    commonMessages = inject(CommonMessages);
    private clockConfig = inject(ClockConfig);
    private htmlNode = inject(HtmlNode);
    private localStoreService = inject(LocalStoreService);
    private webWorkerService = inject(WebWorkerService);
    private dateTimeService = inject(DateTimeService);

    private htmlNodeClassName: string;

    async ngOnInit() {
        await firstValueFrom(this.clockConfig.whenReady);

        if (this.clockConfig.dateTimeFormat) {
            this.format = this.clockConfig.dateTimeFormat;
        } else if (!this.format) {
            this.format = 'mediumTime';
        }

        this.htmlNodeClassName = `${this.slotName?.toLowerCase() ?? 'custom'}-clock-shown`;
        this.htmlNode.setCssClass(this.htmlNodeClassName, true);

        this.storeSownCount();

        this.webWorkerService.createWorker(WorkerType.ClockInterval, { interval: 1000 }, () => {
            this.time.update(() => (this.clockConfig.useWithTimeZone ? this.dateTimeService.convertLocalToUserTimezone(new Date()) : new Date()));
        });
    }

    ngOnDestroy() {
        this.webWorkerService.removeWorker(WorkerType.ClockInterval);
        this.htmlNode.setCssClass(this.htmlNodeClassName, false);
    }

    private storeSownCount() {
        let clockShowCounter = this.localStoreService.get<number>(LocalStoreKey.ClockShowTimes);

        if (clockShowCounter) {
            if (clockShowCounter > 2) {
                this.localStoreService.set<number>(LocalStoreKey.ClockShowTimes, 0);
            } else {
                this.localStoreService.set<number>(LocalStoreKey.ClockShowTimes, clockShowCounter++);
            }
        } else {
            this.localStoreService.set<number>(LocalStoreKey.ClockShowTimes, 1);
        }
    }
}
