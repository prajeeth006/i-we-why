import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { DslService, Logger, OnFeatureInit } from '@frontend/vanilla/core';
import { firstValueFrom } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import { DomainSpecificActionsConfig } from './domain-specific-actions.client-config';

@Injectable()
export class DomainSpecificActionsBootstrapService implements OnFeatureInit {
    constructor(
        private config: DomainSpecificActionsConfig,
        private readonly router: Router,
        private dslService: DslService,
        private log: Logger,
    ) {}

    async onFeatureInit() {
        await firstValueFrom(this.config.whenReady);

        this.router.events
            .pipe(
                filter((e) => e instanceof NavigationEnd),
                first(),
            )
            .subscribe(() => {
                if (this.config.dslAction) {
                    this.log.debug('Registering domain specific actions for the execution.');
                    this.dslService
                        .executeAction(this.config.dslAction)
                        .subscribe(() => this.log.debug(`${this.config.dslAction} domain specific actions executed.`));
                } else {
                    this.log.debug('No domain specific action to be executed.');
                }
            });
    }
}
