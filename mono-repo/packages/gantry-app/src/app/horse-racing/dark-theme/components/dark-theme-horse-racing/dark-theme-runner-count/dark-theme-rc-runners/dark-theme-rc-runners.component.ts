import { AnimationEvent, animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

import { DarkThemeMarketStatus, PriceType, SelectionSuspended } from 'packages/gantry-app/src/app/common/models/general-codes-model';
import { EMPTY, catchError, map } from 'rxjs';

import { ScreenType } from '../../../../../../common/models/screen-size.model';
import { EvrAvrConfigurationService } from '../../../../../../common/services/evr-avr-configuration.service';
import { RouteDataService } from '../../../../../../common/services/route-data.service';
import { HorseRacingEntry, HorseRacingRunnersResult, SplitScreenQueryParams } from '../../../../../models/horse-racing-template.model';
import { DarkThemeHorseRacingService } from '../../services/dark-theme-horse-racing.service';
import { DarkThemeRcRunnersService } from './services/dark-theme-rc-runners.service';

@Component({
    selector: 'gn-dark-theme-rc-runners',
    templateUrl: './dark-theme-rc-runners.component.html',
    styleUrl: './dark-theme-rc-runners.component.scss',
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
export class DarkThemeRCRunnersComponent {
    @ViewChild('scrollItem') scrollItem: ElementRef;
    horseRacingFixedRunnersResult: Array<HorseRacingEntry> = [];
    horseRacingAutoScrollRunnersResult: Array<HorseRacingEntry> = [];
    horseRacingAutoScrollRunners: Array<HorseRacingEntry> = [];

    presentStartIndex = 0;

    animationState: string = 'top';
    nextPosition = 0;
    selectionAndPrice = SelectionSuspended.selectionAndPrice;
    isNonAvrVirtualRace?: boolean = false;
    marketStatus = DarkThemeMarketStatus.Suspended;
    priceTypes = PriceType;
    isRCEnabled = false;
    isScrollingEnabled = false;
    rcClass: string;
    isHalfScreen = false;
    isVirtualRaceFlag = false;
    // Scrolling Assets vars
    isRacingPostVerdictCountries = false;
    showBackPricePill = true;
    showPostPickInBody = true;
    diomedSelectionName: string | undefined = '';
    isDiomedPresent: boolean = false;
    splitScreenParams: SplitScreenQueryParams;
    runnerTemplateConfig: any;

    vm$ = this.darkThemeHorseRacingService.data$.pipe(
        map((result) => {
            if (result?.horseRacingRunnersResult) {
                result.horseRacingRunnersResult.horseRacingEntries = this.darkThemeRcRunnersService?.removeSuspendedAndHiddenEntries(
                    result?.horseRacingRunnersResult?.horseRacingEntries,
                );
                this.updateIsNonAvrVirtulaRace(result?.horseRacingRunnersResult);
            }

            this.isDiomedPresent = this.darkThemeHorseRacingService?.isDiomedPresent;
            this.darkThemeRcRunnersService.isDiomedPresent = this.isDiomedPresent;
            const fixedAndScrollRunners = this.darkThemeRcRunnersService?.prepareFixedAndScrollRunners(result?.horseRacingRunnersResult);

            this.horseRacingFixedRunnersResult = fixedAndScrollRunners?.horseRacingFixedRunnersResult;
            this.horseRacingAutoScrollRunnersResult = fixedAndScrollRunners?.horseRacingAutoScrollRunnersResult;

            this.handlePostPickAndBackPill(result?.horseRacingRunnersResult);
            this.isRCEnabled = this.darkThemeRcRunnersService?.isRCEnabled;
            this.isScrollingEnabled = this.darkThemeRcRunnersService?.isScrollingEnabled;
            this.rcClass = this.darkThemeRcRunnersService?.rcClass;
            this.diomedSelectionName = this.darkThemeHorseRacingService?.diomedSelectionName;
            return result.horseRacingRunnersResult;
        }),
        catchError((err: any) => {
            console.log(err);
            return EMPTY;
        }),
    );

    screenType: string;

    constructor(
        private darkThemeHorseRacingService: DarkThemeHorseRacingService,
        private routeDataService: RouteDataService,
        public evrAvrService: EvrAvrConfigurationService,
        public darkThemeRcRunnersService: DarkThemeRcRunnersService,
    ) {
        const queryParams = this.routeDataService.getQueryParams();
        const screenType = queryParams['screenType'];
        this.screenType = screenType;
        this.isHalfScreen = this.screenType?.toLowerCase() === ScreenType.half;

        this.darkThemeRcRunnersService.enableRacingAssetTypeFalg(queryParams);
        this.isRacingPostVerdictCountries = this.darkThemeHorseRacingService?.isRacingPostVerdictCountries;
        this.darkThemeRcRunnersService.isRacingPostVerdictCountries = this.isRacingPostVerdictCountries;
        this.isVirtualRaceFlag = this.darkThemeHorseRacingService?.isVirtualRaceFlag;
    }

    handlePostPickAndBackPill(horseRacingRunnersResult: HorseRacingRunnersResult) {
        if (!this.darkThemeRcRunnersService.isQuadSplittingEnabled && !this.darkThemeRcRunnersService.isHalfSplittingEnabled) {
            const runnersLength: number = horseRacingRunnersResult?.horseRacingEntries?.length;
            this.showBackPricePill = true;
            if (!this.isHalfScreen) {
                //full,quad
                this.showPostPickInBody = true;

                if (
                    this.darkThemeRcRunnersService?.isRCEnabled &&
                    runnersLength > 10 &&
                    runnersLength <= 20 &&
                    !horseRacingRunnersResult?.arePlus1MarketPricesPresent
                ) {
                    this.showBackPricePill = false;
                    this.showPostPickInBody = false;
                }
            }
        }
    }

    updateIsNonAvrVirtulaRace(horseRacingRunnersResult: HorseRacingRunnersResult) {
        if (
            !horseRacingRunnersResult?.isVirtualEvent ||
            horseRacingRunnersResult?.isAvrRace ||
            horseRacingRunnersResult?.isAvrRace === null ||
            this.screenType?.toLocaleLowerCase()
        ) {
            this.isNonAvrVirtualRace = false;
        } else {
            this.isNonAvrVirtualRace = true;
        }
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
        if (this.horseRacingAutoScrollRunnersResult?.length > 0) {
            const autoScrollItems = [...this.horseRacingAutoScrollRunnersResult];
            if (this.presentStartIndex > autoScrollItems?.length - 1) {
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
