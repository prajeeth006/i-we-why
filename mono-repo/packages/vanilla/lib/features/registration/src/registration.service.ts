import { Injectable } from '@angular/core';

import { SharedFeaturesApiService, UserService } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable, first } from 'rxjs';

import { RegistrationInformation } from './registration.models';

@Injectable({
    providedIn: 'root',
})
export class RegistrationService {
    private registrationInformationEvents = new BehaviorSubject<RegistrationInformation | null>(null);

    get registrationInformation(): Observable<RegistrationInformation | null> {
        return this.registrationInformationEvents;
    }

    constructor(
        private apiService: SharedFeaturesApiService,
        private user: UserService,
    ) {}

    load() {
        if (this.user.isAuthenticated) {
            this.apiService
                .get('registrationinfo')
                .pipe(first())
                .subscribe((info: RegistrationInformation) => {
                    this.registrationInformationEvents.next(info);
                });
        }
    }
}
