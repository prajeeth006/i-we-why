import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VanillaEventNames } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../../core/src/tracking/test/tracking.mock';
import { EventsServiceMock } from '../../../../core/src/utils/test/utils.mock';
import { MenuActionsServiceMock } from '../../../../core/test/menu-actions/menu-actions.mock';
import { AccountMenuHotspotComponent } from '../../src/onboarding/account-menu-hotspot.component';
import { AccountMenuOnboardingServiceMock } from '../account-menu-data.mock';
import { AccountMenuRouterMock } from '../account-menu-router.mock';
import { AccountMenuServiceMock } from '../account-menu.mock';
import { AccountMenuConfigMock } from '../menu-content.mock';

@Component({
    standalone: true,
    selector: 'vn-popper-content',
    template: '',
})
export class TestPopperContentComponent {
    close = jasmine.createSpy('close');
}

describe('AccountMenuHotspotComponent', () => {
    let fixture: ComponentFixture<AccountMenuHotspotComponent>;
    let component: AccountMenuHotspotComponent;
    let eventsServiceMock: EventsServiceMock;

    beforeEach(() => {
        eventsServiceMock = MockContext.useMock(EventsServiceMock);
        MockContext.useMock(AccountMenuServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(AccountMenuRouterMock);
        MockContext.useMock(AccountMenuConfigMock);
        MockContext.useMock(AccountMenuOnboardingServiceMock);
        MockContext.useMock(TrackingServiceMock);

        TestBed.overrideComponent(AccountMenuHotspotComponent, {
            set: {
                imports: [],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(AccountMenuHotspotComponent);
        component = fixture.componentInstance;
        component.popper = TestBed.createComponent(TestPopperContentComponent).componentInstance as any;
    });

    it('on event', () => {
        eventsServiceMock.events.next({ eventName: VanillaEventNames.OpenOnboardingTour });

        expect(component.popper.close).toHaveBeenCalled();
    });
});
