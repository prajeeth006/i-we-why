import { Pipe, PipeTransform } from '@angular/core';

import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { ClockConfig } from '../src/clock.client-config';

@Mock({ of: ClockConfig })
export class ClockConfigMock extends ClockConfig {
    override whenReady: Subject<void> = new Subject<void>();
    constructor() {
        super();

        this.slotName;
        this.dateTimeFormat;
    }
}

@Pipe({ standalone: true, name: 'vnTotalTime' })
export class FakeTotalTimePipe implements PipeTransform {
    transform(value: any) {
        return value;
    }
}
