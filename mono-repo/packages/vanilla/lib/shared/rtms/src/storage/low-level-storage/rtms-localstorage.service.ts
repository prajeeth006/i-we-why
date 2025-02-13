import { Injectable } from '@angular/core';

import { LocalStoreService } from '@frontend/vanilla/core';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RtmsLocalStoreService {
    constructor(private localstorage: LocalStoreService) {}

    get<T>(key: string): Observable<T> {
        return of(this.localstorage.get<T>(key)!);
    }

    set<T>(key: string, value: T): void {
        value ? this.localstorage.set(key, value) : this.localstorage.remove(key);
    }

    remove(key: string): void {
        this.localstorage.remove(key);
    }
}
