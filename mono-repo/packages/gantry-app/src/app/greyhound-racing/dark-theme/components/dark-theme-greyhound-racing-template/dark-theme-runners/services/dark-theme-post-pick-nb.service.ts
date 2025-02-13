import { Injectable } from '@angular/core';

import { GreyhoundRacingEntry, GreyhoundRacingRunnersResult, GreyhoundStaticContent } from '../../../../../models/greyhound-racing-template.model';
import { RacingContentGreyhoundResult } from '../../../../../models/racing-content.model';

@Injectable({
    providedIn: 'root',
})
export class DarkThemePostPickNbService {
    constructor() {}

    public setPostPickNb(
        postPickNap?: boolean,
        postPickNextBest?: boolean,
        greyhoundStaticContent?: GreyhoundStaticContent,
        postPick?: string,
    ): string {
        if (postPick) {
            if (greyhoundStaticContent?.contentParameters) {
                if (postPickNap) {
                    return greyhoundStaticContent?.contentParameters?.Nap;
                } else if (postPickNextBest) {
                    return greyhoundStaticContent?.contentParameters?.Nb;
                }
            }
        }
        return '';
    }

    getPostPick(
        racingContent: RacingContentGreyhoundResult,
        greyHoundRunners: GreyhoundRacingEntry[],
        greyhoundRacingRunnersResult: GreyhoundRacingRunnersResult,
    ) {
        const top3Positions: Array<string> = [];
        const postPicks: string[] = racingContent?.postPick?.trim().split('-') ?? [];

        if (postPicks?.length > 0) {
            postPicks.forEach((postPick) => {
                const runner = greyHoundRunners.find((runner) => runner?.greyhoundNumber?.trim() === postPick?.trim())?.greyhoundNumber;

                if (runner) {
                    top3Positions.push(runner);
                }
            });
            greyhoundRacingRunnersResult.greyhoundRacingPostTip = top3Positions;
        }
    }
}
