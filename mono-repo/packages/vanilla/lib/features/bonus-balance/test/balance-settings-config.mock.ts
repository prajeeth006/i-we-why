import { BalanceSettingsConfig } from '@frontend/vanilla/core';
import { Mock } from 'moxxi';

@Mock({ of: BalanceSettingsConfig })
export class BalanceSettingsConfigMock extends BalanceSettingsConfig {
    constructor() {
        super();
        this.lowThresholds = {};
    }
}
