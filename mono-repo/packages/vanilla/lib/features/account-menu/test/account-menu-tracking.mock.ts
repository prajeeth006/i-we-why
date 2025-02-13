import { Mock, Stub } from 'moxxi';

import { AccountMenuTrackingService } from '../src/account-menu-tracking.service';

@Mock({ of: AccountMenuTrackingService })
export class AccountMenuTrackingServiceMock {
    @Stub() trackOpen: jasmine.Spy;
    @Stub() trackClose: jasmine.Spy;
    @Stub() trackDrawer: jasmine.Spy;
    @Stub() trackTaskSwiped: jasmine.Spy;
    @Stub() trackTaskStack: jasmine.Spy;
    @Stub() trackShowAll: jasmine.Spy;
    @Stub() trackTaskClosed: jasmine.Spy;
    @Stub() trackOnboardingLoad: jasmine.Spy;
    @Stub() trackNextOnboarding: jasmine.Spy;
    @Stub() trackPreviousOnboarding: jasmine.Spy;
    @Stub() trackGotItOnboarding: jasmine.Spy;
    @Stub() trackCloseOnboarding: jasmine.Spy;
    @Stub() trackStartOnboarding: jasmine.Spy;
    @Stub() replacePlaceholders: jasmine.Spy;
    @Stub() trackBalanceArrowClicked: jasmine.Spy;
    @Stub() trackTaskOpenProfile: jasmine.Spy;
    @Stub() trackTasksLoaded: jasmine.Spy;
    @Stub() trackVerificationStatusLoad: jasmine.Spy;
    @Stub() trackVerificationStatusClick: jasmine.Spy;
    @Stub() trackVerificationStatusTooltipLoad: jasmine.Spy;
    @Stub() trackLabelSwitcherMenuClicked: jasmine.Spy;
}
