import { Injectable } from "@angular/core";
import {
  GreyhoundRacingEntry,
  GreyhoundRacingRunnersResult,
  GreyhoundStaticContent,
} from "src/app/greyhound-racing/models/greyhound-racing-template.model";
import { RacingContentGreyhoundResult } from "src/app/greyhound-racing/models/racing-content.model";

@Injectable({
  providedIn: "root",
})
export class PostPickNbService {
  constructor() { }

  public setPostPickNb(
    postPickNap?: boolean,
    postPickNextBest?: boolean,
    greyhoundStaticContent?: GreyhoundStaticContent,
    postPick?: string
  ): string {
    if (!!postPick) {
      if (postPickNap) {
        return greyhoundStaticContent?.contentParameters?.Nap;
      } else if (postPickNextBest) {
        return greyhoundStaticContent?.contentParameters?.Nb;
      }
    }
    return "";
  }

  public setRacingPostTipImageByPositions(
    greyhoundRacingPostTip: string[],
    position: string,
    greyHoundImageData: GreyhoundStaticContent
  ): string[] {
    if (!!position) {
      greyhoundRacingPostTip.push(
        this.greyhoundRacingPostTipImage(position, greyHoundImageData)
      );
    }

    return greyhoundRacingPostTip;
  }

  greyhoundRacingPostTipImage(
    runnerNo: string,
    imageData: GreyhoundStaticContent
  ) {
    if (imageData?.greyHoundImages?.runnerImages?.length >= parseInt(runnerNo))
      return imageData?.greyHoundImages?.runnerImages[parseInt(runnerNo) - 1]?.src;
    else return "";
  }

  getPostPick(
    racingContent: RacingContentGreyhoundResult,
    greyHoundRunners: GreyhoundRacingEntry[],
    top3Positions: string[],
    greyhoundRacingRunnersResult: GreyhoundRacingRunnersResult,
    greyHoundImageData: GreyhoundStaticContent
  ) {
    let postPicks: string[] = racingContent?.postPick?.trim().split("-") ?? [];

    if (postPicks?.length > 0) {
      postPicks.forEach((postPick, index) => {
        let runner = greyHoundRunners.find(
          (runner) => runner?.greyhoundNumber?.trim() === postPick?.trim()
        )?.greyhoundNumber;
        if (!!runner) {
          let runnerIndex = top3Positions.push(runner);
          greyhoundRacingRunnersResult.greyhoundRacingPostTip =
            this.setRacingPostTipImageByPositions(
              greyhoundRacingRunnersResult.greyhoundRacingPostTip,
              top3Positions[runnerIndex - 1],
              greyHoundImageData
            );
        }
      });
    }
  }
}
