import { Injectable } from '@angular/core';

import { TrackingService, UserConfig } from '@frontend/vanilla/core';

@Injectable({
    providedIn: 'root',
})
export class PlayBreakTrackingService {
    constructor(
        private trackingService: TrackingService,
        private userService: UserConfig,
    ) {}

    trackInterceptorShown(playBreakSet?: boolean) {
        this.track('contentView', 'load', playBreakSet ? 'play breaks set' : 'no play breaks set', 'soft interceptor', 'soft interceptor');
    }

    trackHeaderClose(playBreakSet?: boolean) {
        this.track('Event.Tracking', 'close', playBreakSet ? 'play breaks set' : 'no play breaks set', 'soft interceptor', 'soft interceptor');
    }

    trackClose(playBreakSet?: boolean) {
        this.track('Event.Tracking', 'click', playBreakSet ? 'play breaks set' : 'no play breaks set', 'soft interceptor', 'close');
    }

    trackTakeShortBreak(playBreakSet?: boolean) {
        this.track('Event.Tracking', 'click', playBreakSet ? 'play breaks set' : 'no play breaks set', 'soft interceptor', 'take short break');
    }

    trackDurationSelectionOpen() {
        this.track('contentView', 'load', 'not applicable', 'first step of break selection drawer', 'first step of break selection drawer');
    }

    trackDurationSelectionChange() {
        this.track('Event.Tracking', 'click', 'drop-down selector', 'first step of break selection drawer', 'select value');
    }

    trackDurationSelectionCancel() {
        this.track('Event.Tracking', 'click', 'not applicable', 'first step of break selection drawer', 'cancel');
    }

    trackDrawerContinue() {
        this.track('Event.Tracking', 'click', 'not applicable', 'first step of break selection drawer', 'continue');
    }

    trackDrawerOpenedSecondStep() {
        this.track('contentView', 'load', 'not applicable', 'second step of break selection drawer', 'second step of break selection drawer');
    }

    trackDrawerPeriodSelectedSecondStep() {
        this.track('Event.Tracking', 'click', 'drop-down selector', 'second step of break selection drawer', 'select value');
    }

    trackDrawerCancelSecondStep() {
        this.track('Event.Tracking', 'click', 'not applicable', 'second step of break selection drawer', 'cancel');
    }

    trackDrawerContinueSecondStep() {
        this.track('Event.Tracking', 'click', 'not applicable', 'second step of break selection drawer', 'continue');
    }

    trackConfirmationDrawerOpened() {
        this.track('contentView', 'load', 'soft interceptor', 'confirmation drawer', 'confirmation drawer');
    }

    trackConfirmationDrawerCancel() {
        this.track('Event.Tracking', 'click', 'soft interceptor', 'confirmation drawer', 'cancel');
    }

    trackConfirmationDrawerConfirm() {
        this.track('Event.Tracking', 'click', 'soft interceptor', 'confirmation drawer', 'confirm break');
    }

    trackConfirmationDrawerChangeDuration() {
        this.track('Event.Tracking', 'click', 'soft interceptor', 'confirmation drawer', 'change duration');
    }

    trackNotificationPopupDisplayed(timeInMinutes: string, breakType: string, hardInterceptor?: boolean) {
        this.track(
            'contentView',
            'load',
            hardInterceptor ? 'hard interceptor' : 'soft interceptor',
            `confirmation overlay ${this.getBreakTypeName(breakType)}`,
            'confirmation overlay',
        );
        this.track(
            'Event.Tracking',
            'submit',
            'not applicable',
            hardInterceptor ? `hard interceptor ${this.getBreakTypeName(breakType)}` : `soft interceptor ${this.getBreakTypeName(breakType)}`,
            'success ',
            {
                'component.TimeMin': `${timeInMinutes}`,
            },
        );
    }

    trackNotificationPopupContactUs(hardInterceptor: boolean, breakType: string) {
        this.track(
            'Event.Tracking',
            'click',
            hardInterceptor ? 'hard interceptor' : 'soft interceptor',
            `confirmation overlay ${this.getBreakTypeName(breakType)}`,
            'contact us',
        );
    }

    trackNotificationPopupOk(hardInterceptor: boolean, message: string, breakType: string) {
        this.track(
            'Event.Tracking',
            'click',
            hardInterceptor ? 'hard interceptor' : 'soft interceptor',
            message + `${this.getBreakTypeName(breakType)}`,
            'ok',
        );
    }

    trackHeaderMessageShown(breakType: string, hardInterceptor?: boolean) {
        this.track(
            'contentView',
            'load',
            hardInterceptor ? 'hard interceptor' : 'soft interceptor',
            `time ticker ${this.getBreakTypeName(breakType)}`,
            'time ticker',
        );
    }

    trackHeaderMessageContactUs(hardInterceptor?: boolean) {
        this.track('Event.Tracking', 'click', hardInterceptor ? 'hard interceptor' : 'soft interceptor', 'time ticker', 'contact us');
    }

    trackHardInterceptorShown(breakType: string) {
        this.track('contentView', 'load', 'not applicable', `hard interceptor ${this.getBreakTypeName(breakType)}`, 'hard interceptor');
    }

    trackHardInterceptorTakeBreak(breakType: string) {
        this.track('Event.Tracking', 'click', 'not applicable', `hard interceptor ${this.getBreakTypeName(breakType)}`, 'I understand take a break');
    }

    trackHardInterceptorLiveChat() {
        this.track('Event.Tracking', 'click', 'not applicable', 'hard interceptor', 'live chat');
    }

    private track(eventName: string, action: string, position: string, location: string, eventDetails: string, extraData?: any) {
        let data = {
            'component.CategoryEvent': 'Gambling Controls',
            'component.LabelEvent': 'time management - play breaks',
            'component.ActionEvent': action,
            'component.PositionEvent': position,
            'component.LocationEvent': location,
            'component.EventDetails': eventDetails,
            'component.URLclicked': 'not applicable',
        };

        if (extraData) {
            data = Object.assign(data, extraData);
        }

        this.trackingService.triggerEvent(eventName, data);
    }

    private getBreakTypeName(breakType: string): string {
        return breakType === '' ? ' lsl' : ' lsl24';
    }
    private tracklsl24(eventName: string, action: string, position: string, location: string, eventDetails: string, url: string) {
        const data = {
            'component.CategoryEvent': 'Gambling Controls',
            'component.LabelEvent': 'time management - play breaks',
            'component.ActionEvent': action,
            'component.PositionEvent': position,
            'component.LocationEvent': location,
            'component.EventDetails': eventDetails,
            'component.URLclicked': url,
            'user.profile.accountID': this.userService.customerId,
        };
        this.trackingService.triggerEvent(eventName, data);
    }

    private tracklsl24SetLimit(firstTimeSet: string, secondTimeSet: string) {
        const data = {
            setLimit: [
                {
                    'component.CategoryEvent': 'gambling controls',
                    'component.LabelEvent': 'time management - play breaks',
                    'component.ActionEvent': 'limits submit',
                    'component.PositionEvent': 'session duration',
                    'component.LocationEvent': 'in play - arc play breaks - lsl24',
                    'component.EventDetails': 'success',
                    'component.value': firstTimeSet,
                    'user.profile.accountID': this.userService.customerId,
                },
                {
                    'component.CategoryEvent': 'gambling controls',
                    'component.LabelEvent': 'time management - play breaks',
                    'component.ActionEvent': 'limits submit',
                    'component.PositionEvent': 'break duration',
                    'component.LocationEvent': 'in play - arc play breaks - lsl24',
                    'component.EventDetails': 'success',
                    'component.value': secondTimeSet,
                    'user.profile.accountID': this.userService.customerId,
                },
            ],
        };
        this.trackingService.triggerEvent('Event.OptionLoad', data);
    }

    trackLSL24TakePlayBreakYesNo(url: string, decisicion: string) {
        this.tracklsl24('Event.Tracking', 'click', 'not applicable', 'in play toaster message - lsl24', decisicion, url);
    }

    trackLSL24InterceptorLoad(playbreakset?: boolean) {
        this.tracklsl24(
            'contentView',
            'load',
            playbreakset ? 'play break set' : 'no play break set',
            'in play soft interceptor - lsl24',
            'in play soft interceptor',
            'not applicable',
        );
    }

    trackLSL24InterceptorClick(action: string, url: string, playbreakset?: boolean) {
        this.tracklsl24(
            'Event.Tracking',
            'click',
            playbreakset ? 'play break set' : 'no play break set',
            'in play soft interceptor - lsl24',
            action,
            url,
        );
    }

    trackLSL24StepLoad(action: string, details: string) {
        this.tracklsl24('contentView', 'load', 'not applicable', action, details, 'not applicable');
    }

    trackLSL24StepDrawerClick(action: string, details: string, value: string, url: string) {
        this.tracklsl24('Event.Tracking', 'click', action, details, value, url);
    }

    trackLSL24StepConfirmLoad() {
        this.tracklsl24('contentView', 'load', 'soft interceptor', 'confirmation drawer - lsl24', 'confirmation drawer', 'not applicable');
    }

    trackLSL24BreakTimePlayerSet(timePlayBreakDuration: string, timeBreakStart: string) {
        this.tracklsl24SetLimit(timePlayBreakDuration, timeBreakStart);
    }
}
