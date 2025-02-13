import { Injectable } from '@angular/core';

import { ViewTemplate } from '@frontend/vanilla/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Model for {@link TooltipsService}.
 *
 * @stable
 */
export interface Tooltips {
    [type: string]: Tooltip;
}

/**
 * Model for {@link Tooltip}.
 *
 * @stable
 */
export interface Tooltip {
    isActive: boolean;
    name: string;
    text: string | undefined;
}

/**
 * @whatItDoes Provides functionality for the {@link TooltipsComponent} for initializing; switching and closing the tooltips.
 *
 * @howToUse
 *
 * ```
 * tooltipsService.setTooltips(tooltipTemplates, elementTypes) // the tooltipTemplates is reference to a SiteCore item in 'App-v1.0/Tooltips/Onboarding' or 'App-v1.0/Tooltips/Tutorial'.
 * tooltipsService.getTooltip(currentItem)
 * tooltipsService.nextTooltip(currentItem)
 * tooltipsService.previousTooltip(currentItem)
 * tooltipsService.hasNext(currentItem)
 * tooltipsService.hasPrevious(currentItem)
 * tooltipsService.closeTooltip()
 * ```
 *
 * @description
 *
 *
 * @stable
 */
@Injectable({ providedIn: 'root' })
export class TooltipsService {
    readonly activeTooltip = new BehaviorSubject<Tooltip | null>(null);

    private tooltips: Tooltips = {};
    private tooltipNames: string[] = [];

    addTooltip(item: string, tooltipTemplates: { [type: string]: ViewTemplate }) {
        if (item && !this.tooltips[item] && tooltipTemplates[item]) {
            this.tooltips[item] = {
                isActive: false,
                name: item,
                text: tooltipTemplates[item].text,
            };
            this.tooltipNames.push(item);
        }
    }

    getTooltip(currentItem: string): Tooltip | undefined {
        return this.tooltips[currentItem];
    }

    nextTooltip(currentItem: string) {
        const tooltip = this.tooltips[this.tooltipNames[this.tooltipNames.indexOf(currentItem) + 1]!];

        if (tooltip) {
            this.showTooltip(tooltip);
        }
    }

    previousTooltip(currentItem: string) {
        const tooltipName = this.tooltipNames[this.tooltipNames.indexOf(currentItem) - 1];

        if (tooltipName) {
            this.showTooltip(this.tooltips[tooltipName]);
        }
    }

    hasNext(currentItem: string): boolean {
        const tooltipName = this.tooltipNames[this.tooltipNames.indexOf(currentItem) + 1];

        return !!(tooltipName && this.tooltips[tooltipName]);
    }

    hasPrevious(currentItem: string): boolean {
        const tooltipName = this.tooltipNames[this.tooltipNames.indexOf(currentItem) - 1];

        return !!(tooltipName && this.tooltips[tooltipName]);
    }

    removeTooltip(name?: string) {
        if (name && this.tooltips[name]) {
            delete this.tooltips[name];
            this.tooltipNames.splice(this.tooltipNames.indexOf(name), 1);
        }
    }

    closeTooltip() {
        this.clearTooltips();
        this.activeTooltip.next(null);
    }

    show() {
        const tooltipName = this.tooltipNames[0];

        if (tooltipName) {
            this.showTooltip(this.tooltips[tooltipName]);
        }
    }

    private showTooltip(tooltip?: Tooltip) {
        if (tooltip) {
            this.clearTooltips();
            tooltip.isActive = true;
            this.activeTooltip.next(tooltip);
        }
    }

    private clearTooltips = () => this.tooltipNames.forEach((name: string) => (this.tooltips[name]!.isActive = false));
}
