import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { TimeSpan } from '@frontend/vanilla/core';
import { FormatPipe } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';
import { of } from 'rxjs';

import { TrackingServiceMock } from '../../../../../core/src/tracking/test/tracking.mock';
import { IntlServiceMock } from '../../../../../core/test/intl/intl.mock';
import { MenuActionsServiceMock } from '../../../../../core/test/menu-actions/menu-actions.mock';
import { FakeTotalTimePipe } from '../../../../clock/test/clock.mock';
import { SessionSummary, SessionSummaryData } from '../../../src/account-menu.models';
import { TimeSpentWidgetComponent } from '../../../src/sub-components/widgets/time-spent-widget.component';
import { AccountMenuResourceServiceMock } from '../../account-menu-resource.mock';
import { AccountMenuRouterMock } from '../../account-menu-router.mock';
import { AccountMenuServiceMock } from '../../account-menu.mock';

describe('TimeSpentWidgetComponent', () => {
    let fixture: ComponentFixture<TimeSpentWidgetComponent>;
    let component: TimeSpentWidgetComponent;
    let accountMenuResourceServiceMock: AccountMenuResourceServiceMock;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        accountMenuResourceServiceMock = MockContext.useMock(AccountMenuResourceServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        MockContext.useMock(IntlServiceMock);
        MockContext.useMock(AccountMenuServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(AccountMenuRouterMock);

        TestBed.overrideComponent(TimeSpentWidgetComponent, {
            set: {
                imports: [CommonModule, FakeTotalTimePipe, FormatPipe],
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(TimeSpentWidgetComponent);
        component = fixture.componentInstance;
        component.item = <any>{
            name: 'name',
            parameters: {
                aggregationType: 'weekly',
                averagePeriodThresholdInMinutes: '5',
                showAverageTimeSpent: 'true',
            },
            resources: {
                'bingo': 'Bingo',
                'sportsbook': 'Sports',
                'casino': 'Casino',
                'poker': 'Poker',
                'bingo-color-class': 'testClass',
                'sportsbook-color-class': 'testClass',
                'casino-color-class': 'testClass',
                'poker-color-class': 'testClass',
                'Description': 'Daily average',
                'DAILY': 'Daily',
                'WEEKLY': 'Weekly',
                'YEARLY': 'Yearly',
                'WeekOf': 'Week of',
            },
            children: [],
            text: 'TimeSpent',
            trackEvent: {
                'LoadedEvent.component.PositionEvent': 'test',
            },
        };
    });

    describe('init', () => {
        it('should initialize properties', fakeAsync(() => {
            init(62);

            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith(
                {
                    'LoadedEvent.component.PositionEvent': 'test',
                },
                'LoadedEvent',
            );

            expect(component.aggregationTypeText).toBe('Week of 11-17 February');
            expect(component.activeTimeSpent).toEqual(TimeSpan.fromMinutes(62));
            expect(component.isBelowActiveTimeThreshold).toBeFalse();
            expect(component.percentByProduct).toEqual([
                { product: 'Bingo', colorClass: 'testClass', percentage: 25 },
                { product: 'Sports', colorClass: 'testClass', percentage: 25 },
                { product: 'Casino', colorClass: 'testClass', percentage: 25 },
                { product: 'Poker', colorClass: 'testClass', percentage: 25 },
            ]);

            expect(component.hideSkeleton).toBeTrue();
        }));

        it('should have fixed aggregation period', fakeAsync(() => {
            component.item.resources.FixedAggregationPeriod = 'Last 7 days';
            init(1);

            expect(component.aggregationTypeText).toBe('Last 7 days');
            expect(component.activeTimeSpent).toEqual(TimeSpan.fromMinutes(1));
            expect(component.isBelowActiveTimeThreshold).toBeTrue();
            expect(component.percentByProduct).toEqual([]);
        }));

        it('should show total time spent', () => {
            component.item.parameters.showAverageTimeSpent = '';

            init(55);

            expect(component.activeTimeSpent).toEqual(TimeSpan.fromMinutes(55 * 7));
        });
    });

    function init(currentAverage: number) {
        accountMenuResourceServiceMock.getTimeSpent.and.returnValue(
            of({
                aggregationType: 'WEEKLY',
                sessionSummary: {
                    currentAverage,
                    productCumulative: {
                        active: {
                            bingo: 10,
                            sportsbook: 10,
                            casino: 10,
                            poker: 10,
                        },
                    },
                } as SessionSummaryData,
                startDate: '2022-02-11T06:45:02Z',
                endDate: '2022-02-18T06:45:02Z',
            } as SessionSummary),
        );

        fixture.detectChanges();
    }
});
