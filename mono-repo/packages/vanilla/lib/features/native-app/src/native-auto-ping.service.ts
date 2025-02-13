import { HttpResponse } from '@angular/common/http';
import { Injectable, NgZone, inject } from '@angular/core';

import {
    NativeAppService,
    NavigationService,
    SharedFeaturesApiService,
    UserEvent,
    UserLoginEvent,
    UserService,
    WebWorkerService,
    WorkerType,
} from '@frontend/vanilla/core';
import { filter } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class NativeAutoPingService {
    private apiService = inject(SharedFeaturesApiService);
    private webWorkerService = inject(WebWorkerService);
    private navigationService = inject(NavigationService);
    private user = inject(UserService);
    private nativeAppService = inject(NativeAppService);
    private zone = inject(NgZone);

    init() {
        if (this.user.isAuthenticated) {
            this.initPing();
        }

        this.user.events.pipe(filter((e: UserEvent) => e instanceof UserLoginEvent)).subscribe(() => this.initPing());
    }

    private initPing() {
        this.webWorkerService.createWorker(WorkerType.NativeAutoPingInterval, { interval: 360000 }, () => this.zone.run(() => this.ping()));
    }

    private ping() {
        this.apiService.get('ping', null, { prefix: '', resolveWithFullResponse: true }).subscribe({
            error: (res: HttpResponse<any>) => {
                if ([401, 403].indexOf(res.status) > -1) {
                    this.webWorkerService.removeWorker(WorkerType.NativeAutoPingInterval);

                    if (this.nativeAppService.isNativeApp) {
                        this.navigationService.goToNativeApp();
                    }
                }
            },
        });
    }
}
