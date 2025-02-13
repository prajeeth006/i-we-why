import { GenericListItem } from '@frontend/vanilla/core';
import { Mock } from 'moxxi';
import { Subject } from 'rxjs';

import { ConfirmPopupConfig } from '../src/confirm-popup.client-config';

@Mock({ of: ConfirmPopupConfig })
export class ConfirmPopupConfigMock {
    whenReady = new Subject<void>();
    resources: GenericListItem;
}
