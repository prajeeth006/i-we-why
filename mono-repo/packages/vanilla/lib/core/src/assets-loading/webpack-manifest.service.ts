import { Injectable } from '@angular/core';

import { BehaviorSubject, filter, firstValueFrom } from 'rxjs';

import { HostApiService } from '../http/host-api.service';

/**
 * @whatItDoes Provides access to webpack's manifest.json entries.
 *
 * @stable
 */
@Injectable({
    providedIn: 'root',
})
export class WebpackManifestService {
    private loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private loadingStarted: boolean = false;
    private data: { [key: string]: string };

    constructor(private apiService: HostApiService) {}

    async getEntry(entry: string): Promise<string> {
        await Promise.all([this.load(), firstValueFrom(this.loaded.pipe(filter((l) => l)))]);
        return this.data[entry]!;
    }

    private async load(): Promise<void> {
        if (this.loadingStarted) return;

        this.loadingStarted = true;
        this.data = await firstValueFrom<{ [key: string]: string }>(this.apiService.get('assets/manifest'));
        this.loaded.next(true);
    }
}
