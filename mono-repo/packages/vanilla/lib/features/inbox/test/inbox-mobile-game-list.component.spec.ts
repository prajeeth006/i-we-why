import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { OfferStatus } from '@frontend/vanilla/shared/offers';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { InboxMobileGameListComponent } from '../src/components/inbox-mobile-game-list.component';
import { InboxMessage } from '../src/services/inbox.models';

describe('InboxMobileGameListComponent', () => {
    let fixture: ComponentFixture<InboxMobileGameListComponent>;
    let component: InboxMobileGameListComponent;
    let nativeApplicationServiceMock: NativeAppServiceMock;
    let navigationServiceMock: NavigationServiceMock;
    let windowMock: WindowMock;

    beforeEach(() => {
        windowMock = new WindowMock();
        nativeApplicationServiceMock = MockContext.useMock(NativeAppServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);

        TestBed.configureTestingModule({
            providers: [
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });
        TestBed.overrideComponent(InboxMobileGameListComponent, {
            set: {
                schemas: [NO_ERRORS_SCHEMA],
                providers: [MockContext.providers],
            },
        });
    });

    function initComponent() {
        fixture = TestBed.createComponent(InboxMobileGameListComponent);
        component = fixture.componentInstance;
    }

    it('should create component successfully, properties and functions are defined', () => {
        initComponent();
        expect(component.isBonusApplied).toBeDefined();
        expect(component.goTo).toBeDefined();
        expect(component.getSectionTitle).toBeDefined();
    });

    it('should return correct content message on getSectionTitle', () => {
        initComponent();
        const messageKey = 'key';

        const content = { formContent: {}, title: 'title', messages: { 'GameSection.key': 'val' } };
        component.contentMessages = content.messages;
        const result = component.getSectionTitle(messageKey);
        expect(result).toEqual(content.messages['GameSection.key']);
    });

    it('should return key if key not found in message on getSectionTitle', () => {
        initComponent();
        const messageKey = 'notFoundKeykey';

        const content = { formContent: {}, title: 'title', messages: { 'GameSection.key': 'val' } };
        component.contentMessages = content.messages;
        const result = component.getSectionTitle(messageKey);
        expect(result).toEqual(messageKey);
    });

    it('should navigate to url on goTo', () => {
        initComponent();
        nativeApplicationServiceMock.isNativeApp = false;
        const linkUrl = 'linkUrl';
        component.goTo(linkUrl);
        expect(navigationServiceMock.goTo).toHaveBeenCalledWith(linkUrl, { forceReload: true });

        nativeApplicationServiceMock.isNativeApp = true;
        component.goTo(linkUrl);
        expect(windowMock.location.href).toEqual(linkUrl);
    });

    it('should not redirect when linkUrl is null on goTo', () => {
        initComponent();
        nativeApplicationServiceMock.isNativeApp = false;
        component.goTo(<any>null);
        expect(navigationServiceMock.goTo).not.toHaveBeenCalled();
    });

    it('should return is Bonus Applied on isBonusApplied', () => {
        initComponent();
        const message = new InboxMessage();
        message.sourceStatus = OfferStatus.OFFER_CLAIMED;
        message.isExpired = false;
        component.message = message;
        let result = component.isBonusApplied();
        expect(result).toEqual(true);

        component.message.isExpired = true;
        result = component.isBonusApplied();
        expect(result).toEqual(false);

        component.message.isExpired = false;
        message.sourceStatus = OfferStatus.EXPIRED;
        result = component.isBonusApplied();
        expect(result).toEqual(false);
    });
});
