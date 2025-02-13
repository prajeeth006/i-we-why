import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { HorseRacingTemplateService } from '../services/horse-racing-template.service';
import { AnimationEvent } from '@angular/animations';
import { EMPTY } from 'rxjs';
import { HorseRacingEntry ,HorseRacingRunnersResult,MaxFixedViewrRunner} from 'src/app/horse-racing/models/horse-racing-template.model';
import { SelectionSuspended } from 'src/app/common/models/general-codes-model';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { ScreenType } from 'src/app/common/models/screen-size.model';
import { EvrAvrConfigurationService } from 'src/app/common/services/evr-avr-configuration.service';


@Component({
  selector: 'gn-runners',
  templateUrl: './runners.component.html',
  styleUrls: ['./runners.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('autoScroll', [
      state(
        'top',
        style({
          transform: 'translateY(0px)',
        })
      ),
      state(
        'init',
        style({
          transform: 'translateY(0px)',
        })
      ),
      state(
        'step',
        style({
          transform: 'translateY({{nextPosition}}px)',
        }),
        { params: { nextPosition: 0 } }
      ),
      state(
        'update',
        style({
          transform: 'translateY({{nextPosition}}px)',
        }),
        { params: { nextPosition: 0 } }
      ),
      transition('top => init', animate('0s 2s linear')),
      transition('init => step', animate('500ms 0s linear')),
      transition('step => update', animate('0s 0s linear')),
      transition('update => step', animate('500ms 2s linear')),
    ]),
  ],
})
export class RunnersComponent {

  @ViewChild('scrollItem') scrollItem: ElementRef;
  horseRacingFixedRunnersResult: Array<HorseRacingEntry> = [];
  horseRacingAutoScrollRunnersResult: Array<HorseRacingEntry> = [];
  horseRacingAutoScrollRunners: Array<HorseRacingEntry> = [];
  horseRacingRunnersResult: HorseRacingRunnersResult;
  maxRunner: MaxFixedViewrRunner = new MaxFixedViewrRunner();

  presentStartIndex = 0;


  totalRunners: number = 0
  scrollAtTop = false
  animationState: string = 'top';
  nextPosition = 0;
  selectionAndPrice = SelectionSuspended.selectionAndPrice;
  isNonAvrVirtualRace?: boolean = false;
  vm$ = this.horseRacingTemplateService.data$
    .pipe(
      map(result => {
      this.maxRunner =  this.maxFixedViewRunner(result.horseRacingRunnersResult);

       this.totalRunners = result.horseRacingRunnersResult?.horseRacingEntries?.length;
        if (this.totalRunners <= this.maxRunner.maxViewRunners) {
          this.maxRunner.maxFixedRunners = this.totalRunners;
        }

        if (result.horseRacingRunnersResult && !result?.horseRacingRunnersResult?.isVirtualEvent) {
          result.horseRacingRunnersResult.horseRacingEntries = result.horseRacingRunnersResult.horseRacingEntries.filter((runner) => {
            let notToRemove = false;
            Object.keys(runner.hideEntry).map(key => {
              if (runner.hideEntry[key] != true) {
                notToRemove = true;
              }
            });
            return notToRemove;
          })
        }

        this.horseRacingFixedRunnersResult = result.horseRacingRunnersResult.horseRacingEntries.slice(0, this.maxRunner.maxFixedRunners);
        this.horseRacingAutoScrollRunnersResult = result.horseRacingRunnersResult.horseRacingEntries.slice(this.maxRunner.maxFixedRunners);
        return result.horseRacingRunnersResult;


      }),
      catchError(err => {
        return EMPTY;
      })
    );
  screenType: string;

  constructor(private horseRacingTemplateService: HorseRacingTemplateService, private routeDataService: RouteDataService,public evrAvrService:EvrAvrConfigurationService,) {
    let queryParams = this.routeDataService.getQueryParams();
    let screenType = queryParams['screenType'];
    this.screenType = screenType;
   }

    maxFixedViewRunner(horseRacingRunnersResult: HorseRacingRunnersResult) : MaxFixedViewrRunner {


        if ((!horseRacingRunnersResult?.isVirtualEvent) || (horseRacingRunnersResult?.isAvrRace) || (horseRacingRunnersResult?.isAvrRace === null) || (!!!this.screenType?.toLocaleLowerCase())) {
          this.isNonAvrVirtualRace = false;
          let maxFixedRunners = parseInt(horseRacingRunnersResult.horseRacingContent?.contentParameters?.AutoScrollFixedItems);
            this.maxRunner.maxFixedRunners = isNaN(maxFixedRunners) ?   this.maxRunner.maxFixedRunners : maxFixedRunners;
            let maxViewRunners = parseInt(horseRacingRunnersResult.horseRacingContent?.contentParameters?.AutoScrollMaxViewRunners);
            this.maxRunner.maxViewRunners = isNaN(maxViewRunners) ?   this.maxRunner.maxViewRunners : maxViewRunners;

        } else {
          this.isNonAvrVirtualRace = true;
            if (this.screenType?.toLowerCase() !== ScreenType.half) {
              this.maxRunner.maxFixedRunners = 5
              this.maxRunner.maxViewRunners = 8
                let maxFixedRunners = parseInt(horseRacingRunnersResult.horseRacingContent?.contentParameters?.AutoScrollFixedItemsNonAvr);
                this.maxRunner.maxFixedRunners = isNaN(maxFixedRunners) ?   this.maxRunner.maxFixedRunners : maxFixedRunners;
                let maxViewRunners = parseInt(horseRacingRunnersResult.horseRacingContent?.contentParameters?.AutoScrollMaxViewRunnersNonAvr);
                this.maxRunner.maxViewRunners = isNaN(maxViewRunners) ?   this.maxRunner.maxViewRunners : maxViewRunners;
            }
            else {
                let maxFixedRunners = parseInt(horseRacingRunnersResult.horseRacingContent?.contentParameters?.AutoScrollFixedItems);
                this.maxRunner.maxFixedRunners = isNaN(maxFixedRunners) ?   this.maxRunner.maxFixedRunners : maxFixedRunners;
                let maxViewRunners = parseInt(horseRacingRunnersResult.horseRacingContent?.contentParameters?.AutoScrollMaxViewRunners);
                this.maxRunner.maxViewRunners = isNaN(maxViewRunners) ?   this.maxRunner.maxViewRunners : maxViewRunners;
            }
        }
        return this.maxRunner;
    }
    onEnd(event: AnimationEvent) {

    if (isNaN(this.nextPosition))
       this.nextPosition = 0;

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
    if (this.horseRacingAutoScrollRunnersResult.length > 0) {

      let autoScrollItems = [...this.horseRacingAutoScrollRunnersResult];
      if (this.presentStartIndex > autoScrollItems.length - 1) {
        this.presentStartIndex = 0;
      }

      let tempRunners = autoScrollItems.slice(this.presentStartIndex, autoScrollItems.length);
      if (this.presentStartIndex != 0) {
        this.horseRacingAutoScrollRunners = [...tempRunners, ...autoScrollItems.slice(0, this.presentStartIndex)]
      } else {
        this.horseRacingAutoScrollRunners = tempRunners
      }
      this.presentStartIndex = (this.presentStartIndex + 1) % autoScrollItems.length;
    }
  }
  getTotal15CharactersHorseName(horseRacingEntryObj: HorseRacingEntry, marketsCount: number) {
    const avble_mrkts_backprices: number = marketsCount + Number(horseRacingEntryObj?.pastPrice2Str == undefined ? 0:1) + Number(horseRacingEntryObj?.pastPrice1Str== undefined? 0:1); // Count of Markets and Back Prices
    if(this.screenType?.toLowerCase() === ScreenType.half && avble_mrkts_backprices >=4 && horseRacingEntryObj?.horseName?.length>15 && horseRacingEntryObj?.isReserved && !horseRacingEntryObj.nonRunner) {
      return horseRacingEntryObj?.horseName?.substring(0, 14).concat("'");
    }
    else {
      return horseRacingEntryObj.horseName;
    }
  }
}
