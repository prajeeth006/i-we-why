import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from 'src/app/common/api.service';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { FilterEvents } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filter-events.enum';
import { Filters } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filters.model';
import { BaseTreeViewService } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/services/base-tree-view.service';
import { ProductTabs } from 'src/app/display-manager/display-manager-left-panel/product-tabs/product-tab-names';
import { ScItemService } from 'src/app/sitecore/sc-item-service/sc-item.service';
import { ScItem, ScMultiEventItem } from 'src/app/sitecore/sc-models/sc-item.model';
import { Event, RacingEvents } from '../../../display-manager-left-panel/tree-view/models/event.model';
import { Constants } from '../../constants/constants';
import { MultiEvent } from '../model/multievent';
import { FormValidationService } from 'src/app/common/form-validion/form-validation.service';
import { UntypedFormBuilder, UntypedFormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ManualInitializingForm } from '../model/IMultiEventTabs';

export class DialogTrackerData {
  name: string;
  tabIndex: number;
}

@Injectable({
  providedIn: 'root'
})

export class MultieventService {
  dialogTrackerData = new BehaviorSubject<DialogTrackerData>(new DialogTrackerData());
  dialogTracker$ = this.dialogTrackerData.asObservable();
  dialogErrorData = new BehaviorSubject<boolean>(false);
  dialogError$ = this.dialogErrorData.asObservable();
  tabNamesEnum = ProductTabs;
  manualConstants = Constants;
  datePipe: DatePipe = new DatePipe('en-US');
  todayDate: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  maxAllowDate: string | null = this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() + 7)), 'yyyy-MM-dd');

  constructor(
    private baseTreeViewService: BaseTreeViewService,
    private scItemService: ScItemService,
    private labelSelectorService: LabelSelectorService,
    private apiService: ApiService, private fb: UntypedFormBuilder) { }


  loadItems(currentLabel: string, event: Event[], filters: Filters, includeRacingCategories: boolean = true): Observable<RacingEvents> {
    //return this.baseTreeViewService.getRacingTabNodes(currentLabel, event, filters, false)
    filters.dateFrom = FilterEvents.Today;
    let tabFilter = {
      racingEvents: event,
      filter: filters
    }
    let params = new HttpParams().append('label', currentLabel).append('include', includeRacingCategories);

    return this.apiService.post<RacingEvents>('/sitecore/api/displayManager/getMultiEventListNodes', tabFilter, params)
  }

  loadSportCategories(currentLabel: string, filters: Filters): Observable<RacingEvents> {
    return this.loadItems(currentLabel, [new Event({ id: '', name: '', tabName: this.tabNamesEnum.sports })], filters, false);
  }

  loadRacingCategories(currentLabel: string, filters: Filters): Observable<RacingEvents> {
    return this.loadItems(currentLabel, [new Event({ id: '', name: '', tabName: this.tabNamesEnum.racing })], filters);
  }

  loadManualCategories(currentLabel: string, filters: Filters): Observable<RacingEvents> {
    return this.loadItems(currentLabel, [new Event({ id: '', name: '', tabName: this.manualConstants.manual })], filters);
  }

  loadManualOutrightSportsList(currentLabel: string): Observable<string[]> {
    let params = new HttpParams().append('currentLabel', currentLabel ? currentLabel : '');
    return this.apiService.get<string[]>('/sitecore/api/displayManager/getManualOutrightSports', params)
  }

  loadTemplates(templateType: string) {
    let queryParams = new HttpParams().append('path', this.labelSelectorService.configItemValues.leftPanelPath + '/MultiEventTemplates/NonVirtual/' + templateType);
    return this.scItemService.getDataFromMasterDB<ScItem>('/sitecore/api/ssc/item', queryParams)

  }


  loadMarketTemplates(itemId: string) {
    return this.scItemService.getDataFromMasterDB<ScMultiEventItem[]>('/sitecore/api/ssc/item/' + itemId + '/children');
  }


  saveMultiEvent(multiEvent: MultiEvent) {
    return this.apiService.post<Event[]>('/sitecore/api/displayManager/createMultiEvent', multiEvent)
  }

  saveManualEvent(multiEvent: MultiEvent) {
    return this.apiService.post<Event[]>('/sitecore/api/displayManager/createManualEvent', multiEvent)
  }

  getManualItemByID(itemID: string) {
    let params = new HttpParams().append('itemID', itemID ? itemID : '');
    return this.apiService.get<string>('/sitecore/api/displayManager/getManualDataItemByID', params)
  }

  resetRacingFormData(eventFormData: any,category: string, country: string){
    eventFormData.category = category;
    if (category === this.manualConstants.event_types.greyhounds) {
      eventFormData.country = country;
    }
    eventFormData.Runners = [];
    return eventFormData;
  }

  resetManualSportFormData(eventFormData: any,sport: string){
    eventFormData.sportName = sport;
    eventFormData.Runners = [];
    return eventFormData;
  }

  mapMultiEventFormData(data: any, eventType: string, greyhounds: boolean) {
    let dateValidators = [FormValidationService.dateMinimum(this.todayDate)];
    if (eventType == Constants.racing) {
      dateValidators.push(FormValidationService.dateMaximum(this.maxAllowDate));
    }
    switch (eventType) {
      case Constants.sports:
        return this.fb.group({
          sportsHeaderGroup: this.fb.group({
            category: [data.category ? data.category : data?.sportsHeaderGroup?.category],
            date: [data?.date ? data?.date : (data?.sportsHeaderGroup?.date ? data?.sportsHeaderGroup?.date : this.todayDate), dateValidators],
            region: [data.region ? data.region : data?.sportsHeaderGroup?.region],
            competition: [data.competition ? data.competition : data?.sportsHeaderGroup?.competition],
            market: [data.market ? data.market : data?.sportsHeaderGroup?.market],
            racingEvents: [data.racingEvents ? data.racingEvents : data?.sportsHeaderGroup?.racingEvents]
          }),
          competition: [data.competition ? data.competition : data?.sportsHeaderGroup?.competition],
          market: [data.market ? data.market : data?.sportsHeaderGroup?.market]
        });
      case Constants.racing:
        return this.fb.group({
          racingHeaderGroup: this.fb.group({
            category: [data.category ? data.category : data?.racingHeaderGroup?.category],
            date: [data?.date ? data?.date : (data?.racingHeaderGroup?.date ? data?.racingHeaderGroup?.date : this.todayDate), dateValidators],
            region: [data.region ? data.region : data?.racingHeaderGroup?.region],
            competition: [data.competition ? data.competition : data?.racingHeaderGroup?.competition],
            market: [data.market ? data.market : data?.racingHeaderGroup?.market],
            racingEvents: [data.racingEvents ? data.racingEvents : data?.racingHeaderGroup?.racingEvents]
          }),
          competition: [data.competition ? data.competition : data.racingHeaderGroup?.competition],
          market: [data.market ? data.market : data?.racingHeaderGroup?.market]
        });
      case Constants.manual:
        if (greyhounds) {
          this.setMaxTotalRows(data);
          return this.fb.group({
            manualGreyhoundsHeaderGroup: this.fb.group({
              category: [data.category],
              timehrs: [data.timehrs, { validators: [Validators.required] }],
              timemins: [data.timemins, { validators: [Validators.required] }],
              meetingName: [data.meetingName, { validators: [Validators.required] }],
              race: [data.race, { validators: [Validators.required] }],
              country: [data.country, { validators: [Validators.required] }]
            }),
            Runners: this.fb.array(this.generateGreyHoundsRunnersForm(data.Runners)),
            activerows: [data.activerows],
            raceoff: [{value: data.raceoff ? true : false, disabled: data.isResulted ? true : false}],
            isEventResulted: [{value: data.isEventResulted ? true : false,disabled: data.isResulted ? true : false}],
            isResulted: [data.isResulted ? data.isResulted : false],
            footerGroup: this.fb.group({
              eachway: [data.eachway, { validators: [Validators.required] }],
              run: [data.run, { validators: [Validators.required, Validators.maxLength(2)] }],
              distance: [data.distance ? data.distance : null],
              grade: [data.grade ? data.grade : null],
              forecast: [data.forecast ? data.forecast : null],
              tricast: [data.tricast ? data.tricast : null],
            }),
            override: this.fb.group({
              eventKey: [data.override?.eventKey],
              marketKey: [data.override?.marketKey]
            })
          });

        }
        else {
          return this.fb.group({
            manualHeaderGroup: this.fb.group({
              category: [data.category],
              timehrs: [data.timehrs, { validators: [Validators.required] }],
              timemins: [data.timemins, { validators: [Validators.required] }],
              meetingName: [data.meetingName, { validators: [Validators.required] }],
              race: [data.race]
            }),
            activerows: [data.activerows],
            raceoff: [{value: data.raceoff ? true : false, disabled: data.isResulted ? true : false}],
            isEventResulted: [{value: data.isEventResulted ? true : false,disabled: data.isResulted ? true : false}],
            isResulted: [data.isResulted ? data.isResulted : false],
            Runners: this.fb.array(this.generateRunnersForm(data.Runners)),
            footerGroup: this.fb.group({
              eachway: [data.eachway, { validators: [Validators.required] }],
              run: [data.run, { validators: [Validators.required, Validators.maxLength(2)] }],
              distance: [data.distance],
              going: [data.going],
              forecast: [data.forcast],
              tricast: [data.tricast],
              win: [data.win],
              place: [data.place],
              exacta: [data.exacta],
              trifecta: [data.trifecta]
            }),
            override: this.fb.group({
              eventKey: [data.override?.eventKey],
              marketKey: [data.override?.marketKey]
            })
          });
        }
      case Constants.manual_sports_multi_market:
        return this.fb.group({
          manualSportsMultiMarketHeaderGroup: this.fb.group({
            sportName: [data.sportName, { validators: [Validators.required] }],
            templateTitle: [data.templateTitle],
            marketType: [data.marketType],
            startDate: [data.startDate],
            endDate: [data.endDate],
            eventName: [data.eventName, { validators: [Validators.required] }],
            date: [data.date],
            time: [data.time]
          }),
          manualSportsMultiMarketGroup: this.fb.group({
            firstOdds: [data.firstOdds, { validators: [Validators.required] }],
            firstPlayer: [data.firstPlayer, { validators: [Validators.required] }],
            draw: [data.draw],
            isDraw: [data.isDraw == true ? true : false],
            secondPlayer: [data.secondPlayer, { validators: [Validators.required] }],
            secondOdds: [data.secondOdds, { validators: [Validators.required] }],
            Runners: this.fb.array(this.generateManualSportsRunnersForm(data.Runners))
          })
        });
      case Constants.manual_sports_outright:
        return this.fb.group({
          manualSportsMultiMarketHeaderGroup: this.fb.group({
            sportName: [data.sportName],
            eventName: [data.eventName, { validators: [Validators.required] }],
            date: [data.date],
            time: [data.time]
          }),
          manualSportsMultiMarketGroup: this.fb.group({
            Runners: this.fb.array(this.generateManualSportsRunnersForm(data.Runners))
          })
        });
      default:
        return this.fb.group({
          manualSportsMultiMarketHeaderGroup: this.fb.group({
            sportName: [null, { validators: [Validators.required] }],
            templateTitle: [null],
            marketType: [null],
            startDate: [null],
            endDate: [null],
            eventName: [null, { validators: [Validators.required] }],
            date: [null],
            time: [null]
          }),
          manualSportsMultiMarketGroup: this.fb.group({
            firstOdds: [null, { validators: [Validators.required] }],
            firstPlayer: [null, { validators: [Validators.required] }],
            draw: [null],
            isDraw: new UntypedFormControl(false),
            secondPlayer: [null, { validators: [Validators.required] }],
            secondOdds: [null, { validators: [Validators.required] }],
            Runners: new UntypedFormControl([])
          })
        });
    }
  }

  private generateGreyHoundsRunnersForm(runnersArray: any[]) {
    const resultArray: any[] = [];
    for (let i = 0; i < runnersArray?.length; i++) {
      resultArray.push(this.fb.group({
        finished: [runnersArray[i]?.finished],
        trapNumber: [runnersArray[i]?.trapNumber ? runnersArray[i]?.trapNumber : (i+1).toString(), { validators: [Validators.required] }],
        greyhoundName: [runnersArray[i]?.greyhoundName, { validators: [Validators.required] }],
        price_odds_sp: [runnersArray[i]?.price_odds_sp],
        odds_sp_value: [runnersArray[i]?.odds_sp_value],
        odds_sp: [runnersArray[i]?.odds_sp],
        result_odds_sp: [runnersArray[i]?.result_odds_sp],
        isStartPrice: [runnersArray[i]?.isStartPrice == true ? true : false],
        isVacant: [runnersArray[i]?.isVacant == true ? true : false],
        isReserved: [runnersArray[i]?.isReserved == true ? true : false],
        isFavourite: [runnersArray[i]?.isFavourite == true ? true : false]
      }))
    }
    return resultArray;
  }

  private generateRunnersForm(runnersArray: any[]) {
    const resultArray: any[] = [];
    for (let i = 0; i < runnersArray?.length; i++) {
      resultArray.push(this.fb.group({
        finished: [runnersArray[i]?.finished],
        horseNumber: [runnersArray[i]?.horseNumber, { validators: [Validators.required] }],
        horseName: [runnersArray[i]?.horseName, { validators: [Validators.required] }],
        jockeyName: [runnersArray[i]?.jockeyName],
        price_odds_sp: [runnersArray[i]?.price_odds_sp],
        odds_sp_value: [runnersArray[i]?.odds_sp_value],
        odds_sp: [runnersArray[i]?.odds_sp],
        result_odds_sp: [runnersArray[i]?.result_odds_sp],
        isStartPrice: [runnersArray[i]?.isStartPrice == true ? true : false],
        isNonRunner: [runnersArray[i]?.isNonRunner == true ? true : false],
        isFavourite: [runnersArray[i]?.isFavourite == true ? true : false]
      }))
    }
    return resultArray;
  }

  private generateManualSportsRunnersForm(runnersArray: any[]) {
    const resultArray: any[] = [];
    for (let i = 0; i < runnersArray?.length; i++) {
      resultArray.push(this.fb.group({
        selectionName: [runnersArray[i]?.selectionName, { validators: [Validators.required] }],
        time: [runnersArray[i]?.time],
        firstOdds: [runnersArray[i]?.firstOdds],
        firstPlayer: [runnersArray[i]?.firstPlayer],
        draw: [runnersArray[i]?.draw],
        secondPlayer: [runnersArray[i]?.secondPlayer],
        secondOdds: [runnersArray[i]?.secondOdds],
        odds: [runnersArray[i]?.odds, { validators: [Validators.required] }]
      }))
    }
    return resultArray;
  }

  loadInitializeMultiEventForm(formData: any, eventType: string, isManualGreyHounds: boolean) {
    const resultObj: any = {} as ManualInitializingForm;
    if (Object.keys(formData).length != 0 && formData?.tabName && formData?.tabName != this.manualConstants.untitled_text) {
      resultObj.isSaved = true;
    }
    else {
      resultObj.isSaved = false;
    }
    resultObj.name = formData?.tabName ? formData?.tabName : null;
    resultObj.id = formData?.id ? formData?.id : null;
    resultObj.targetid = formData?.targetid ? formData?.targetid : null;
    resultObj.isResulted = formData?.isEventResulted ? formData?.isEventResulted : false;
    resultObj.raceoffState = formData?.raceoffState ? formData?.raceoffState : 0;
    resultObj.data = this.mapMultiEventFormData(formData, eventType, isManualGreyHounds);
    return resultObj;
  }

  setMaxTotalRows(data: any) {
    let totalRequiredRows = data?.country === 'UK' ? this.manualConstants.rows_by_countries.UK : this.manualConstants.rows_by_countries.AUS;
    if (data?.Runners?.length > totalRequiredRows)
      data.Runners.length = totalRequiredRows;
  }

}
