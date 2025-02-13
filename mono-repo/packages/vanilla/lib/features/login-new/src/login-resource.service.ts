import { Injectable } from '@angular/core';

import { ApiOptions, SharedFeaturesApiService } from '@frontend/vanilla/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoginResourceService {
    constructor(private api: SharedFeaturesApiService) {}

    login(data: any, options?: ApiOptions): Observable<any> {
        return this.api.post('login', data, options);
    }
}
