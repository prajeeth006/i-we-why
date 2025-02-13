import { AnimationEvent, animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

import { EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ScreenTypeService } from '../../../../../common/services/screen-type.service';
import { ManualHorseRacingEntry } from '../../../../models/horse-racing-manual-template.model';
import { DarkThemeManualHorseRacingTemplateService } from '../services/dark-theme-manual-horse-racing-template.service';

@Component({
    selector: 'gn-dark-manual-runners',
    templateUrl: './dark-theme-manual-runners.component.html',
    styleUrls: ['./dark-theme-manual-runners.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('autoScroll', [
            state(
                'top',
                style({
                    transform: 'translateY(0px)',
                }),
            ),
            state(
                'init',
                style({
                    transform: 'translateY(0px)',
                }),
            ),
            state(
                'step',
                style({
                    transform: 'translateY({{nextPosition}}px)',
                }),
                { params: { nextPosition: 0 } },
            ),
            state(
                'update',
                style({
                    transform: 'translateY({{nextPosition}}px)',
                }),
                { params: { nextPosition: 0 } },
            ),
            transition('top => init', animate('0s 2s linear')),
            transition('init => step', animate('500ms 0s linear')),
            transition('step => update', animate('0s 0s linear')),
            transition('update => step', animate('500ms 2s linear')),
        ]),
    ],
})
export class DarkThemeManualRunnersComponent implements AfterViewInit {
    @ViewChild('scrollItem') scrollItem: ElementRef;
    horseRacingFixedRunnersResult: Array<ManualHorseRacingEntry> = [];
    horseRacingAutoScrollRunnersResult: Array<ManualHorseRacingEntry> = [];
    horseRacingAutoScrollRunners: Array<ManualHorseRacingEntry> = [];

    presentStartIndex = 0;
    maxFixedRunners: number = 5;
    maxViewRunners: number = 8;

    totalRunners: number = 0;
    scrollAtTop = false;
    animationState: string = 'top';
    nextPosition = 0;
    isHalfScreenType = false;

    vm$ = this.manualHorseRacingTemplateService.data$.pipe(
        map((result) => {
            if (!this.isHalfScreenType) {
                this.getMaxRunners(result, 'NewAutoScrollFixedItems', 'NewAutoScrollMaxViewRunners');
            } else {
                this.getMaxRunners(result, 'NewEnhancedAutoScrollFixedItems', 'NewEnhancedAutoScrollMaxViewRunners');
            }
            this.totalRunners = result?.manualHorseRacingRunners?.horseRacingEntries?.length;
            if (this.totalRunners <= this.maxViewRunners) {
                this.maxFixedRunners = this.totalRunners;
            }
            this.horseRacingAutoScrollRunnersResult = [];
            this.horseRacingFixedRunnersResult = result?.manualHorseRacingRunners?.horseRacingEntries?.slice(0, this.maxFixedRunners);
            this.horseRacingAutoScrollRunnersResult = result?.manualHorseRacingRunners?.horseRacingEntries?.slice(this.maxFixedRunners);
            return result?.manualHorseRacingRunners;
        }),
        catchError(() => {
            return EMPTY;
        }),
    );

    private getMaxRunners(result: any, fixedItemsKey: string, maxViewRunnersKey: string): void {
        if (
            result?.manualHorseRacingRunners?.horseRacingContent?.contentParameters &&
            result?.manualHorseRacingRunners?.horseRacingContent?.contentParameters[fixedItemsKey]
        ) {
            const maxFixedRunners = parseInt(result?.manualHorseRacingRunners?.horseRacingContent?.contentParameters[fixedItemsKey]);
            this.maxFixedRunners = isNaN(maxFixedRunners) ? this.maxFixedRunners : maxFixedRunners;
        }
        if (
            result?.manualHorseRacingRunners?.horseRacingContent?.contentParameters &&
            result?.manualHorseRacingRunners?.horseRacingContent?.contentParameters[maxViewRunnersKey]
        ) {
            const maxViewRunners = parseInt(result?.manualHorseRacingRunners?.horseRacingContent?.contentParameters[maxViewRunnersKey]);
            this.maxViewRunners = isNaN(maxViewRunners) ? this.maxViewRunners : maxViewRunners;
        }
    }

    constructor(
        private manualHorseRacingTemplateService: DarkThemeManualHorseRacingTemplateService,
        private screenTypeService: ScreenTypeService,
    ) {}

    ngAfterViewInit() {
        this.isHalfScreenType = this.screenTypeService?.isHalfScreenType;
    }

    onEnd(event: AnimationEvent) {
        if (isNaN(this.nextPosition)) this.nextPosition = 0;

        if (event.toState === 'top') {
            this.calculateNext();
            this.animationState = 'init';
        } else if (event.toState === 'init') {
            this.nextPosition -= isNaN(this.scrollItem?.nativeElement?.offsetHeight) ? 0 : this.scrollItem?.nativeElement?.offsetHeight;
            this.animationState = 'step';
        } else if (event.toState === 'step') {
            this.nextPosition += isNaN(this.scrollItem?.nativeElement?.offsetHeight) ? 0 : this.scrollItem?.nativeElement?.offsetHeight;
            this.calculateNext();
            this.animationState = 'update';
        } else if (event.toState === 'update') {
            this.nextPosition -= isNaN(this.scrollItem?.nativeElement?.offsetHeight) ? 0 : this.scrollItem?.nativeElement?.offsetHeight;
            this.animationState = 'step';
        }
    }

    calculateNext() {
        this.horseRacingAutoScrollRunners = [];
        if (this.horseRacingAutoScrollRunnersResult.length > 0) {
            const autoScrollItems = [...this.horseRacingAutoScrollRunnersResult];
            if (this.presentStartIndex > autoScrollItems.length - 1) {
                this.presentStartIndex = 0;
            }

            const tempRunners = autoScrollItems.slice(this.presentStartIndex, autoScrollItems.length);
            if (this.presentStartIndex != 0) {
                this.horseRacingAutoScrollRunners = [...tempRunners, ...autoScrollItems.slice(0, this.presentStartIndex)];
            } else {
                this.horseRacingAutoScrollRunners = tempRunners;
            }
            this.presentStartIndex = (this.presentStartIndex + 1) % autoScrollItems.length;
        }
    }
}
