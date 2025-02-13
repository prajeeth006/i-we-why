import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';

import { EventsService, SimpleEvent, VanillaEventNames } from '@frontend/vanilla/core';
import { MenuItemComponent } from '@frontend/vanilla/features/menus';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { HeaderItemBase } from '../header-item-base';

@Component({
    standalone: true,
    imports: [CommonModule, MenuItemComponent],
    selector: 'vn-h-icon',
    templateUrl: 'icon.html',
})
export class IconComponent extends HeaderItemBase implements AfterViewInit, OnDestroy {
    private unsubscribe = new Subject();
    constructor(
        private eventsService: EventsService,
        private elementRef: ElementRef,
    ) {
        super();
    }

    ngAfterViewInit(): void {
        this.eventsService.allEvents
            .pipe(
                takeUntil(this.unsubscribe),
                filter((e: SimpleEvent) => e?.eventName === VanillaEventNames.TriggerAnimation),
            )
            .subscribe(() => {
                const imageDiv = this.elementRef.nativeElement.getElementsByClassName('image-icon');
                imageDiv[0]?.classList.add('image-icon--animate');
            });
    }

    ngOnDestroy() {
        this.unsubscribe.next(null);
        this.unsubscribe.complete();
    }
}
