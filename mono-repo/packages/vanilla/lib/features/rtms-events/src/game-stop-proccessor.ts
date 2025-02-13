import { Injectable, inject } from '@angular/core';

import { AuthService, EventContext, EventProcessor, EventType, LoginService2, RtmsType } from '@frontend/vanilla/core';

@Injectable()
export class GameStopProcessor implements EventProcessor {
    private authService = inject(AuthService);
    private loginService = inject(LoginService2);

    async process(event: EventContext<any>) {
        if (event.type !== EventType.Rtms) {
            return;
        }

        switch (event.name) {
            case RtmsType.GAMPROTECT_ACCOUNT_MATCH:
                this.logout('gamprotect');
                break;
            case RtmsType.GAMSTOP_ACCOUNT_MATCH:
                this.logout('gamstop');
                break;
        }
    }

    private async logout(loginMessageKey: string) {
        await this.authService.logout({ redirectAfterLogout: false, isAutoLogout: true });
        await this.loginService.goTo({ loginMessageKey: loginMessageKey, forceReload: true });
    }
}
