import { DynamicLayoutConfig } from '@frontend/vanilla/core';
import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

@Mock({ of: DynamicLayoutConfig })
export class DynamicLayoutConfigMock extends DynamicLayoutConfig {
    override whenReady = new Subject<void>();

    constructor() {
        super();

        this.slots = {};
    }
}
