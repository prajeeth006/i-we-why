import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../../../core/src/tracking/test/tracking.mock';
import { MenuActionsServiceMock } from '../../../../../core/test/menu-actions/menu-actions.mock';
import { OffersWidgetComponent } from '../../../../../features/account-menu/src/sub-components/widgets/offers-widget.component';
import { AccountMenuWidgetComponent } from '../../../../../features/account-menu/src/sub-components/widgets/widget.component';
import { OffersServiceMock } from '../../../../../shared/offers/test/offers.mocks';
import { AccountMenuRouterMock } from '../../account-menu-router.mock';
import { AccountMenuTrackingServiceMock } from '../../account-menu-tracking.mock';
import { AccountMenuServiceMock } from '../../account-menu.mock';

describe('OffersWidgetComponent', () => {
    let fixture: ComponentFixture<OffersWidgetComponent>;
    let component: OffersWidgetComponent;
    let offersServiceMock: OffersServiceMock;
    let accountMenuTrackingServiceMock: AccountMenuTrackingServiceMock;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        MockContext.useMock(AccountMenuServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(AccountMenuRouterMock);
        accountMenuTrackingServiceMock = MockContext.useMock(AccountMenuTrackingServiceMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        offersServiceMock = MockContext.useMock(OffersServiceMock);

        TestBed.overrideComponent(OffersWidgetComponent, {
            set: {
                imports: [CommonModule, AccountMenuWidgetComponent],
                providers: [MockContext.providers],
            },
        });

        fixture = TestBed.createComponent(OffersWidgetComponent);
        component = fixture.componentInstance;

        component.item = <any>{
            name: 'name',
            parameters: {},
            resources: {
                Description: 'offer des',
                Text: '{COUNT}',
                NoOffersDescription: 'no offers',
            },
            trackEvent: {
                'LoadedEvent.component.PositionEvent': 'test',
            },
        };

        fixture.detectChanges();
    });

    describe('init', () => {
        it('with offers', () => {
            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith(
                {
                    'LoadedEvent.component.PositionEvent': 'test',
                },
                'LoadedEvent',
            );
            offersServiceMock.getCount.withArgs('ALL').and.returnValue(5);
            offersServiceMock.counts.next([{ key: 'ALL', value: 5 }]);

            expect(accountMenuTrackingServiceMock.replacePlaceholders).toHaveBeenCalledWith(component.item, {
                'component.PositionEvent': 'new offers',
            });
            expect(component.text).toBe('5');
            expect(component.description).toBe('offer des');
            expect(component.hideSkeleton).toBeTrue();
        });

        it('without offers', () => {
            expect(trackingServiceMock.trackContentItemEvent).toHaveBeenCalledWith(
                {
                    'LoadedEvent.component.PositionEvent': 'test',
                },
                'LoadedEvent',
            );
            offersServiceMock.getCount.withArgs('ALL').and.returnValue(0);
            offersServiceMock.counts.next([{ key: 'ALL', value: 0 }]);

            expect(accountMenuTrackingServiceMock.replacePlaceholders).toHaveBeenCalledWith(component.item, {
                'component.PositionEvent': 'no offer',
            });
            expect(component.text).toBe('');
            expect(component.description).toBe('no offers');
        });
    });
});
