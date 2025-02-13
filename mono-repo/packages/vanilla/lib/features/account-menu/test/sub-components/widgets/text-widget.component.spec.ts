import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebAnalyticsEventType } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../../../core/src/tracking/test/tracking.mock';
import { MenuActionsServiceMock } from '../../../../../core/test/menu-actions/menu-actions.mock';
import { TextWidgetComponent } from '../../../src/sub-components/widgets/text-widget.component';
import { AccountMenuWidgetComponent } from '../../../src/sub-components/widgets/widget.component';
import { AccountMenuRouterMock } from '../../account-menu-router.mock';
import { AccountMenuServiceMock } from '../../account-menu.mock';

describe('TextWidgetComponent', () => {
    let fixture: ComponentFixture<TextWidgetComponent>;
    let component: TextWidgetComponent;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        MockContext.useMock(AccountMenuServiceMock);
        MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(AccountMenuRouterMock);
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        TestBed.overrideComponent(TextWidgetComponent, {
            set: {
                imports: [CommonModule, AccountMenuWidgetComponent, TrustAsHtmlPipe],
                providers: [MockContext.providers],
            },
        });

        fixture = TestBed.createComponent(TextWidgetComponent);
        component = fixture.componentInstance;

        component.item = <any>{
            name: 'name',
            parameters: {},
            resources: {
                Title: 'title',
                Text: 'text',
            },
            webAnalytics: {
                load: {
                    eventName: 'contentView',
                    data: {
                        'component.CategoryEvent': 'load',
                    },
                },
            },
        };

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should track and hide skeleton', () => {
            expect(trackingServiceMock.trackEvents).toHaveBeenCalledWith(component.item, WebAnalyticsEventType.load);
            expect(component.hideSkeleton).toBeTrue();
        });
    });
});
