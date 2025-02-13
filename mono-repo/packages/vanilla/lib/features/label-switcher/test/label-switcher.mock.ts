import { Mock, Stub } from 'moxxi';

import { LabelSwitcherTrackingService } from '../src/label-switcher-tracking.service';
import { LabelSwitcherConfig } from '../src/label-switcher.client-config';
import { LabelSwitcherItem } from '../src/label-switcher.models';
import { LabelSwitcherService } from '../src/label-switcher.service';

@Mock({ of: LabelSwitcherService })
export class LabelSwitcherServiceMock {
    currentLabelItem: LabelSwitcherItem = {
        text: 'Indiana',
        isActive: true,
        name: 'in.com',
        region: 'Indi',
        regionCode: 'IN',
        country: 'US',
        url: 'sports.ini.com',
    };
    currentGeoLocationItem: LabelSwitcherItem = this.currentLabelItem;
    items: LabelSwitcherItem[] = [];
    @Stub() switchLabel: jasmine.Spy;
}

@Mock({ of: LabelSwitcherConfig })
export class LabelSwitcherConfigMock extends LabelSwitcherConfig {}

@Mock({ of: LabelSwitcherTrackingService })
export class LabelSwitcherTrackingServiceMock {
    @Stub() trackConfirmationOverlay: jasmine.Spy;
    @Stub() trackDropDown: jasmine.Spy;
    @Stub() trackOutOfStateDeposit: jasmine.Spy;
}
