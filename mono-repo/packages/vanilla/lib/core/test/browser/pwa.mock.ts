import { PWAService } from '@frontend/vanilla/core';
import { Mock } from 'moxxi';

@Mock({ of: PWAService })
export class PWAServiceMock {
    isStandaloneApp: boolean;
}
