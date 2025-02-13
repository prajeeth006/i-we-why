import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CommonMessages, DynamicHtmlDirective, ViewTemplate } from '@frontend/vanilla/core';
import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { delay } from 'rxjs/operators';

import { TooltipsService } from './tooltips.service';

/**
 * @whatItDoes Shows a box with a text description similar to {@link PopperContentComponent}
 *
 * @howToUse
 *
 * ```
 * <vn-tooltips [tooltips]="tooltipsConfig.onboardings | tooltipsConfig.tutorials" [types]="balanceTypes" [index]="currentIndex" />
 * ```
 *
 * @description
 *
 * Renders a single (onboarding) message or a collection of messages (tutorial with previous/next functionality)
 *
 * @stable
 */
@Component({
    standalone: true,
    imports: [CommonModule, DynamicHtmlDirective, IconCustomComponent],
    selector: 'vn-tooltips',
    templateUrl: 'tooltips.html',
    styles: [
        `
            .float-ui-container {
                display: block;
                opacity: 1;
                border: 0;
            }

            .tooltips-nav {
                float: right;
                font-weight: bold;
            }

            .ui-close {
                float: right;
                font-weight: bold;
            }

            .tooltips-nav > span {
                margin-left: 15px;
                cursor: pointer;
            }
        `,
    ],
})
export class TooltipsComponent implements OnInit {
    @Input() itemName: string;
    @Input() tooltipItem: string;
    @Input() tooltips: { [type: string]: ViewTemplate };
    @Output() onNextClick = new EventEmitter<void>();
    @Output() onPreviousClick = new EventEmitter<void>();

    constructor(
        public tooltipsService: TooltipsService,
        public commonMessages: CommonMessages,
        private element: ElementRef,
    ) {}

    ngOnInit() {
        if (this.tooltips && this.tooltipItem) {
            this.tooltipsService.addTooltip(this.tooltipItem, this.tooltips);

            // Element have to be visible in order to scroll to
            this.tooltipsService.activeTooltip.pipe(delay(0)).subscribe(() => {
                const element = this.element?.nativeElement;

                if (!element) {
                    return;
                }

                // Account for the highlighted element & tooltip height
                const top = element.offsetParent?.offsetTop + element.offsetHeight;

                if (!isNaN(top)) {
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            });
        }
    }

    next(itemName: string) {
        this.tooltipsService.nextTooltip(itemName);
        this.onNextClick.next();
    }

    previous(itemName: string) {
        this.tooltipsService.previousTooltip(itemName);
        this.onPreviousClick.next();
    }
}
