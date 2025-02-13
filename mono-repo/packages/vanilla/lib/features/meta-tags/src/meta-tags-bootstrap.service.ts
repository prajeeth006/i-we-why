import { Injectable } from '@angular/core';

import { MetaTagsService as CoreMetaTagsService, OnFeatureInit } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';

import { MetaTagsConfig } from './meta-tags.client-config';
import { MetaTagsService } from './meta-tags.service';

@Injectable()
export class MetaTagsBootstrapService implements OnFeatureInit {
    constructor(
        private config: MetaTagsConfig,
        private metaTagsService: MetaTagsService,
        private coreMetaTagsService: CoreMetaTagsService,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);
        this.metaTagsService.initialize();
        this.coreMetaTagsService.set(this.metaTagsService);
    }
}
