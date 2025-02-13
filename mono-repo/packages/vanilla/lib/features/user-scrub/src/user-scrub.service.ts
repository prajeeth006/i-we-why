import { Injectable } from '@angular/core';

import { SharedFeaturesApiService } from '@frontend/vanilla/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable()
export class UserScrubService {
    private productsEvents = new BehaviorSubject<string[] | null>(null);

    get products(): Observable<string[] | null> {
        return this.productsEvents;
    }

    constructor(private apiService: SharedFeaturesApiService) {}

    load() {
        this.apiService
            .get('userscrub')
            .pipe(map((result) => result.products))
            .subscribe((products: string[]) => {
                this.productsEvents.next(products);
            });
    }
}
