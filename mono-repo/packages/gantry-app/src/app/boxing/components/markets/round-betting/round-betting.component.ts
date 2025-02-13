import { AnimationEvent, animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, SimpleChange, ViewChild } from '@angular/core';

import { SelectionName } from '../../../../boxing/models/boxing-constants.model';
import { BetDetails, MatchDataList } from '../../../../boxing/models/boxing-template.model';

@Component({
    selector: 'gn-round-betting',
    templateUrl: './round-betting.component.html',
    styleUrls: ['./round-betting.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('autoScroll', [
            state(
                'top',
                style({
                    transform: 'translateY(0px)',
                }),
            ),
            state(
                'init',
                style({
                    transform: 'translateY(0px)',
                }),
            ),
            state(
                'step',
                style({
                    transform: 'translateY({{nextPosition}}px)',
                }),
                { params: { nextPosition: 0 } },
            ),
            state(
                'update',
                style({
                    transform: 'translateY({{nextPosition}}px)',
                }),
                { params: { nextPosition: 0 } },
            ),
            transition('top => init', animate('0s 2s linear')),
            transition('init => step', animate('500ms 0s linear')),
            transition('step => update', animate('0s 0s linear')),
            transition('update => step', animate('500ms 2s linear')),
        ]),
    ],
})
export class RoundBettingComponent implements OnChanges {
    @Input() matchData: MatchDataList;

    leftBetList: Map<string, BetDetails>;
    rightBetList: Map<string, BetDetails>;

    //Autoscroll Properties
    presentStartIndex = -1;
    maxFixedRunners: number = 4;
    maxViewRunners: number = 7;
    noOfItemsToScroll: number = 1;

    animationState: string;
    nextPosition = 0;
    totalRunners: number = 0;

    roundValues: Array<string> = [];
    staticRoundValues: Array<string> = [];
    autoScrollRoundValues: Array<string> = [];
    autoScrollRounds: Array<string> = [];

    @ViewChild('scrollItem') scrollItem: ElementRef;

    ngOnChanges(change: { [matchData: string]: SimpleChange }) {
        this.leftBetList = new Map<string, BetDetails>();
        this.rightBetList = new Map<string, BetDetails>();
        this.roundValues = [];

        const marketDetails = change.matchData.currentValue as MatchDataList;
        if (marketDetails) {
            marketDetails?.homeTeamListDetails?.forEach((oddDetails) => {
                if (!oddDetails.hideEntry) {
                    this.leftBetList.set(oddDetails.betName, oddDetails);
                    if (!this.roundValues.find((x) => x == oddDetails.betName)) this.roundValues.push(oddDetails.betName);
                }
            });
            marketDetails?.awayTeamListDetails?.forEach((oddDetails) => {
                if (!oddDetails.hideEntry) {
                    this.rightBetList.set(oddDetails.betName, oddDetails);
                    if (!this.roundValues.find((x) => x == oddDetails.betName)) this.roundValues.push(oddDetails.betName);
                }
            });
        }
        const getFullPointsIndex = this.roundValues?.indexOf(SelectionName.POINTSNAME);
        const getRoundSelection = getFullPointsIndex != -1 ? this.roundValues?.splice(this.roundValues?.indexOf(SelectionName.POINTSNAME), 1)[0] : '';
        this.roundValues = this.roundValues.sort((a, b) => {
            const roundSeqA = parseInt(a?.split(' ')[1]);
            const roundSeqB = parseInt(b?.split(' ')[1]);
            return roundSeqA - roundSeqB;
        });
        if (getFullPointsIndex != -1) {
            this.roundValues.push(getRoundSelection);
        }
        this.totalRunners = this.roundValues?.length;
        if (this.totalRunners <= this.maxViewRunners) {
            this.maxFixedRunners = this.totalRunners;
        } else {
            this.maxFixedRunners = 4;
        }

        this.staticRoundValues = this.roundValues.slice(0, this.maxFixedRunners);
        this.autoScrollRoundValues = this.roundValues.slice(this.maxFixedRunners);
        this.calculateNext(false);
    }

    onEnd(event: AnimationEvent) {
        if (isNaN(this.nextPosition)) this.nextPosition = 0;

        if (event.toState === 'top') {
            this.calculateNext();
            this.animationState = 'init';
        } else if (event.toState === 'init') {
            this.nextPosition -= isNaN(this.scrollItem?.nativeElement?.offsetHeight)
                ? 0
                : this.scrollItem?.nativeElement?.offsetHeight * this.noOfItemsToScroll;
            this.animationState = 'step';
        } else if (event.toState === 'step') {
            this.nextPosition += isNaN(this.scrollItem?.nativeElement?.offsetHeight)
                ? 0
                : this.scrollItem?.nativeElement?.offsetHeight * this.noOfItemsToScroll;
            this.calculateNext();
            this.animationState = 'update';
        } else if (event.toState === 'update') {
            this.nextPosition -= isNaN(this.scrollItem?.nativeElement?.offsetHeight)
                ? 0
                : this.scrollItem?.nativeElement?.offsetHeight * this.noOfItemsToScroll;
            this.animationState = 'step';
        }
    }

    calculateNext(updateNextIndex: boolean = true) {
        const autoScrollItems = [...this.autoScrollRoundValues];
        if (this.presentStartIndex > autoScrollItems.length - 1) {
            this.presentStartIndex = 0;
        }

        if (updateNextIndex) {
            const calculatedIndex = (this.presentStartIndex + this.noOfItemsToScroll) % autoScrollItems.length;
            this.presentStartIndex = isNaN(calculatedIndex) ? 0 : calculatedIndex;
        }

        const tempRunners = autoScrollItems.slice(this.presentStartIndex, autoScrollItems.length);
        if (this.presentStartIndex != 0) {
            this.autoScrollRounds = [...tempRunners, ...autoScrollItems.slice(0, this.presentStartIndex)];
        } else {
            this.autoScrollRounds = tempRunners;
        }

        if (!this.animationState && autoScrollItems.length > 0) this.animationState = 'top';
    }

    constructor() {}
}
