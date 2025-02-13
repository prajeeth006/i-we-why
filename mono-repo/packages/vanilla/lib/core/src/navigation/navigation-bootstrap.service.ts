import { Injectable } from '@angular/core';

import { OnAppInit } from '../bootstrap/bootstrapper.service';
import { NavigationService } from './navigation.service';

@Injectable()
export class NavigationBootstrapService implements OnAppInit {
    constructor(private navigationService: NavigationService) {}

    onAppInit() {
        this.navigationService.init();
    }
}
