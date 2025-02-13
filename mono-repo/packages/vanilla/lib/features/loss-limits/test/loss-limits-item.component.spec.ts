import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { LossLimitsItemComponent } from '../src/loss-limits-item.component';
import { LossLimitsType } from '../src/loss-limits.models';
import { LossLimitsConfigMock } from './loss-limits.mock';

describe('LossLimitsItemComponent', () => {
    let fixture: ComponentFixture<LossLimitsItemComponent>;
    let lossLimitsConfigMock: LossLimitsConfigMock;

    beforeEach(() => {
        lossLimitsConfigMock = MockContext.useMock(LossLimitsConfigMock);

        TestBed.overrideComponent(LossLimitsItemComponent, {
            set: {
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        lossLimitsConfigMock.content = {};
        fixture = TestBed.createComponent(LossLimitsItemComponent);

        fixture.componentRef.setInput('item', {
            notificationType: LossLimitsType.DailyLimit,
            playerLimitAmount: 10.00001,
            totalLossAmount: 8.51111,
            pendingLossAmount: 2.56,
            currency: 'JPY',
            usedPercentage: 80.001,
            isMandatory: false,
        });

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should set title, limits and percentage used', () => {
            expect(fixture.componentInstance.usedPercentage()).toBe(80);
        });
    });
});
