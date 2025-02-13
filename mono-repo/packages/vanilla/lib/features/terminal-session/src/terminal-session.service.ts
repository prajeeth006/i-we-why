import { Injectable, inject } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { Observable } from 'rxjs';

import { TerminalSession } from './terminal-session.models';

@Injectable({
    providedIn: 'root',
})
export class TerminalSessionService {
    private sharedFeaturesApiService = inject(SharedFeaturesApiService);

    get terminalSession(): Observable<TerminalSession> {
        return this.sharedFeaturesApiService.get('retail/terminalsession');
    }
}
