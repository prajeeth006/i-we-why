import { Injectable } from '@angular/core';

import { LoginService } from '@frontend/vanilla/shared/login';
import { SessionFundSummaryService } from '@frontend/vanilla/shared/session-fund-summary';

@Injectable()
export class SessionFundSummaryBootstrapService {
    constructor(
        private sessionFundSummaryService: SessionFundSummaryService,
        private loginService: LoginService,
    ) {}

    onFeatureInit() {
        this.loginService.runAfterLogin(SessionFundSummaryBootstrapService.name, () => this.sessionFundSummaryService.refresh());
    }
}
