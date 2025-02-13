
import { Injectable } from '@angular/core';
import { NflCdsContent, NflContentParams } from '../models/nfl-cds-content.model';
import { FixtureView, Game } from 'src/app/common/cds-client/models/fixture-view.model';
import { EMPTY, Observable, catchError, combineLatest, map, shareReplay } from 'rxjs';
import { CdsClientService } from 'src/app/common/cds-client/cds-client-service.service';
import { MessageEnvelope } from '@cds/push';
import { CdsPushConstants } from 'src/app/common/cds-client/models/cds-push-updates.constant';
import { ErrorService } from "src/app/common/services/error.service";
import { NflCdsTemplate } from '../models/nfl-cds-template.constant';
import { SportBookMarketHelper } from 'src/app/common/helpers/sport-book-market.helper';
import { StringHelper } from 'src/app/common/helpers/string.helper';
import { SportContentService } from 'src/app/common/services/sport-content/sport-content.service';
import { ContentItemPaths } from 'src/app/common/models/sport-content/sport-content-parameters.constants';

@Injectable({
  providedIn: 'root'
})
export class NflCdsService {
  errorMessage$ = this.errorService.errorMessage$;
  nflCdsContent: NflCdsContent = new NflCdsContent();
  fixtureData$: Observable<FixtureView>;
  nflContentFromSitecore$: Observable<NflContentParams>;
  nflCdsContent$: Observable<NflCdsContent>;
  fixtureData: FixtureView;

  constructor(
    private cdsPushService: CdsClientService,
    private errorService: ErrorService,
    private sportContentService: SportContentService
  ) { }


  public getFixtureViewData(fixtureId: any, marketId: any, gameIds: any) {
    return this.cdsPushService.getFixture_View(fixtureId, '', gameIds);
  }

  public GetNflCdsContent(fixtureId: any, marketId: any, gameIds: any) {
    this.fixtureData$ = this.getFixtureViewData(fixtureId, marketId, gameIds);
    this.nflContentFromSitecore$ = this.sportContentService.getContent(ContentItemPaths.nflCds);
    this.nflCdsContent$ = combineLatest([this.fixtureData$, this.nflContentFromSitecore$]).
      pipe(
        map(([fixtureData, contentFromSitecore]) => {
          if (!!fixtureData && fixtureData?.fixture) {
            this.fixtureData = fixtureData;
            this.nflCdsContent.content = contentFromSitecore;
            this.nflCdsContent = this.getNflCdsContent(fixtureData);
          }
          else {
            throw 'Could not find Nfl Content for Url - ' + this.cdsPushService.fixtureViewUrl;
          }
          return this.nflCdsContent;
        }),
        catchError(err => {
          this.errorService.logError(err);
          return EMPTY;
        })
      ), shareReplay()
  }


  public GetUpdatedNflCdsContent(messageEnvelope: MessageEnvelope): NflCdsContent {
    var gameIndex = 0;
    if (!!messageEnvelope.messageType) {
      if (messageEnvelope.messageType == CdsPushConstants.gameUpdate) {
        if (!!messageEnvelope?.payload?.game?.id) {
          gameIndex = this.fixtureData?.fixture?.games?.findIndex(x => x.id == messageEnvelope?.payload?.game?.id);
          if (gameIndex != -1) {
            this.fixtureData.fixture.games[gameIndex] = messageEnvelope?.payload?.game;
          }
          else {
            this.fixtureData?.fixture?.games?.push(messageEnvelope?.payload?.game);
          }
        }
      }
      else if (messageEnvelope.messageType == CdsPushConstants.gameDelete) {
        gameIndex = this.fixtureData?.fixture?.games?.findIndex(x => x.id == messageEnvelope?.payload?.gameId);
        this.fixtureData?.fixture?.games.splice(gameIndex, 1);
      }
      else if (messageEnvelope.messageType == CdsPushConstants.fixtureUpdate) {
        this.fixtureData.fixture.startDate = messageEnvelope?.payload?.startDate;
      }
      return this.getNflCdsContent(this.fixtureData);
    }
  }

  getPlayerNames(inputString?: string): string {
    inputString = inputString.replace(',', '.');
    inputString = StringHelper.getValueWithoutBracket(inputString);
    let formattedString = inputString.trim();

    const regex = /([+-][\d.]+)/;
    const extractedValue = inputString.match(regex);
    let result: string | null = null;

    if (extractedValue && extractedValue.length > 1) {
      result = extractedValue[1];

      let playerNameString = inputString.replace(result, '')
      if (playerNameString.trim().length > 17) {
        formattedString = playerNameString.substring(0, 18).trim() + "' " + result;
      }
    }
    return formattedString;
  }

  prepareMatchBetting(nflCdsResult: NflCdsContent, game: Game) {
    let homePlayer_Name = this.getPlayerNames(game?.results[0]?.name?.value)
    let awayPlayer_Name = this.getPlayerNames(game?.results[1]?.name?.value)

    let game_Name = game?.name?.value;
    if (game?.name?.value?.toUpperCase()?.trim() == NflCdsTemplate.totalPoints) {
      homePlayer_Name = this.getPlayerNames(game?.results[1]?.name?.value)
      awayPlayer_Name = this.getPlayerNames(game?.results[0]?.name?.value)

      game_Name = this.nflCdsContent?.content?.contentParameters?.TotalPoints;
    }
    nflCdsResult?.games?.push(
      {
        id: game.id,
        gameName: game_Name,
        matchBetting: {
          homeBettingPrice: SportBookMarketHelper.getCdsPriceStr(game?.results[0]?.visibility, game?.results[0]?.numerator, game?.results[0]?.denominator),
          homePlayer: homePlayer_Name,
          awayBettingPrice: SportBookMarketHelper.getCdsPriceStr(game?.results[1]?.visibility, game?.results[1]?.numerator, game?.results[1]?.denominator),
          awayPlayer: awayPlayer_Name,
        }
      })
  }
  public getNflCdsContent(fixture: FixtureView): NflCdsContent {
    // fixture= this.GetFixtureData() as any;
    if (!!fixture && fixture?.fixture && fixture?.fixture?.games?.length > 0) {
      if (this.errorService.isStaleDataAvailable) {
        this.errorService.unSetError();
      }
      if (!!fixture?.fixture?.sport?.name?.value) {
        this.nflCdsContent.sportName = fixture?.fixture?.sport?.name?.value;
        this.nflCdsContent.title = StringHelper.getValueWithoutBracket(fixture?.fixture?.name?.value).replace('-', '@').trim();
        this.nflCdsContent.eventStartDate = fixture?.fixture?.startDate;
        this.nflCdsContent.competitionName = fixture?.fixture?.competition?.name?.value;
        this.nflCdsContent.context = fixture?.fixture?.context;

        this.nflCdsContent.games = []
        var gamesArray = fixture?.fixture?.games;
        let gamesSortedArray = []
        for (let i = 0; i < gamesArray?.length; i++) {
          if (gamesArray[i]?.name?.value?.toUpperCase()?.trim() == NflCdsTemplate?.moneyLine) {
            gamesSortedArray[0] = gamesArray[i];
          }
          else if (gamesArray[i]?.name?.value?.toUpperCase()?.trim() == NflCdsTemplate?.spread) {
            gamesSortedArray[1] = gamesArray[i];
          }
          else if (gamesArray[i]?.name?.value?.toUpperCase()?.trim() == NflCdsTemplate?.totalPoints) {
            gamesSortedArray[2] = gamesArray[i];
          }
          else if (gamesArray[i]?.name?.value?.toUpperCase()?.trim() == NflCdsTemplate?.firstHalfMoneyLine) {
            gamesSortedArray[3] = gamesArray[i];
          }
          else if (gamesArray[i].name?.value?.toUpperCase()?.trim() == NflCdsTemplate?.firstHalfSpread) {
            gamesSortedArray[4] = gamesArray[i];
          }
        }
        gamesSortedArray?.forEach((x) => {
          this.prepareMatchBetting(this.nflCdsContent, x);
        })
      }
      return this.nflCdsContent;
    }
    else {
      const errorMessage = 'Could not find Nfl Content for Url - ' + this.cdsPushService.fixtureViewUrl;
      this.errorService.setError(errorMessage);
    }

  }
}
