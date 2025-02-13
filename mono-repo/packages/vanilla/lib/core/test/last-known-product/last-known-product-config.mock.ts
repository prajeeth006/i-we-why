import { LastKnownProductConfig } from '@frontend/vanilla/core';
import { Mock } from 'moxxi';

@Mock({ of: LastKnownProductConfig })
export class LastKnownProductConfigMock {
    url: string;
    product: string;
    enabled: string;
}
