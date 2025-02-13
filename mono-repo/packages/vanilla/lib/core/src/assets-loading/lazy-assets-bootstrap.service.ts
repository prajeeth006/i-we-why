import { Injectable } from '@angular/core';

import { firstValueFrom } from 'rxjs';

import { OnAppInit } from '../bootstrap/bootstrapper.service';
import { MediaQueryService } from '../browser/media-query.service';
import { HostApiService } from '../http/host-api.service';
import { LazyAsset } from './lazy-assets.client-config';
import { ScriptsService } from './scripts.service';
import { StylesService } from './styles.service';

@Injectable()
export class LazyAssetsBootstrapService implements OnAppInit {
    private notYetLoadedInitialStyles: LazyAsset[] = [];
    private notYetLoadedInitialScripts: LazyAsset[] = [];

    constructor(
        private styleService: StylesService,
        private scriptService: ScriptsService,
        private apiService: HostApiService,
        private mediaQueryService: MediaQueryService,
    ) {}

    onAppInit() {
        firstValueFrom(this.apiService.get('assets')).then((data: { scripts: LazyAsset[]; stylesheets: LazyAsset[] }) => {
            this.styleService.init(data.stylesheets);
            this.scriptService.init(data.scripts);
            this.loadStyles(data.stylesheets);
            this.loadScripts(data.scripts);
        });

        this.mediaQueryService.observe().subscribe(() => {
            const styles = this.notYetLoadedInitialStyles;
            const scripts = this.notYetLoadedInitialScripts;
            this.notYetLoadedInitialStyles = [];
            this.notYetLoadedInitialScripts = [];

            styles.forEach((s) => this.loadInitialStyle(s));
            scripts.forEach((s) => this.loadInitialScript(s));
        });
    }

    private loadStyles(stylesheets: LazyAsset[]) {
        const importantStyles = stylesheets.filter((s) => s.lazyLoad === 'Important');
        const secondaryStyles = stylesheets.filter((s) => s.lazyLoad === 'Secondary');

        const promise = Promise.all(importantStyles.map((s) => this.loadInitialStyle(s)));
        promise.then(() => secondaryStyles.forEach((s) => this.loadInitialStyle(s)));

        return promise;
    }

    private loadScripts(scripts: LazyAsset[]) {
        const importantScripts = scripts.filter((s) => s.lazyLoad === 'Important');
        const secondaryScripts = scripts.filter((s) => s.lazyLoad === 'Secondary');

        const promise = Promise.all(importantScripts.map((s) => this.loadInitialScript(s)));
        promise.then(() => secondaryScripts.forEach((s) => this.loadInitialScript(s)));

        return promise;
    }

    private async loadInitialStyle(style: LazyAsset): Promise<void> {
        if (!style.media || this.mediaQueryService.isActive(style.media)) {
            return this.styleService.load(style.url);
        } else {
            this.notYetLoadedInitialStyles.push(style);
            return Promise.resolve();
        }
    }

    private async loadInitialScript(script: LazyAsset): Promise<void> {
        if (!script.media || this.mediaQueryService.isActive(script.media)) {
            return this.scriptService.load(script.url);
        } else {
            this.notYetLoadedInitialScripts.push(script);
            return Promise.resolve();
        }
    }
}
