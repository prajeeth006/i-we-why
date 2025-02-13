import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { RouteDataService } from 'src/app/common/services/route-data.service';
import { AvrPreambleService } from '../../services/avr-preamble.service';
import { catchError, EMPTY, tap } from 'rxjs';
import { AvrTemplate, ResultDetails } from '../../models/avr-template.model';
import { AnimationEvent } from '@angular/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AvrEventTypeEnum } from '../../models/avr-result-enum.model';

@Component({
  selector: 'gn-avr-preamble',
  templateUrl: './avr-preamble.component.html',
  styleUrls: ['./avr-preamble.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // reacts only on observable change (not normal property change - more optimized),
  encapsulation: ViewEncapsulation.ShadowDom,
  animations: [
    trigger('autoScroll', [
      state(
        'top',
        style({
          transform: 'translateY(0)',
        })
      ),
      state(
        'init',
        style({
          transform: 'translateY(0)',
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
export class AvrPreambleComponent {

  errorMessage$ = this.avrPreambleService.errorMessage$;
  fillerPageMessage$ = this.avrPreambleService.fillerPageMessage$;
  isHorseRace = AvrEventTypeEnum.HorseRace;
  isMotorRace = AvrEventTypeEnum.MotorRace;


  @ViewChild('scrollItem') scrollItem: ElementRef;
  avrFixedRunnersResult: Array<ResultDetails> = [];
  avrAutoScrollRunnersResult: Array<ResultDetails> = [];
  avrAutoScrollRunners: Array<ResultDetails> = [];

  presentStartIndex = 0;
  maxFixedRunners: number = 7
  maxViewRunners: number = 10

  totalRunners: number = 0
  scrollAtTop = false
  animationState: string = 'top';
  nextPosition = 0;
  autoScrollHeight = 0;

  vm$ = this.avrPreambleService.data$.pipe(
    tap((result: AvrTemplate) => {

      this.totalRunners = result.resultsTable?.length;
      if (this.totalRunners <= this.maxViewRunners) {
        this.maxFixedRunners = this.totalRunners;
      }
      this.avrFixedRunnersResult = result.resultsTable.slice(0, this.maxFixedRunners);
      this.avrAutoScrollRunnersResult = result.resultsTable.slice(this.maxFixedRunners);


    }),
    catchError(err => {
      return EMPTY;
    })
  );


  constructor(
    private avrPreambleService: AvrPreambleService,
    private routeDataService: RouteDataService
  ) {
    let queryParams = this.routeDataService.getQueryParams();
    let controllerId = queryParams['controllerId'];
    this.avrPreambleService.setControllerId(controllerId);
  }

  onEnd(event: AnimationEvent) {
    if (isNaN(this.nextPosition))
      this.nextPosition = 0;

    if (event.toState === 'top') {
      this.calculateNext();
      this.animationState = 'init';
    } else if (event.toState === 'init') {
      this.nextPosition -= this.scrollItem?.nativeElement?.offsetHeight;
      this.autoScrollHeight = this.scrollItem?.nativeElement?.offsetHeight * 3;
      this.animationState = 'step';
    } else if (event.toState === 'step') {
      this.nextPosition += this.scrollItem?.nativeElement?.offsetHeight;
      this.autoScrollHeight = this.scrollItem?.nativeElement?.offsetHeight * 3;
      this.calculateNext();
      this.animationState = 'update';
    } else if (event.toState === 'update') {
      this.nextPosition -= this.scrollItem?.nativeElement?.offsetHeight;
      this.animationState = 'step';
    }
  }



  calculateNext() {
    if (this.avrAutoScrollRunnersResult.length > 0) {

      let autoScrollItems = [...this.avrAutoScrollRunnersResult];
      if (this.presentStartIndex > autoScrollItems.length - 1) {
        this.presentStartIndex = 0;
      }

      let tempRunners = autoScrollItems.slice(this.presentStartIndex, autoScrollItems.length);
      if (this.presentStartIndex != 0) {
        this.avrAutoScrollRunners = [...tempRunners, ...autoScrollItems.slice(0, this.presentStartIndex)]
      } else {
        this.avrAutoScrollRunners = tempRunners
      }
      this.presentStartIndex = (this.presentStartIndex + 1) % autoScrollItems.length;
    }
  }
}
