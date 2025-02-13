import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * @experimental
 */
@Injectable({
    providedIn: 'root',
})
export class CryptoResourceService {
    constructor(private api: SharedFeaturesApiService) {}

    encrypt(data: string, purpose: string): Observable<string> {
        return this.api.get('crypto/encrypt', { data, purpose }).pipe(map((response: { result: string }) => response?.result));
    }

    decrypt(data: string, purpose: string): Observable<string> {
        return this.api.get('crypto/decrypt', { data, purpose }).pipe(map((response: { result: string }) => response?.result));
    }
}
