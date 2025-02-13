import { Directive, ElementRef, HostListener, OnInit, inject } from '@angular/core';

import { Logger } from '../logging/logger';
import { TrackingService } from '../tracking/tracking-core.service';
import { AnchorTrackingHelperService } from './anchor-tracking-helper-service';

@Directive()
export abstract class DynamicHtmlButtonComponentBase implements OnInit {
    public log = inject(Logger);
    public anchorTrackingHelperService = inject(AnchorTrackingHelperService);
    protected elementRef = inject(ElementRef<HTMLAnchorElement>);
    private trackingEvent: string | null;
    private trackingData: { [prop: string]: string } = {};
    private trackingService = inject(TrackingService);

    @HostListener('click', ['$event']) onClick(event: Event) {
        if (this.trackingEvent) {
            this.trackingService.triggerEvent(this.trackingEvent, this.trackingData);
        }
        this.processClick(event);
    }

    abstract processClick(event: Event): void;

    ngOnInit() {
        const element = this.elementRef.nativeElement;

        if (this.elementRef.nativeElement.originalHtmlString) {
            element.innerHTML = this.elementRef.nativeElement.originalHtmlString;
        }

        this.trackingEvent = this.anchorTrackingHelperService.getTrackingEventName(element);

        if (this.trackingEvent) {
            this.trackingData = this.anchorTrackingHelperService.createTrackingData(element);
        }
    }
}
