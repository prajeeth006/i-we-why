import { NgIf, NgTemplateOutlet } from '@angular/common';
import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    ContentChildren,
    ElementRef,
    Input,
    OnInit,
    QueryList,
    TemplateRef,
    ViewChild,
} from '@angular/core';

import { fromEvent } from 'rxjs';

import { DsScrollerItem } from './scroller-item.directive';

@Component({
    selector: 'ds-scroller',
    exportAs: 'dsScroller',
    standalone: true,
    template: `
        <!-- eslint-disable-next-line @angular-eslint/template/no-inline-styles -->
        <div
            #scrollContainer
            class="ds-scroll-container"
            [style.gap.px]="gap"
            [class.ds-scroll-container-overflow-y]="direction === 'y'"
            [class.ds-scroll-container-overflow-x]="direction === 'x'"
            [class.ds-scroll-container-mandatory]="snapType === 'mandatory'"
            [class.ds-scroll-container-proximity]="snapType === 'proximity'"
            [class.ds-hide-scrollbar]="showArrows">
            <ng-content />

            @if (showArrows) {
                @if (showLeftArrow) {
                    <div (click)="scrollLeft()" (keyup)="scrollLeft()" tabindex="0">
                        <ng-container *ngTemplateOutlet="leftArrowTpl || defaultLeftArrowTpl" />
                    </div>
                }
                @if (showRightArrow) {
                    <div (click)="scrollRight()" (keyup)="scrollRight()" tabindex="0">
                        <ng-container *ngTemplateOutlet="rightArrowTpl || defaultRightArrowTpl" />
                    </div>
                }
            }
        </div>

        <ng-template #defaultLeftArrowTpl><span>◀</span></ng-template>
        <ng-template #defaultRightArrowTpl><span>▶</span></ng-template>
    `,
    styleUrls: ['scroller.component.scss'],
    imports: [NgIf, NgTemplateOutlet],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsScroller implements OnInit, AfterContentInit {
    @ContentChild('rightArrow') rightArrowTpl?: TemplateRef<any>;
    @ContentChild('leftArrowTpl') leftArrowTpl?: TemplateRef<any>;

    @ViewChild('scrollContainer', { static: true, read: ElementRef }) scrollContainerEl?: ElementRef<HTMLDivElement>;

    @ContentChildren(DsScrollerItem) contentScrollItems!: QueryList<DsScrollerItem>;

    @Input({
        // eslint-disable-next-line @angular-eslint/no-input-rename
        transform: (d: 'vertical' | 'horizontal') => (d === 'vertical' ? 'y' : 'x'),
    })
    direction: 'x' | 'y' = 'x';

    @Input() snapType: 'mandatory' | 'proximity' = 'proximity';

    @Input() gap = 5;

    @Input() showArrows = false;

    showLeftArrow = false;
    showRightArrow = false;

    ngAfterContentInit() {
        // scroll to active by default after the content has been initialized
        this.scrollToActive();
    }

    ngOnInit() {
        if (this.scrollContainerEl?.nativeElement) {
            // TODO: this should be done outside zone
            fromEvent(this.scrollContainerEl.nativeElement, 'scroll').subscribe((e) => {
                const { offsetWidth, scrollWidth } = e.target as HTMLDivElement;
                if (offsetWidth === scrollWidth) {
                    this.showRightArrow = false;
                    this.showLeftArrow = false;
                }
            });
        }
    }

    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    scrollLeft() {}

    // eslint-disable-next-line @typescript-eslint/class-methods-use-this
    scrollRight() {}

    scrollToActive() {
        const activeItem = this.contentScrollItems.toArray().find((x) => x.active);
        activeItem?.elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}
