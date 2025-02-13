import { Injectable, inject } from '@angular/core';

import { OnFeatureInit } from '@frontend/vanilla/core';

import { SingleSignOnService } from './single-sign-on.service';

@Injectable()
export class SingleSignOnBootstrapService implements OnFeatureInit {
    private service = inject(SingleSignOnService);

    onFeatureInit() {
        this.service.setSsoToken();
    }
}
