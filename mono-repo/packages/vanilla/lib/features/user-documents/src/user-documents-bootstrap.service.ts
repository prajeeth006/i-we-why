import { Injectable } from '@angular/core';

import { OnFeatureInit, RtmsMessage, RtmsService, RtmsType, SofStatusDetailsCoreService } from '@frontend/vanilla/core';
import { LoginService } from '@frontend/vanilla/shared/login';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

import { UserDocumentsConfig } from './user-documents.client-config';
import { UserDocumentsService } from './user-documents.service';

@Injectable()
export class UserDocumentsBootstrapService implements OnFeatureInit {
    constructor(
        private config: UserDocumentsConfig,
        private loginService: LoginService,
        private rtmsService: RtmsService,
        private userDocumentsService: UserDocumentsService,
        private sofStatusDetailsService: SofStatusDetailsCoreService,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);

        this.loginService.runAfterLogin(UserDocumentsBootstrapService.name, () => {
            this.userDocumentsService.refresh();
            this.sofStatusDetailsService.whenReady.subscribe(() => this.sofStatusDetailsService.refresh());
        });

        this.rtmsService.messages
            .pipe(filter((e: RtmsMessage) => [RtmsType.KYC_VERIFIED_EVENT, RtmsType.KYC_REFRESH_TRIGGER_EVENT].includes(<RtmsType>e.type)))
            .subscribe(() => {
                this.userDocumentsService.refresh();
                this.sofStatusDetailsService.whenReady.subscribe(() => this.sofStatusDetailsService.refresh());
            });
    }
}
