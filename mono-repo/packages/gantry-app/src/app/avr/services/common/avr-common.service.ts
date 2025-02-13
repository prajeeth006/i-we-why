import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SportBookMarketHelper } from '../../../common/helpers/sport-book-market.helper';
import { AvrTags } from '../../../common/models/data-feed/avr.model';
import { SelectionNameLength } from '../../../common/models/general-codes-model';
import { AvrContent } from '../../models/avr-result-content.model';
import { AvrEventTypeEnum, AvrMessageTypeEnum, AvrTagsEnum } from '../../models/avr-result-enum.model';
import { AvrTemplate } from '../../models/avr-template.model';

@Injectable({
    providedIn: 'root',
})
export class AvrCommonService {
    public staticContent: AvrContent = new AvrContent();
    controllerId$ = new BehaviorSubject<string>('');
    courseIsJump$ = new BehaviorSubject<string | null | undefined>(null);

    setControllerId(id: string) {
        this.controllerId$.next(id);
    }

    getControllerId() {
        return this.controllerId$.getValue();
    }

    setCourseIsJump(flag: string | null | undefined) {
        this.courseIsJump$.next(flag);
    }

    getCourseIsJump() {
        return this.courseIsJump$.getValue();
    }

    constructor() {}

    /**
     * * This method will retun eventName
     * @param meetingName
     * @param eventDateTime
     * @returns eventName
     */
    setEventName(meetingName: string, eventDateTime: string): string {
        let eventName = '';
        meetingName = meetingName?.replace(/\d+$/, '').trim()?.toUpperCase();
        const dateTime = eventDateTime?.split(' ');
        if (dateTime?.length > 1) {
            const time = dateTime[1]?.split(':');
            if (time.length >= 2) {
                eventName = time[0] + ':' + time[1] + ' ' + meetingName;
            }
        }
        return eventName;
    }

    /**
     * * This method will update EachWay string of AvrTemplate
     * @param avrTemplateData
     * @param tags
     * @returns AvrTemplate
     */
    setEachWayDetails(avrTemplateData: AvrTemplate, tags: Array<AvrTags>): AvrTemplate {
        let eachWayFraction: string = '';
        let eachWayTerms: string = '';
        tags?.forEach((tag: AvrTags) => {
            const tagName = tag?.name?.toUpperCase();
            if (tagName == AvrTagsEnum.EachWayTerms) {
                if (Number(tag.value) > 0) {
                    eachWayFraction = '1/' + tag.value;
                }
            } else if (tagName == AvrTagsEnum.NumEachWay) {
                if (Number(tag.value) > 0) {
                    eachWayTerms = SportBookMarketHelper.getPlaces(tag.value);
                }
            }
            if (!!eachWayFraction && !!eachWayTerms) {
                avrTemplateData.eachWay = eachWayFraction + ' ' + eachWayTerms;
                avrTemplateData.eachWayOnTemplate = eachWayFraction + ' ' + (this.staticContent?.contentParameters?.Odds ?? '') + ' ' + eachWayTerms;
            }
            return avrTemplateData;
        });
        return avrTemplateData;
    }

    /**
     * * This method return max allowed selection name length based on pageType & eventType
     * @param pageType can be 'VIEWEREVENTCARD' or 'RESULT'
     * @param eventType Horse:0, Dog:1, Motor:3
     * @returns selectionNameMaxLength
     */
    getRunnerNameMaxLengthByEventType(pageType: string, eventType: string) {
        let selectionNameMaxLength = SelectionNameLength.Eighteen;
        switch (eventType) {
            case AvrEventTypeEnum.HorseRace:
                selectionNameMaxLength = SelectionNameLength.Sixteen;
                break;
            case AvrEventTypeEnum.DogRace:
                selectionNameMaxLength = SelectionNameLength.Eighteen;
                break;
            case AvrEventTypeEnum.MotorRace:
                selectionNameMaxLength = pageType == AvrMessageTypeEnum.Result ? SelectionNameLength.Fourteen : SelectionNameLength.Sixteen;
                break;
        }
        return selectionNameMaxLength;
    }
}
