import { Directive, ElementRef, OnInit, inject } from '@angular/core';

import { TrackingService } from '../tracking/tracking-core.service';
import { AnchorTrackingHelperService } from './anchor-tracking-helper-service';

@Directive({ standalone: true, host: { '(click)': 'onClick()' } })
export class LinkBehaviorDirective implements OnInit {
    private anchorTrackingHelperService = inject(AnchorTrackingHelperService);
    private elementRef = inject(ElementRef<HTMLAnchorElement>);
    private trackingEvent: string | null;
    private trackingData: { [prop: string]: string } = {};
    private trackingService = inject(TrackingService);

    onClick() {
        if (this.trackingEvent) {
            this.trackingService.triggerEvent(this.trackingEvent, this.trackingData);
        }
    }

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
