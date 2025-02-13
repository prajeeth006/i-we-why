import { Injectable } from '@angular/core';

import { shareReplay } from 'rxjs';

import { RacingConfiguration } from '../../models/racing-configuration/racing-configuration.model';
import { HttpService } from '../http.service';

@Injectable({
    providedIn: 'root',
})
export class RacingConfigurationService {
    designConfiguration$ = this.httpService.get<RacingConfiguration>('en/api/getRacingConfiguration').pipe(shareReplay());
    constructor(private httpService: HttpService) {}
}
