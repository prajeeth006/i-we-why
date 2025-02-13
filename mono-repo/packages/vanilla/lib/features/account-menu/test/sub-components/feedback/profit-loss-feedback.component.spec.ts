import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';
import { MockComponent } from 'ng-mocks';

import { IntlServiceMock } from '../../../../../core/test/intl/intl.mock';
import { MenuActionsServiceMock } from '../../../../../core/test/menu-actions/menu-actions.mock';
import { TrustAsHtmlPipe } from '../../../../../shared/browser/public_api';
import { IconCustomComponent } from '../../../../icons/src/icon-fast.component';
import { ProfitLossFeedbackComponent } from '../../../src/sub-components/feedback/profit-loss-feedback.component';
import { AccountMenuRouterMock } from '../../account-menu-router.mock';
import { AccountMenuServiceMock } from '../../account-menu.mock';

describe('ProfitLossFeedbackComponent', () => {
    let fixture: ComponentFixture<ProfitLossFeedbackComponent>;
    let component: ProfitLossFeedbackComponent;
    let intlServiceMock: IntlServiceMock;

    function init(data: any, currency: string, days: string) {
        intlServiceMock = MockContext.useMock(IntlServiceMock);
        MockContext.useMock(AccountMenuServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(AccountMenuRouterMock);

        TestBed.overrideComponent(ProfitLossFeedbackComponent, {
            set: {
                imports: [TrustAsHtmlPipe, MockComponent(IconCustomComponent)],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(ProfitLossFeedbackComponent);
        component = fixture.componentInstance;

        component.data = data;
        intlServiceMock.formatCurrency.and.returnValue(currency);

        component.item = <any>{
            name: 'profitlossfeedback',
            parameters: {
                'range-in-days': days,
            },
            resources: {
                GeneralDescription7Days:
                    'In <b>_RANGE_TEXT_</b>, the average player lost <b>_LOSS_</b>. Chances of winning do not increase with the amount of money bet.',
                GeneralDescription30Days:
                    'In the <b>_RANGE_TEXT_</b>, the average player lost <b>_LOSS_</b>. Remember, more frequent play does not necessarily lead to more wins.',
                PathologicalDescription7Days:
                    'In <b>_RANGE_TEXT_</b>, your losses were <b>_LOSS-PER_</b> higher than the player average loss of <b>_LOSS_</b>. Think about setting limits to better manage your spending.',
                PathologicalDescription30Days:
                    'In <b>_RANGE_TEXT_</b>, your losses were <b>_LOSS-PER_</b> higher than the player average loss of <b>_LOSS_</b>. Think about setting limits to better manage your spending.',
                RangeText: 'last _RANGE_ days',
                TimesText: 'times',
            },
            children: [],
        };

        fixture.detectChanges();
    }

    describe('init', () => {
        it('should be pathological user if weekly avg is less than loss', () => {
            const data = {
                monthlyAverage: 300,
                totalReturn: 345,
                totalStake: 456,
                weeklyAverage: 75,
                yearlyAverage: 3600,
            };
            init(data, '€75.00', '7');

            expect(component.isPathological).toBeTrue();
            expect(component.description).toBe(
                'In <b>last 7 days</b>, your losses were <b>48%</b> higher than the player average loss of <b>€75.00</b>. Think about setting limits to better manage your spending.',
            );
        });

        it('should be pathological user and description is in x times if loss is greater than 100%', () => {
            const data = {
                monthlyAverage: 300,
                totalReturn: 345,
                totalStake: 456,
                weeklyAverage: 40,
                yearlyAverage: 3600,
            };
            init(data, '€75.00', '7');

            expect(component.isPathological).toBeTrue();
            expect(component.description).toBe(
                'In <b>last 7 days</b>, your losses were <b>1.77 times </b> higher than the player average loss of <b>€75.00</b>. Think about setting limits to better manage your spending.',
            );
        });

        it('should be pathological user and should set 30 days description', () => {
            const data = {
                monthlyAverage: 100,
                totalReturn: 345,
                totalStake: 456,
                weeklyAverage: 75,
                yearlyAverage: 3600,
            };
            init(data, '€75.00', '30');

            expect(component.isPathological).toBeTrue();
            expect(component.description).toBe(
                'In <b>last 30 days</b>, your losses were <b>11%</b> higher than the player average loss of <b>€75.00</b>. Think about setting limits to better manage your spending.',
            );
        });

        it('should not be pathological user if loss is less than weekly avg', () => {
            const data = {
                monthlyAverage: 300,
                totalReturn: 440,
                totalStake: 456,
                weeklyAverage: 130,
                yearlyAverage: 3600,
            };
            init(data, '€130.00', '7');

            expect(component.isPathological).toBeFalse();
        });

        it('should not be pathological user if weekly avg is greater than loss', () => {
            const data = {
                monthlyAverage: 300,
                totalReturn: 345,
                totalStake: 456,
                weeklyAverage: 130,
                yearlyAverage: 3600,
            };
            init(data, '€130.00', '7');

            expect(component.isPathological).toBeFalse();
            expect(component.description).toBe(
                'In <b>last 7 days</b>, the average player lost <b>€130.00</b>. Chances of winning do not increase with the amount of money bet.',
            );
        });

        it('should not be pathological user and should set 30 days description', () => {
            const data = {
                monthlyAverage: 300,
                totalReturn: 345,
                totalStake: 456,
                weeklyAverage: 75,
                yearlyAverage: 3600,
            };
            init(data, '€75.00', '30');

            expect(component.isPathological).toBeFalse();
            expect(component.description).toBe(
                'In the <b>last 30 days</b>, the average player lost <b>€75.00</b>. Remember, more frequent play does not necessarily lead to more wins.',
            );
        });
    });
});
