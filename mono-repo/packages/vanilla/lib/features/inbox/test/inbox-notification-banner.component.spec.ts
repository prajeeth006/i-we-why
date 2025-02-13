import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';
import { MockComponent } from 'ng-mocks';

import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { IconCustomComponent } from '../../icons/src/icon-fast.component';
import { InboxNotificationBannerComponent } from '../src/components/inbox-notification-banner.component';

describe('InboxNotificationBannerComponent', () => {
    let fixture: ComponentFixture<InboxNotificationBannerComponent>;
    let component: InboxNotificationBannerComponent;
    let nativeApplication: NativeAppServiceMock;

    beforeEach(() => {
        nativeApplication = MockContext.useMock(NativeAppServiceMock);

        TestBed.overrideComponent(InboxNotificationBannerComponent, {
            set: {
                providers: [MockContext.providers],
            },
        });

        TestBed.overrideComponent(InboxNotificationBannerComponent, {
            remove: {
                imports: [IconCustomComponent],
            },
            add: {
                imports: [MockComponent(IconCustomComponent)],
            },
        });
        fixture = TestBed.createComponent(InboxNotificationBannerComponent);
        component = fixture.componentInstance;
    });

    it('should send event to native', () => {
        const spy = spyOn(component.onNotificationsTurnedOn, 'next');
        component.turnOnNotifications();

        expect(spy).toHaveBeenCalled();
        expect(nativeApplication.sendToNative).toHaveBeenCalledWith({
            eventName: 'OSPrimerSelected',
            parameters: {
                displaySettingsPage: 'Yes',
            },
        });
    });

    it('close', () => {
        const spy = spyOn(component.onNotificationsTurnedOn, 'next');
        component.close();

        expect(spy).toHaveBeenCalled();
    });
});
