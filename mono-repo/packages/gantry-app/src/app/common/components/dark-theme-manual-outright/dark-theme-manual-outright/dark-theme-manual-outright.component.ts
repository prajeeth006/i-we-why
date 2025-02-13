import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { Subscription, interval } from 'rxjs';

import { SelectionNameLength } from '../../../models/general-codes-model';
import { GameType, ManualOutRightResult } from '../../../models/manual-outright.module';
import { PaginationContent } from '../../../models/pagination/pagination.models';
import { PaginationService } from '../../../services/pagination.service';

@Component({
    selector: 'gn-dark-theme-manual-outright',
    templateUrl: './dark-theme-manual-outright.component.html',
    styleUrls: ['./dark-theme-manual-outright.component.scss'],
})
export class DarkThemeManualOutrightComponent implements AfterViewInit, OnDestroy, OnChanges, OnInit {
    @Input() result: ManualOutRightResult;
    @Input() pageSize: number;
    @Input() selectionLength: number | string;
    isInitialised = false;
    pageRefreshTime = 30000;
    pageDetails: PaginationContent = new PaginationContent();
    mySubscription: Subscription;
    mainClassWrapper: string;
    sportsTypeImage: string;
    unrestrictedNameLength = SelectionNameLength.Unrestricted;

    constructor(
        private paginationService: PaginationService,
        private cd: ChangeDetectorRef,
    ) {
        this.mySubscription = interval(this.pageRefreshTime).subscribe(() => {
            this.paginationSetup(this.result);
        });
    }

    ngOnChanges(): void {
        this.paginationService.darkThemeCalculateTotalPages(this.pageDetails, this.result?.Runners.length);
        this.checkSelectionsLength(this.result);
        this.cd.detectChanges();
        if (!this.isInitialised) {
            this.pageDetails.pageSize = this.pageSize;
        }
    }

    ngAfterViewInit(): void {
        this.isInitialised = true;
        this.paginationSetup(this.result);
    }

    paginationSetup(resultContent: ManualOutRightResult) {
        this.paginationService.darkThemePaginationSetup(this.pageDetails, resultContent?.Runners.length);
        this.cd.detectChanges();
    }

    ngOnDestroy() {
        this.mySubscription.unsubscribe();
    }

    ngOnInit(): void {
        this.sportsTypeImage = this.getSportsTypeImage(this.result);
        this.checkSelectionsLength(this.result);
    }

    checkSelectionsLength(resultContent: ManualOutRightResult) {
        if (resultContent?.Runners?.length > 0 && resultContent?.Runners?.length <= 6) {
            return (this.mainClassWrapper = 'manual-outright-small-content');
        } else if (resultContent?.Runners?.length > 6 && resultContent?.Runners?.length <= 8) {
            return (this.mainClassWrapper = 'manual-outright-medium-content');
        } else if (resultContent?.Runners?.length > 8 && resultContent?.Runners?.length <= 12) {
            return (this.mainClassWrapper = 'manual-outright-large-content common-ouright-wrapper');
        } else if (resultContent?.Runners?.length > 12 && resultContent?.Runners?.length <= 16) {
            return (this.mainClassWrapper = 'manual-outright-extralarge-content common-ouright-wrapper');
        } else if (resultContent?.Runners?.length > 16) {
            return (this.mainClassWrapper = 'manual-outright-pagination-content common-ouright-wrapper');
        } else {
            return (this.mainClassWrapper = 'manual-outright-small-content');
        }
    }

    getSportsTypeImage(resultContent: ManualOutRightResult): string {
        let image = '';
        const sportsType = resultContent?.outRightTitle?.toLowerCase().trim();
        switch (sportsType) {
            case GameType.horses:
                image = resultContent?.imageContent?.horseRacingImage?.src || '';
                break;
            case GameType.greyhounds:
                image = resultContent?.imageContent?.greyHoundRacingImage?.src || '';
                break;
            case GameType.boxing:
                image = resultContent?.imageContent?.boxingImage?.src || '';
                break;
            case GameType.cricketODI:
                image = resultContent?.imageContent?.cricketWhiteImage?.src || '';
                break;
            case GameType.cricketTest:
                image = resultContent?.imageContent?.cricketRedImage?.src || '';
                break;
            case GameType.darts:
                image = resultContent?.imageContent?.dartsImage?.src || '';
                break;
            case GameType.football:
                image = resultContent?.imageContent?.footballImage?.src || '';
                break;
            case GameType.golf:
                image = resultContent?.imageContent?.golfImage?.src || '';
                break;
            case GameType.formula1:
                image = resultContent?.imageContent?.formulaRacingImage?.src || '';
                break;
            case GameType.nfl:
                image = resultContent?.imageContent?.nflImage?.src || '';
                break;
            case GameType.rugbyLeague:
                image = resultContent?.imageContent?.rugbyLeagueImage?.src || '';
                break;
            case GameType.rugbyUnion:
                image = resultContent?.imageContent?.rugbyUnionImage?.src || '';
                break;
            case GameType.snooker:
                image = resultContent?.imageContent?.snookerImage?.src || '';
                break;
            case GameType.tennis:
                image = resultContent?.imageContent?.tennisImage?.src || '';
                break;
            case GameType.specials:
                image = resultContent?.imageContent?.specialsImage?.src || '';
                break;
            case GameType.politics:
                image = resultContent?.imageContent?.politicsImage?.src || '';
                break;
            case GameType.olympics:
                image = resultContent?.imageContent?.olympicsImage?.src || '';
                break;
            case GameType.cycling:
                image = resultContent?.imageContent?.cyclingImage?.src || '';
                break;
            case GameType.entertainment:
                image = resultContent?.imageContent?.entertainmentImage?.src || '';
                break;
            default:
                image = resultContent?.imageContent?.footballImage?.src || '';
        }
        return image;
    }
}
