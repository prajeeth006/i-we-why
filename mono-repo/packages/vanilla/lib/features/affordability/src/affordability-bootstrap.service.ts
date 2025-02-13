import { Injectable } from '@angular/core';

import { OnFeatureInit } from '@frontend/vanilla/core';
import { LoginService } from '@frontend/vanilla/shared/login';

import { AffordabilityService } from './affordability.service';

@Injectable()
export class AffordabilityBootstrapService implements OnFeatureInit {
    constructor(
        private affordabilityService: AffordabilityService,
        private loginService: LoginService,
    ) {}

    onFeatureInit() {
        this.loginService.runAfterLogin(AffordabilityBootstrapService.name, () => this.affordabilityService.load());
    }
}
