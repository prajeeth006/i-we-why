import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { Subscription, interval } from 'rxjs';

import { PaginationContent } from '../../../common/models/pagination/pagination.models';
import { PaginationService } from '../../../common/services/pagination.service';
import { GameType, OutRightCdsContent } from '../../outright/models/outright-cds.model';

@Component({
    selector: 'gn-dark-theme-outright-market',
    templateUrl: './dark-theme-outright-market.component.html',
    styleUrl: './dark-theme-outright-market.component.scss',
})
export class DarkThemeOutrightMarketComponent implements AfterViewInit, OnDestroy, OnChanges, OnInit {
    @Input() selectionLength: number;
    @Input() pageSize: number;
    @Input() result: OutRightCdsContent;
    pageDetails: PaginationContent = new PaginationContent();
    isInitialised = false;
    pageRefreshTime = 30000;
    mySubscription: Subscription;
    mainClassWrapper: string;
    sportsTypeImage: string;

    constructor(
        private paginationService: PaginationService,
        private cd: ChangeDetectorRef,
    ) {
        this.mySubscription = interval(this.pageRefreshTime).subscribe(() => {
            this.paginationSetup(this.result);
        });
    }

    ngOnChanges(): void {
        this.paginationService.darkThemeCalculateTotalPages(this.pageDetails, this.result?.finalResult?.selections?.length);
        this.cd.detectChanges();
        if (!this.isInitialised) {
            this.pageDetails.pageSize = this.pageSize;
        }
    }

    ngAfterViewInit(): void {
        this.isInitialised = true;
        this.paginationSetup(this.result);
    }

    paginationSetup(resultContent: OutRightCdsContent) {
        this.paginationService.darkThemePaginationSetup(this.pageDetails, resultContent?.finalResult?.selections?.length);
        this.cd.detectChanges();
    }

    ngOnDestroy() {
        this.mySubscription.unsubscribe();
    }

    ngOnInit(): void {
        this.sportsTypeImage = this.getSportsTypeImage(this.result);
        this.checkSelectionsLength(this.result);
    }

    checkSelectionsLength(resultContent: OutRightCdsContent) {
        if (resultContent?.finalResult?.selections?.length > 0 && resultContent?.finalResult?.selections?.length <= 6) {
            return (this.mainClassWrapper = 'ante-post-small-content');
        } else if (resultContent?.finalResult?.selections?.length > 6 && resultContent?.finalResult?.selections?.length <= 8) {
            return (this.mainClassWrapper = 'ante-post-medium-content');
        } else if (resultContent?.finalResult?.selections?.length > 8 && resultContent?.finalResult?.selections?.length <= 12) {
            return (this.mainClassWrapper = 'ante-post-large-content common-ouright-wrapper');
        } else if (resultContent?.finalResult?.selections?.length > 12 && resultContent?.finalResult?.selections?.length <= 16) {
            return (this.mainClassWrapper = 'ante-post-extralarge-content common-ouright-wrapper');
        } else if (resultContent?.finalResult?.selections?.length > 16) {
            return (this.mainClassWrapper = 'ante-post-pagination-content common-ouright-wrapper');
        } else {
            return (this.mainClassWrapper = 'ante-post-small-content');
        }
    }

    getSportsTypeImage(resultContent: OutRightCdsContent): string {
        let image = '';
        const sportsType = resultContent?.sportName?.toLowerCase().trim();

        switch (sportsType) {
            case GameType.boxing:
                image = resultContent?.content?.boxingImage?.src || '';
                break;
            case GameType.cricket:
                image = resultContent?.content?.cricketWhiteImage?.src || '';
                break;
            case GameType.darts:
                image = resultContent?.content?.dartsImage?.src || '';
                break;
            case GameType.football:
                image = resultContent?.content?.footballImage?.src || '';
                break;
            case GameType.formulaRacing:
                image = resultContent?.content?.formulaRacingImage?.src || '';
                break;
            case GameType.golf:
                image = resultContent?.content?.golfImage?.src || '';
                break;
            case GameType.nfl:
                image = resultContent?.content?.nflImage?.src || '';
                break;
            case GameType.rugbyleague:
                image = resultContent?.content?.rugbyLeagueImage?.src || '';
                break;
            case GameType.rugbyunion:
                image = resultContent?.content?.rugbyUnionImage?.src || '';
                break;
            case GameType.tennis:
                image = resultContent?.content?.tennisImage?.src || '';
                break;
            case GameType.snooker:
                image = resultContent?.content?.snookerImage?.src || '';
                break;
        }
        return image;
    }
}
