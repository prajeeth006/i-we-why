import { AnimationEvent, animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ElementRef, Input, SimpleChange, ViewChild } from '@angular/core';
import { SelectionNameLength } from 'src/app/common/models/general-codes-model';
import { MultiMarket } from 'src/app/common/models/multimarket-selection';
import { BoxingCdsContent, RoundBettingDetails } from '../../../models/boxing-cds-content.model';
import { SelectionName } from '../../../models/boxing-cds-constants.model';

@Component({
  selector: 'gn-individual-round-betting',
  templateUrl: './individual-round-betting.component.html',
  styleUrls: ['./individual-round-betting.component.scss'],
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
export class IndividualRoundBettingComponent {
  @Input() matchData: BoxingCdsContent;
  multiMarket: MultiMarket = new MultiMarket();

  leftBetList: Map<string, RoundBettingDetails>;
  rightBetList: Map<string, RoundBettingDetails>;

  //Autoscroll Properties
  presentStartIndex = -1;
  maxFixedRunners: number = 4
  maxViewRunners: number = 7
  noOfItemsToScroll: number = 1

  animationState: string;
  nextPosition = 0;
  totalRunners: number = 0;

  roundValues: Array<string> = []
  staticRoundValues: Array<string> = [];
  autoScrollRoundValues: Array<string> = [];
  autoScrollRounds: Array<string> = [];

  nameLength = SelectionNameLength.Seventeen;
  @ViewChild('scrollItem') scrollItem: ElementRef;

  ngOnChanges(change: { [matchData: string]: SimpleChange }) {
    this.multiMarket.selections = [];
    this.multiMarket.selections = change?.matchData?.currentValue?.individualRoundBetting;

    this.leftBetList = new Map<string, RoundBettingDetails>();
    this.rightBetList = new Map<string, RoundBettingDetails>();
    this.roundValues = [];

    let marketDetails = change.matchData.currentValue?.individualRoundBetting;
    if (marketDetails) {
      this.multiMarket.title = marketDetails?.marketTitle;
      marketDetails?.homeTeamListDetails?.forEach((oddDetails: RoundBettingDetails) => {
        if (oddDetails) {
          this.leftBetList.set(oddDetails.betName, oddDetails)
          if (!this.roundValues.find(x => x == oddDetails.betName))
            this.roundValues.push(oddDetails.betName);
        }

      })
      marketDetails?.awayTeamListDetails?.forEach((oddDetails: RoundBettingDetails) => {
        if (oddDetails) {
          this.rightBetList.set(oddDetails.betName, oddDetails)
          if (!this.roundValues.find(x => x == oddDetails.betName))
            this.roundValues.push(oddDetails.betName);
        }
      })
    }
    let getFullPointsIndex = this.roundValues?.indexOf(SelectionName.POINTSNAME);
    let getRoundSelection = getFullPointsIndex != -1 ? this.roundValues?.splice(this.roundValues?.indexOf(SelectionName.POINTSNAME), 1)[0] : "";
    this.roundValues = this.roundValues.sort((a, b) => {
      let roundSeqA = parseInt(a?.split(" ")[1]);
      let roundSeqB = parseInt(b?.split(" ")[1]);
      return roundSeqA - roundSeqB;
    });
    if (getFullPointsIndex != -1) {
      this.roundValues.push(getRoundSelection);
    }
    this.totalRunners = this.roundValues?.length;
    if (this.totalRunners <= this.maxViewRunners) {
      this.maxFixedRunners = this.totalRunners;
    } else {
      this.maxFixedRunners = 4
    }

    this.staticRoundValues = this.roundValues.slice(0, this.maxFixedRunners);
    this.autoScrollRoundValues = this.roundValues.slice(this.maxFixedRunners);
    this.calculateNext(false);
  }

  onEnd(event: AnimationEvent) {

    if (isNaN(this.nextPosition))
      this.nextPosition = 0;

    if (event.toState === 'top') {
      this.calculateNext();
      this.animationState = 'init';
    } else if (event.toState === 'init') {
      this.nextPosition -= isNaN(this.scrollItem?.nativeElement?.offsetHeight) ? 0 : this.scrollItem?.nativeElement?.offsetHeight * this.noOfItemsToScroll;
      this.animationState = 'step';
    } else if (event.toState === 'step') {
      this.nextPosition += isNaN(this.scrollItem?.nativeElement?.offsetHeight) ? 0 : this.scrollItem?.nativeElement?.offsetHeight * this.noOfItemsToScroll;
      this.calculateNext();
      this.animationState = 'update';
    } else if (event.toState === 'update') {
      this.nextPosition -= isNaN(this.scrollItem?.nativeElement?.offsetHeight) ? 0 : this.scrollItem?.nativeElement?.offsetHeight * this.noOfItemsToScroll;
      this.animationState = 'step';
    }
  }

  calculateNext(updateNextIndex: boolean = true) {
    let autoScrollItems = [...this.autoScrollRoundValues];
    if (this.presentStartIndex > autoScrollItems.length - 1) {
      this.presentStartIndex = 0;
    }

    if (updateNextIndex) {
      let calculatedIndex = (this.presentStartIndex + this.noOfItemsToScroll) % autoScrollItems.length
      this.presentStartIndex = isNaN(calculatedIndex) ? 0 : calculatedIndex;
    }

    let tempRunners = autoScrollItems.slice(this.presentStartIndex, autoScrollItems.length);
    if (this.presentStartIndex != 0) {
      this.autoScrollRounds = [...tempRunners, ...autoScrollItems.slice(0, this.presentStartIndex)]
    } else {
      this.autoScrollRounds = tempRunners
    }

    if (!this.animationState && autoScrollItems.length > 0)
      this.animationState = 'top';

  }
}
