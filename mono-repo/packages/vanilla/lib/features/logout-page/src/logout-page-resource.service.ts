import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { Observable } from 'rxjs';

@Injectable()
export class LogoutPageResourceService {
    constructor(private api: SharedFeaturesApiService) {}

    getInitData(): Observable<any> {
        return this.api.get('logout/initdata');
    }
}
