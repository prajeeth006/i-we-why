import { Injectable } from '@angular/core';

import { DslEnvService, DslService, OnFeatureInit, StylesService } from '@frontend/vanilla/core';
import { debounceTime, firstValueFrom } from 'rxjs';

import { CssOverride, CssOverridesConfig } from './css-overrides.client-config';

@Injectable()
export class CssOverridesBootstrapService implements OnFeatureInit {
    constructor(
        private dslEnvService: DslEnvService,
        private dslService: DslService,
        private stylesService: StylesService,
        private config: CssOverridesConfig,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);
        this.dslEnvService.change.pipe(debounceTime(100)).subscribe(async () => {
            await this.show();
        });
        await this.show();
    }

    private async show() {
        for (const item of this.config.items) {
            if (!item.condition) {
                this.add(item);
                continue;
            }
            const enabled = await firstValueFrom(this.dslService.evaluateExpression(item.condition));
            if (enabled) {
                await this.add(item);
                continue;
            }
            this.remove(item);
        }
    }

    private async add(item: CssOverride) {
        await this.stylesService.addStyle(item.id, item.content);
    }

    private remove(item: CssOverride) {
        this.stylesService.removeStyle(item.id);
    }
}
