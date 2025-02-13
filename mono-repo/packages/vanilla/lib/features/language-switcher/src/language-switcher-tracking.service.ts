import { Injectable } from '@angular/core';

import { TrackingService } from '@frontend/vanilla/core';

@Injectable({
    providedIn: 'root',
})
export class LanguageSwitcherTrackingService {
    constructor(private trackingService: TrackingService) {}

    trackDisplay(openedByLanguageSelector: boolean) {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'language selector',
            'component.LabelEvent': openedByLanguageSelector ? 'standard language selector' : 'default language selector',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': openedByLanguageSelector ? 'not applicable' : 'pop up',
            'component.EventDetails': 'language selector',
            'component.URLClicked': 'not applicable',
        });
    }

    trackChangeLanguage(openedByLanguageSelector: boolean, previousLang: string, newLang: string) {
        return this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'language selector',
            'component.LabelEvent': openedByLanguageSelector ? 'standard language selector' : 'default language selector',
            'component.ActionEvent': 'select',
            'component.PositionEvent': previousLang,
            'component.LocationEvent': openedByLanguageSelector ? 'standard language selector' : 'not applicable',
            'component.EventDetails': newLang,
            'component.URLClicked': 'not applicable',
        });
    }

    trackOpenLanguageSwitcherMenu() {
        this.trackingService.triggerEvent('Event.Tracking', {
            'component.CategoryEvent': 'language selector',
            'component.LabelEvent': 'standard language selector',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'not applicable',
            'component.EventDetails': 'language selector',
            'component.URLClicked': 'not applicable',
        });
    }
}
