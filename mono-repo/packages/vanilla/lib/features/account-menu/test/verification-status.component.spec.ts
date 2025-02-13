import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { VerificationStatusComponent } from '../src/sub-components/verification-status.component';
import { AccountMenuRouterMock } from './account-menu-router.mock';
import { AccountMenuTrackingServiceMock } from './account-menu-tracking.mock';
import { AccountMenuServiceMock } from './account-menu.mock';

describe('VerificationStatusComponent', () => {
    let fixture: ComponentFixture<VerificationStatusComponent>;
    let accountMenuTrackingServiceMock: AccountMenuTrackingServiceMock;

    beforeEach(() => {
        accountMenuTrackingServiceMock = MockContext.useMock(AccountMenuTrackingServiceMock);

        MockContext.useMock(AccountMenuServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(AccountMenuRouterMock);

        TestBed.overrideComponent(VerificationStatusComponent, {
            set: {
                imports: [],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(VerificationStatusComponent);
        fixture.componentInstance.item = <any>{ name: 'verify', parameters: { tooltipClass: '' }, resources: { tooltipText: '' } };
    });

    describe('ngOnInit', () => {
        it('should track', () => {
            fixture.detectChanges();

            expect(accountMenuTrackingServiceMock.trackVerificationStatusLoad).toHaveBeenCalledWith('verify');
        });
    });

    describe('toggle', () => {
        it('should track status click and tooltip load', () => {
            fixture.componentInstance.toggle();

            expect(accountMenuTrackingServiceMock.trackVerificationStatusClick).toHaveBeenCalled();
            expect(accountMenuTrackingServiceMock.trackVerificationStatusTooltipLoad).toHaveBeenCalledWith('verify downboard');
        });
    });
});
