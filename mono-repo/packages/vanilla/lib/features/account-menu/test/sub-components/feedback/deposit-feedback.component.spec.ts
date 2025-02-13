import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconCustomComponent } from '@frontend/vanilla/features/icons';
import { MockContext } from 'moxxi';
import { MockComponent } from 'ng-mocks';

import { IntlServiceMock } from '../../../../../core/test/intl/intl.mock';
import { MenuActionsServiceMock } from '../../../../../core/test/menu-actions/menu-actions.mock';
import { TrustAsHtmlPipe } from '../../../../../shared/browser/public_api';
import { DepositFeedbackComponent } from '../../../src/sub-components/feedback/deposit-feedback.component';
import { AccountMenuResourceServiceMock } from '../../account-menu-resource.mock';
import { AccountMenuRouterMock } from '../../account-menu-router.mock';
import { AccountMenuServiceMock } from '../../account-menu.mock';

describe('DepositFeedbackComponent', () => {
    let fixture: ComponentFixture<DepositFeedbackComponent>;
    let component: DepositFeedbackComponent;
    let intlServiceMock: IntlServiceMock;
    let accountMenuResourceServiceMock: AccountMenuResourceServiceMock;

    function init(days: string, currency: string) {
        accountMenuResourceServiceMock = MockContext.useMock(AccountMenuResourceServiceMock);
        intlServiceMock = MockContext.useMock(IntlServiceMock);
        MockContext.useMock(AccountMenuServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(AccountMenuRouterMock);

        TestBed.overrideComponent(DepositFeedbackComponent, {
            set: {
                imports: [TrustAsHtmlPipe, MockComponent(IconCustomComponent)],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(DepositFeedbackComponent);
        component = fixture.componentInstance;

        intlServiceMock.formatCurrency.and.returnValue(currency);

        component.item = <any>{
            name: 'depositfeedback',
            parameters: {
                'range-in-days': days,
            },
            resources: {
                GeneralDescription7Days:
                    'In <b>_RANGE_TEXT_</b>, the average player deposited <b>_DEPOSIT_</b>. Managing your deposits wisely helps maintaining a healthy gambling lifestyle.',
                GeneralDescription30Days:
                    'In the <b>_RANGE_TEXT_</b>, the average player deposited <b>_DEPOSIT_</b>. Managing your deposits wisely helps maintain a healthy gambling lifestyle.',
                PathologicalDescription7Days:
                    'In <b>_RANGE_TEXT_</b>, your deposits had been above the player average of  <b>_DEPOSIT_</b>. Setting strict deposit limits now could help manage your spending more effectively.',
                PathologicalDescription30Days:
                    'In <b>_RANGE_TEXT_</b>, your deposits had been above the player average of <b>_DEPOSIT_</b>. Setting strict deposit limits now could help manage your spending more effectively.',
                RangeText: 'last _RANGE_ days',
            },
            children: [],
        };

        fixture.detectChanges();
    }

    describe('init', () => {
        it('should be pathological user if label avg deposit is less than user deposit', () => {
            init('7', '€20.00');
            accountMenuResourceServiceMock.getAverageDeposit.next({
                labelAverageDepositAmount: 10,
                userAverageDepositAmount: 20,
            });

            expect(component.isPathological).toBeTrue();
            expect(component.description).toBe(
                'In <b>last 7 days</b>, your deposits had been above the player average of  <b>€20.00</b>. Setting strict deposit limits now could help manage your spending more effectively.',
            );
        });

        it('should be pathological user if label avg deposit is less than user deposit and set 30 days description', () => {
            init('30', '€20.00');
            accountMenuResourceServiceMock.getAverageDeposit.next({
                labelAverageDepositAmount: 10,
                userAverageDepositAmount: 20,
            });

            expect(component.isPathological).toBeTrue();
            expect(component.description).toBe(
                'In <b>last 30 days</b>, your deposits had been above the player average of <b>€20.00</b>. Setting strict deposit limits now could help manage your spending more effectively.',
            );
        });

        it('should be normal user if label avg deposit is greater than user deposit', () => {
            init('7', '€20.00');
            accountMenuResourceServiceMock.getAverageDeposit.next({
                labelAverageDepositAmount: 30,
                userAverageDepositAmount: 20,
            });

            expect(component.isPathological).toBeFalse();
            expect(component.description).toBe(
                'In <b>last 7 days</b>, the average player deposited <b>€20.00</b>. Managing your deposits wisely helps maintaining a healthy gambling lifestyle.',
            );
        });

        it('should be normal user if label avg deposit is greater than user deposit set description for 30 days', () => {
            init('30', '€20.00');

            accountMenuResourceServiceMock.getAverageDeposit.next({
                labelAverageDepositAmount: 30,
                userAverageDepositAmount: 20,
            });

            expect(component.isPathological).toBeFalse();
            expect(component.description).toBe(
                'In the <b>last 30 days</b>, the average player deposited <b>€20.00</b>. Managing your deposits wisely helps maintain a healthy gambling lifestyle.',
            );
        });
    });
});
