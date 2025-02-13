import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

import { ScreenTypeService } from 'packages/gantry-app/src/app/common/services/screen-type.service';
import { AssetType } from 'packages/gantry-app/src/app/horse-racing/models/common.model';
import { SplitScreenPage, SplitScreenRunner } from 'packages/gantry-app/src/app/horse-racing/models/horse-racing-manual-template.model';
import {
    HorseRacingEntry,
    HorseRacingRunnersResult,
    MaxFixedViewrRunner,
    RangeObject,
    SplitScreenQueryParams,
} from 'packages/gantry-app/src/app/horse-racing/models/horse-racing-template.model';

@Injectable({
    providedIn: 'root',
})
export class DarkThemeRcRunnersService {
    totalRunners: number = 0;
    isRCEnabled = false;
    isScrollingEnabled = false;
    isHalfSplittingEnabled = false;
    isQuadSplittingEnabled = false;
    splitScreenParams: SplitScreenQueryParams;
    rcClass: string;
    isRacingPostVerdictCountries = false;
    isDiomedPresent: boolean = false;
    runnerTemplateConfig: any;
    maxRunner: MaxFixedViewrRunner = new MaxFixedViewrRunner();

    getMaxRunners(fixedKey: string, viewKey: string, defaultFixed: number, defaultView: number, horseRacingRunnersResult: HorseRacingRunnersResult) {
        const maxFixedRunners = horseRacingRunnersResult?.horseRacingContent?.contentParameters?.[fixedKey]
            ? parseInt(horseRacingRunnersResult?.horseRacingContent?.contentParameters?.[fixedKey])
            : defaultFixed;
        const maxViewRunners = horseRacingRunnersResult?.horseRacingContent?.contentParameters?.[viewKey]
            ? parseInt(horseRacingRunnersResult?.horseRacingContent?.contentParameters?.[viewKey])
            : defaultView;
        this.maxRunner.maxFixedRunners = isNaN(maxFixedRunners) ? defaultFixed : maxFixedRunners;
        this.maxRunner.maxViewRunners = isNaN(maxViewRunners) ? defaultView : maxViewRunners;
    }

    prepareFixedAndScrollRunners(horseRacingRunnersResult: HorseRacingRunnersResult) {
        let horseRacingFixedRunnersResult: Array<HorseRacingEntry> = [];
        let horseRacingAutoScrollRunnersResult: Array<HorseRacingEntry> = [];

        this.totalRunners = horseRacingRunnersResult?.horseRacingEntries?.length;

        if (this.isQuadSplittingEnabled || this.isHalfSplittingEnabled) {
            this.maxRunner = this.prepareSplitScreenMaxFixedViewRunner(horseRacingRunnersResult);
            const startPageIndex = parseInt(this.splitScreenParams.startPageIndex) - 1;
            horseRacingFixedRunnersResult = horseRacingRunnersResult.horseRacingEntries.slice(startPageIndex, this.maxRunner.maxFixedRunners);
            if (this.isHalfSplittingEnabled) {
                this.runnerTemplateConfig = horseRacingRunnersResult?.splitScreenRunnerConfig?.half;
                if (
                    this.totalRunners > this.runnerTemplateConfig?.options?.splitScreenTemplatesScrollEnableAt &&
                    this.splitScreenParams?.currentPage == this.runnerTemplateConfig?.options?.splitScreenTemplatesMaxPages?.toString()
                ) {
                    const endPageIndex = startPageIndex + this.runnerTemplateConfig?.options?.splitScreenTemplateFixedSelections;
                    horseRacingFixedRunnersResult = horseRacingRunnersResult?.horseRacingEntries?.slice(startPageIndex, endPageIndex);
                    horseRacingAutoScrollRunnersResult = horseRacingRunnersResult?.horseRacingEntries?.slice(endPageIndex);
                }
            }
        } else {
            this.maxRunner = this.maxFixedViewRunner(horseRacingRunnersResult);
            if (this.totalRunners <= this.maxRunner.maxViewRunners) {
                this.maxRunner.maxFixedRunners = this.totalRunners;
            }
            horseRacingFixedRunnersResult = horseRacingRunnersResult?.horseRacingEntries.slice(0, this.maxRunner.maxFixedRunners);
            horseRacingAutoScrollRunnersResult = horseRacingRunnersResult?.horseRacingEntries.slice(this.maxRunner.maxFixedRunners);
        }

        return { horseRacingFixedRunnersResult, horseRacingAutoScrollRunnersResult };
    }

    constructor(private screenTypeService: ScreenTypeService) {}

    enableRacingAssetTypeFalg(queryParams: Params) {
        const racingAssetType = queryParams['racingAssetType'];
        switch (racingAssetType?.toLowerCase()) {
            case AssetType.runnercount:
                this.isRCEnabled = true;
                break;
            case AssetType.scrolling:
                this.isScrollingEnabled = true;
                break;
            case AssetType.halfScreensplitting:
                this.getSplitScreenDetails(queryParams);
                this.isHalfSplittingEnabled = true;
                break;
            case AssetType.quadScreensplitting:
                this.getSplitScreenDetails(queryParams);
                this.isQuadSplittingEnabled = true;
                break;
        }
    }

    getSplitScreenDetails(queryParams: Params) {
        this.splitScreenParams = {
            startPageIndex: queryParams['startPageIndex'],
            endPageIndex: queryParams['endPageIndex'],
            maxRunnerCount: queryParams['maxRunnerCount'],
            totalPages: queryParams['totalPages'],
            currentPage: queryParams['currentPage'],
        } as SplitScreenQueryParams;
    }

    removeSuspendedAndHiddenEntries(horseRacingEntries: HorseRacingEntry[]) {
        return horseRacingEntries.filter((runner) => {
            let notToRemove = false;
            Object.keys(runner.hideEntry).map((key) => {
                if (runner.hideEntry[key] != true) {
                    notToRemove = true;
                }
            });
            return notToRemove;
        });
    }

    maxFixedViewRunner(horseRacingRunnersResult: HorseRacingRunnersResult): MaxFixedViewrRunner {
        const runnersLength: number = horseRacingRunnersResult?.horseRacingEntries?.length;

        if (!this.screenTypeService.isHalfScreenType) {
            //full,quad
            if (this.isRCEnabled && runnersLength > 10 && horseRacingRunnersResult?.arePlus1MarketPricesPresent) {
                this.setFallbackTemplate(horseRacingRunnersResult);
            } else if (this.isRCEnabled && runnersLength <= 20) {
                this.maxRunner.maxFixedRunners = runnersLength;
                this.rcClass = this.getRcTemplate(runnersLength, horseRacingRunnersResult);
            } else {
                this.setFallbackTemplate(horseRacingRunnersResult);
            }
        } else {
            // half screen
            if (this.isRCEnabled && runnersLength <= 16) {
                this.maxRunner.maxFixedRunners = runnersLength;
                this.rcClass = this.getRcTemplate(runnersLength, horseRacingRunnersResult);
            } else if (
                this.isScrollingEnabled &&
                horseRacingRunnersResult?.showPostPick &&
                this.isRacingPostVerdictCountries &&
                this.isDiomedPresent
            ) {
                this.resetRcClass();
                this.maxRunner.maxFixedRunners = 5;
                this.maxRunner.maxViewRunners = 8;
                this.getMaxRunners(
                    'NewAutoScrollFixedItems',
                    'NewAutoScrollMaxViewRunners',
                    this.maxRunner.maxFixedRunners,
                    this.maxRunner.maxViewRunners,
                    horseRacingRunnersResult,
                );
            } else {
                this.resetRcClass();
                this.maxRunner.maxFixedRunners = 7;
                this.maxRunner.maxViewRunners = 10;
                this.getMaxRunners(
                    'NewEnhancedAutoScrollFixedItems',
                    'NewEnhancedAutoScrollMaxViewRunners',
                    this.maxRunner.maxFixedRunners,
                    this.maxRunner.maxViewRunners,
                    horseRacingRunnersResult,
                );
            }
        }
        return this.maxRunner;
    }

    prepareSplitScreenMaxFixedViewRunner(horseRacingRunnersResult: HorseRacingRunnersResult): MaxFixedViewrRunner {
        const runnersLength: number = horseRacingRunnersResult?.horseRacingEntries?.length;

        if (!this.screenTypeService.isHalfScreenType) {
            //full,quad
            if (this.isQuadSplittingEnabled) {
                // set Max Runners
                this.maxRunner.maxFixedRunners = parseInt(this.splitScreenParams?.endPageIndex);
                this.rcClass = this.getSplitScreenTemplate(runnersLength, horseRacingRunnersResult, this.splitScreenParams);
            }
        } else {
            // half screen
            if (this.isHalfSplittingEnabled) {
                if (
                    runnersLength > this.runnerTemplateConfig?.options?.splitScreenTemplatesScrollEnableAt &&
                    this.splitScreenParams?.currentPage == this.runnerTemplateConfig?.options?.splitScreenTemplatesMaxPages?.toString()
                ) {
                    this.maxRunner.maxFixedRunners = runnersLength;
                } else {
                    this.maxRunner.maxFixedRunners = parseInt(this.splitScreenParams?.endPageIndex);
                }
                this.rcClass = this.getSplitScreenTemplate(runnersLength, horseRacingRunnersResult, this.splitScreenParams);
            }
        }
        return this.maxRunner;
    }

    setFallbackTemplate(horseRacingRunnersResult: HorseRacingRunnersResult) {
        this.resetRcClass();

        this.maxRunner.maxFixedRunners = 5;
        this.maxRunner.maxViewRunners = 8;
        this.getMaxRunners(
            'NewAutoScrollFixedItems',
            'NewAutoScrollMaxViewRunners',
            this.maxRunner.maxFixedRunners,
            this.maxRunner.maxViewRunners,
            horseRacingRunnersResult,
        );
    }

    resetRcClass() {
        /**
         * ! Fallback to default scenarios: reset rcClass
         */
        this.rcClass = '';
    }

    getRcTemplate(runnersLength: number, horseRacingRunnersResult: HorseRacingRunnersResult): string {
        let templateClass = '';
        if (!!horseRacingRunnersResult?.runnerConfig) {
            const runnerTemplateConfig = this.screenTypeService.isHalfScreenType
                ? horseRacingRunnersResult?.runnerConfig?.half
                : horseRacingRunnersResult?.runnerConfig?.fullAndQuad;
            for (const template in runnerTemplateConfig) {
                templateClass = this.getTemplateClass(runnersLength, runnerTemplateConfig[template]);
                if (!!templateClass) {
                    break;
                }
            }
        }
        return templateClass;
    }
    getTemplateClass(runnersLength: number, templateConfig: RangeObject): string {
        const [min, max] = templateConfig.range;
        if (runnersLength > min && runnersLength <= max) {
            return templateConfig.templateClass;
        }
        return '';
    }

    getSplitScreenTemplate(
        runnersLength: number,
        horseRacingRunnersResult: HorseRacingRunnersResult,
        splitScreenParams: SplitScreenQueryParams,
    ): string {
        let templateClass = '';
        const runnerTemplateConfig = this.screenTypeService.isHalfScreenType
            ? horseRacingRunnersResult?.splitScreenRunnerConfig?.half
            : horseRacingRunnersResult?.splitScreenRunnerConfig?.fullAndQuad;
        if (
            !!horseRacingRunnersResult?.splitScreenRunnerConfig &&
            !!splitScreenParams &&
            runnersLength &&
            runnersLength >= runnerTemplateConfig?.options?.splitScreenTemplatesInitialRunner
        ) {
            if (this.screenTypeService.isHalfScreenType) {
                if (runnersLength <= runnerTemplateConfig?.options?.splitScreenTemplatesScrollEnableAt) {
                    const templateConfig = runnerTemplateConfig?.runners
                        ?.find((runner: SplitScreenRunner) => runner?.runnerNumber === runnersLength)
                        ?.pages?.find((page: SplitScreenPage) => page?.pageNumber === parseInt(splitScreenParams?.currentPage));
                    templateClass = templateConfig?.templateClass ?? '';
                } else {
                    templateClass = 'rcTemplate16 adjusted-scroll';
                }
            } else {
                const templateConfig = runnerTemplateConfig?.runners
                    ?.find((runner: SplitScreenRunner) => runner?.runnerNumber === runnersLength)
                    ?.pages?.find((page: SplitScreenPage) => page?.pageNumber === parseInt(splitScreenParams?.currentPage));
                templateClass = templateConfig?.templateClass ?? '';
            }
        }
        return templateClass;
    }
}
