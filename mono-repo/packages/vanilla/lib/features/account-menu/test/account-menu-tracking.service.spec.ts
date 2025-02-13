import { TestBed } from '@angular/core/testing';

import { CookieDBService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { AccountMenuTrackingService } from '../src/account-menu-tracking.service';
import { AccountMenuDataServiceMock, AccountMenuOnboardingServiceMock, AccountMenuTasksServiceMock } from './account-menu-data.mock';

describe('AccountMenuTrackingService', () => {
    let service: AccountMenuTrackingService;
    let accountMenuTasksServiceMock: AccountMenuTasksServiceMock;
    let trackingServiceMock: TrackingServiceMock;
    const items = [
        <any>{
            name: 'item1',
            parameters: {},
            trackEvent: {
                'LoadedEvent.component.EventDetails': 'Sof details - ',
            },
        },
        <any>{
            name: 'item2',
            parameters: {},
            trackEvent: {
                'LoadedEvent.component.EventDetails': 'account menu - ',
            },
        },
    ];

    beforeEach(() => {
        accountMenuTasksServiceMock = MockContext.useMock(AccountMenuTasksServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        MockContext.useMock(AccountMenuOnboardingServiceMock);
        MockContext.useMock(AccountMenuDataServiceMock);
        MockContext.useMock(NavigationServiceMock);

        TestBed.configureTestingModule({
            providers: [CookieDBService, MockContext.providers, AccountMenuTrackingService],
        });

        accountMenuTasksServiceMock.isUrgent.and.returnValue(true);
        accountMenuTasksServiceMock.totalCount = 5;
        accountMenuTasksServiceMock.totalUrgentCount = 2;
        service = TestBed.inject(AccountMenuTrackingService);
    });

    describe('trackTasksLoaded', () => {
        it('urgent tasks', () => {
            service.trackTasksLoaded(items);

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.PendingTaskLoad', {
                pending_tasks: [
                    {
                        'component.CategoryEvent': 'my profile',
                        'component.LabelEvent': 'my hub',
                        'component.ActionEvent': 'load',
                        'component.PositionEvent': 'urgent tasks 2',
                        'component.LocationEvent': 'my pending tasks tile',
                        'component.EventDetails': 'Sof details - urgent',
                    },
                    {
                        'component.CategoryEvent': 'my profile',
                        'component.LabelEvent': 'my hub',
                        'component.ActionEvent': 'load',
                        'component.PositionEvent': 'urgent tasks 2',
                        'component.LocationEvent': 'my pending tasks tile',
                        'component.EventDetails': 'account menu - urgent',
                    },
                ],
            });
        });

        it('non urgent tasks', () => {
            accountMenuTasksServiceMock.isUrgent.and.returnValue(false);
            service.trackTasksLoaded(items);

            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.PendingTaskLoad', {
                pending_tasks: [
                    {
                        'component.CategoryEvent': 'my profile',
                        'component.LabelEvent': 'my hub',
                        'component.ActionEvent': 'load',
                        'component.PositionEvent': 'pending tasks 3',
                        'component.LocationEvent': 'my pending tasks tile',
                        'component.EventDetails': 'Sof details - non urgent',
                    },
                    {
                        'component.CategoryEvent': 'my profile',
                        'component.LabelEvent': 'my hub',
                        'component.ActionEvent': 'load',
                        'component.PositionEvent': 'pending tasks 3',
                        'component.LocationEvent': 'my pending tasks tile',
                        'component.EventDetails': 'account menu - non urgent',
                    },
                ],
            });
        });
    });

    it('trackTaskOpenProfile', () => {
        service.trackTaskOpenProfile();

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'my profile',
            'component.LabelEvent': 'my balance',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'my balance',
            'component.EventDetails': 'pending tasks 5',
            'component.URLClicked': 'not applicable',
        });
    });

    it('trackLabelSwitcherMenuClicked', () => {
        service.trackLabelSwitcherMenuClicked('des', 'source', 'des url');

        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'multi state-switch',
            'component.LabelEvent': 'minimenu multi-state switch',
            'component.ActionEvent': 'switch',
            'component.PositionEvent': 'des, source',
            'component.LocationEvent': 'not applicable',
            'component.EventDetails': 'state switcher select',
            'component.URLClicked': 'des url',
        });
    });
});
