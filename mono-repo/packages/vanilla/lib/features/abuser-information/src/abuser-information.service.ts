import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AbuserInformation } from './abuser-information.models';

@Injectable({
    providedIn: 'root',
})
export class AbuserInformationService {
    private abuserInformationEvents = new BehaviorSubject<AbuserInformation | null>(null);

    get abuserInformation(): Observable<AbuserInformation | null> {
        return this.abuserInformationEvents;
    }

    constructor(private apiService: SharedFeaturesApiService) {}

    load() {
        this.apiService.get('abuserinformation').subscribe((info: AbuserInformation) => {
            this.abuserInformationEvents.next(info);
        });
    }
}
