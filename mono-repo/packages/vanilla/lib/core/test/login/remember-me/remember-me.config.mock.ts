import { RememberMeConfig } from '@frontend/vanilla/core';
import { Mock } from 'moxxi';

@Mock({ of: RememberMeConfig })
export class RememberMeConfigMock extends RememberMeConfig {}
