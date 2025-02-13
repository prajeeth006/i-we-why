import { Injectable } from '@angular/core';

import { OnFeatureInit } from '@frontend/vanilla/core';

import { UserFlagsService } from './user-flags.service';

@Injectable()
export class UserFlagsBootstrapService implements OnFeatureInit {
    constructor(private userFlagsService: UserFlagsService) {}

    onFeatureInit() {
        this.userFlagsService.load();
    }
}
