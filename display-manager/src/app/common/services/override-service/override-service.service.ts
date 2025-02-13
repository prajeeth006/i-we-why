import { Injectable } from '@angular/core';
import { SportBookEventStructured, SportBookMarketStructured, SportBookResult, SportBookSelection, SportBookTempResult } from '../../models/sport-bet-models';
import { EachWayTerm, HorseRacing } from '../../models/general-codes-model';
import { MainTreeNode } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/main-tree-node.model';
import { ExcludedNodeService } from 'src/app/display-manager/display-manager-left-panel/tree-view/services/excluded-node-services/excluded-node.service';
import { SportBookService } from '../sportbook-service/sport-book.service';
import { QueryParamEvent, QueryParamEventMarkets, QueryParamMarkets } from '../../models/query-param.model';
import { Constants } from 'src/app/display-manager/display-manager-right-panel/constants/constants';
import { RightPanelTabControlService } from 'src/app/display-manager/display-manager-right-panel/services/tab-control.service';
import { FilterRacingCategories } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filter-racingcategories.enum';
import { RacingContentService } from '../racingcontent-service/racing-content.service';
import { RacingContentSelection, RacingContentTempResult } from '../../models/racing-content-models';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';

@Injectable({
  providedIn: 'root'
})
export class OverrideServiceService {

  manualConstants = Constants;
  
  constructor(
    private excludedNodeService: ExcludedNodeService,
    public rightPanelTabControlService: RightPanelTabControlService,
    private sportBookService: SportBookService, private racingContentService: RacingContentService) { }


  overrideEvent(node: MainTreeNode){

    let category;
    if(node?.event?.categoryCode?.toLowerCase() == FilterRacingCategories.Horses?.toLowerCase()){
      category = this.manualConstants.event_types.horseRacing
    } else if(node?.event?.categoryCode?.toLowerCase() == FilterRacingCategories.GreyHounds?.toLowerCase()){
      category = this.manualConstants.event_types.greyhounds
    }

    

    let markets = node?.event?.markets?.filter(element => this.excludedNodeService.overrideMarkets.includes(element?.name?.toLowerCase()));
    if(node?.event?.id && markets && markets?.length > 0){

      var eventFormData: any = {
        override: { eventKey: node?.event?.id, marketKey:  markets[0].id},
        category: category,
        Runners: []
      };
      let resSportBookData: SportBookTempResult = {} as SportBookTempResult;
      let sportsFinished: Boolean = false;
      let resRacingContentData: RacingContentTempResult = {} as RacingContentTempResult;
      let racingFinished: Boolean = false;
      let sportBookSubscribed = this.sportBookService.getEventDataFromSportsBook([new QueryParamEventMarkets(new QueryParamEvent(node?.event?.id), new QueryParamMarkets(markets[0].id))], this.excludedNodeService.sportsbookApiUrl, this.excludedNodeService.snapshotTimeOut)
        .subscribe((sportBookData) => {
          if (sportBookData.isFinished) {

            sportBookSubscribed.unsubscribe();
            resSportBookData = sportBookData;
            sportsFinished = true;
            if(sportsFinished && racingFinished) {
              this.resultedFormData(eventFormData, resSportBookData, resRacingContentData);
            }
          }
        });
      
      let racingContentSubscribed = this.racingContentService.getEventDataFromRacingContent(new QueryParamEvent(node?.event?.id), this.excludedNodeService.racingContentApiUrl, this.excludedNodeService.snapshotTimeOut)
        .subscribe((racingContentData) => {
          if (racingContentData.isFinished) {
            racingContentSubscribed.unsubscribe();
            resRacingContentData = racingContentData;
            racingFinished = true;
            if(sportsFinished && racingFinished) {
              this.resultedFormData(eventFormData, resSportBookData, resRacingContentData);
            }
          }
        });
              
    }
  }

  resultedFormData(eventFormData: any, resSportBookData: SportBookTempResult, resRacingContentData: RacingContentTempResult) {
    if (eventFormData.category == this.manualConstants.event_types.horseRacing) {
      this.prepareHorseRacingFormData(eventFormData, resSportBookData, resRacingContentData);
    } else if (eventFormData.category == this.manualConstants.event_types.greyhounds) {
      this.prepareGreyhoundsRacingFormData(eventFormData, resSportBookData, resRacingContentData);
    }
    this.rightPanelTabControlService.onNewSportclick(this.manualConstants.manual, undefined, eventFormData);
  }
  
  prepareHorseRacingFormData(eventFormData: any, sportBookData: SportBookTempResult, racingContentData: RacingContentTempResult) {
    [...sportBookData.result.events.keys()].forEach(eventKey => {
      let event = sportBookData.result.events.get(eventKey);
      let racingEvent: RacingContentSelection = racingContentData.result;
      if (event) {
        eventFormData.timehrs = this.getBtcHours(event.eventDateTime);
        eventFormData.timemins = this.getBtcMinutes(event.eventDateTime);
        eventFormData.meetingName = this.removePipeSymbol(event.typeName);
        eventFormData.run = event.runnerCount;
        eventFormData.raceoff = this.isRaceOff(event);
        eventFormData.distance = racingEvent?.distance;
        eventFormData.race = racingEvent?.raceNo;
        eventFormData.going = racingEvent?.going;

        [...event.markets.keys()].forEach(marketKey => {
          let market = event?.markets.get(marketKey);
          if (market) {
            eventFormData.eachway = this.getEachWay(market);
            [...market?.selections.keys()].forEach(selectionKey => {
              let selection = market?.selections.get(selectionKey);
              if (selection) {
                let jockeyName: string | null | undefined = this.prepareJockeyName(selection, racingEvent);                
                eventFormData.Runners.push({
                  horseNumber: selection.runnerNumber,
                  horseName: this.removeNonRunnerString(selection.selectionName),
                  jockeyName: jockeyName,
                  price_odds_sp: this.getPriceOdds(selection),
                  isNonRunner: this.isNonRunner(selection),
                  isFavourite:''
                });
              }
            });
          }
        });
      }
    })
    eventFormData.Runners = eventFormData.Runners.sort((a: any, b: any) => {
      return !!a.price_odds_sp ?  -1 : 1
    })
    eventFormData.Runners = eventFormData.Runners.sort((a: any, b: any) => {
      return this.parseDivisionIntoNumber(a.price_odds_sp) - this.parseDivisionIntoNumber(b.price_odds_sp)
    })
    eventFormData.Runners = eventFormData.Runners.sort((a: any, b: any) => {
      return Number(a.isNonRunner) - Number(b.isNonRunner)
    });


  }

  parseDivisionIntoNumber(odds: string | number): number {
    if (typeof odds === 'string' && odds.includes('/')) {
      const [numerator, denominator] = odds.split('/').map(Number);
      return numerator / denominator;
    }
    return Number(odds);
  }

  prepareGreyhoundsRacingFormData(eventFormData: any, sportBookData: SportBookTempResult, racingContentData: RacingContentTempResult) {
    [...sportBookData.result.events.keys()].forEach(eventKey => {
      let event = sportBookData.result.events.get(eventKey);
      let racingEvent: RacingContentSelection = racingContentData.result;
      if (event) {

        eventFormData.timehrs = this.getBtcHours(event.eventDateTime);
        eventFormData.timemins = this.getBtcMinutes(event.eventDateTime);
        eventFormData.meetingName = this.removePipeSymbol(event.typeName);
        eventFormData.run = event.runnerCount;
        eventFormData.country = this.getCountryFlag(sportBookData?.result);
        eventFormData.raceoff = this.isRaceOff(event);
        eventFormData.distance = racingEvent?.distance;
        eventFormData.race = racingEvent?.raceNo;
        eventFormData.grade = racingEvent?.grade;

        [...event.markets.keys()].forEach(marketKey => {
          let market = event?.markets.get(marketKey);
          if(market){
            eventFormData.eachway = this.getEachWay(market);
            [...market?.selections.keys()].forEach(selectionKey => {
              let selection = market?.selections.get(selectionKey);
              if(selection){
                if (eventFormData?.Runners?.filter((runnerObj: any) => runnerObj.trapNumber == selection?.runnerNumber).length == 0) {
                  eventFormData.Runners.push({
                    trapNumber: selection.runnerNumber,
                    selectionKey: selection.selectionKey,
                    greyhoundName: this.removeNonRunnerString(selection.selectionName),
                    price_odds_sp: this.getPriceOdds(selection),
                    isVacant: this.isNonRunner(selection),
                    isReserved: this.isReserveRunner(selection)
                  });
                }
                else {
                  let index = eventFormData.Runners.findIndex((runnerObj: any) => runnerObj.trapNumber == selection?.runnerNumber);
                  if (index >= 0 && selection?.selectionKey && (selection?.selectionKey > eventFormData.Runners[index].selectionKey)) {
                    eventFormData.Runners[index] = {
                      trapNumber: selection.runnerNumber,
                      selectionKey: selection.selectionKey,
                      greyhoundName: this.removeNonRunnerString(selection.selectionName),
                      price_odds_sp: this.getPriceOdds(selection),
                      isVacant: this.isNonRunner(selection),
                      isReserved: this.isReserveRunner(selection)
                    };
                  }
                }
              }
            });
          }
        });
      }
    })
    eventFormData.Runners = eventFormData.Runners.sort((a: any, b: any) => {
      return !!a.trapNumber ?  -1 : 1
    })
    eventFormData.Runners = eventFormData.Runners.sort((a: any, b: any) => {
      return a.trapNumber - b.trapNumber;
    });
  }

  removePipeSymbol(name: string | null | undefined){
    return name?.replace(/\|/gi , '');
  }

  getPriceOdds(selection: SportBookSelection){
    if (!!selection?.prices?.price && selection?.prices?.price?.length > 0) {
      return selection?.prices?.price[0].numPrice+'/'+selection?.prices?.price[0].denPrice;
    }
    return '';
  }
    
  getBtcHours(eventDateTime: Date | null | undefined): string | undefined {
    if(!eventDateTime)
      return undefined;

    let eventStartTime = new Date(eventDateTime);
    return eventStartTime?.toLocaleString('en-US', { timeZone: "Europe/London", hour: '2-digit', hour12: false });
  }
  
  getBtcMinutes(eventDateTime: Date | null | undefined): string | undefined {
    if(!eventDateTime)
    return undefined;

    let eventStartTime = new Date(eventDateTime);
    return eventStartTime?.toLocaleString('en-US', { timeZone: "Europe/London", minute: '2-digit', hour12: false }).padStart(2, "0")
  }

  getEachWay(market: SportBookMarketStructured ): string {
    if(market.isEachWayAvailable?.toLowerCase() == 'true'){
      return market.eachWayPlaces + EachWayTerm.Places + market.eachWayFactorNum + EachWayTerm.Ratio + market.eachWayFactorDen + EachWayTerm.Odds
    } else {
      return EachWayTerm.WinOnly
    }
  }

  isNonRunner(selection: SportBookSelection ){
    return this.removePipeSymbol(selection.selectionName)?.includes("N/R");
  }

  removeNonRunnerString(selectionName: string |undefined |null ) {
    return this.removePipeSymbol(selectionName)?.replace(/N\/R/ig, '')?.trim();
  }

  isReserveRunner(selection: SportBookSelection){
    return this.removePipeSymbol(selection.selectionName)?.includes(HorseRacing.Reserve)
  }

  getCountryFlag(sportBookResult: SportBookResult): string {
    let country;
    let eventFlags: string[] = [];
    let countryList = ['UK', 'AU'];
    for (let [, event] of sportBookResult.events) {
      if(event?.typeFlagCode){
        eventFlags = event?.typeFlagCode?.split(',');
        break;
      }
    }
    var countryFlags = countryList.filter(function (country) {
      return eventFlags?.indexOf(country) > -1;
    });

    if (countryFlags?.length > 0) {
      country = countryFlags[0];
    }
    else
      country = 'UK';

    if(country == 'AU'){
      country = 'AUS'
    }
    return country;
    
  }

  isRaceOff(event: SportBookEventStructured ){
    return !!event?.offTime;
  }

  prepareJockeyName(selection: SportBookSelection, racingEvent: RacingContentSelection) {
    let jockeyName: string | null | undefined = '';
    if (racingEvent && racingEvent.horses && racingEvent.horses.length > 0 && racingEvent.horses.filter(horse => horse.horseName == this.removeNonRunnerString(selection?.selectionName)).length > 0) {
      jockeyName = racingEvent.horses.filter(horse => horse.horseName == this.removeNonRunnerString(selection?.selectionName))[0].jockey;
    }
    return jockeyName;
  }
}
