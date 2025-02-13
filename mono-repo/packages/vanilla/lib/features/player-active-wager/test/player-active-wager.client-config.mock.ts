import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { PlayerActiveWagerConfig } from '../src/player-active-wager.client-config';

@Mock({ of: PlayerActiveWagerConfig })
export class PlayerActiveWagerConfigMock extends PlayerActiveWagerConfig {
    override whenReady = new Subject<void>();
    constructor() {
        super();

        this.content = {
            text: '<p>&nbsp;Your details</p>',
            title: 'Active in Lugas',
            messages: {
                ElapsedLugasText: 'Sessiondauer:',
                ElapsedTime: 'Elapsed Time',
                Hours: 'HRS',
                Minutes: 'MIN',
                Seconds: 'SEC',
            },
        };

        this.gotItCta = <any>{
            text: 'I Got it',
            name: 'ctabutton',
            parameters: {},
            resources: {},
            viewBox: '0 0 16 16',
            defaultAnimation: false,
        };
    }
}
