import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA, SimpleChange, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { NotificationMessage, NotificationMessageContent, RtmsCtaAction, RtmsCtaActionTypes } from '@frontend/vanilla/shared/rtms';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../../core/src/browser/window/test/window-ref.mock';
import { PageMock } from '../../../../core/test/browsercommon/page.mock';
import { NativeAppServiceMock } from '../../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock } from '../../../../core/test/navigation/navigation.mock';
import { RtmsClientConfigMock } from '../../../../shared/rtms/test/stubs/rtms-mocks';
import { RtmsLayerComponentBase } from '../../src/components/rtms-layer-component-base';

export function rtmsLayerComponentBaseSpec<TComponent extends RtmsLayerComponentBase>(typeComponent: Type<TComponent>) {
    let fixtureComponent: ComponentFixture<TComponent>;
    let component: TComponent;

    let navigationServiceMock: NavigationServiceMock;
    let rtmsClientConfigMock: RtmsClientConfigMock;
    let windowMock: WindowMock;
    let toolboxNativeAppServiceMock: NativeAppServiceMock;

    beforeEach(() => {
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        windowMock = new WindowMock();
        toolboxNativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        rtmsClientConfigMock = MockContext.useMock(RtmsClientConfigMock);
        MockContext.useMock(PageMock);

        TestBed.overrideComponent(typeComponent, {
            set: { imports: [CommonModule, TrustAsHtmlPipe], schemas: [NO_ERRORS_SCHEMA] },
        });
        TestBed.configureTestingModule({
            providers: [MockContext.providers, { provide: WINDOW, useValue: windowMock }],
        });
    });

    function initComponent() {
        fixtureComponent = TestBed.createComponent(typeComponent);
        component = fixtureComponent.componentInstance;

        const notMessage: NotificationMessage = new NotificationMessage();
        notMessage.content = new NotificationMessageContent();
        notMessage.content.overlayImage = 'images/123.png';
        notMessage.content.tosterImage = 'images/123.png';

        component.message = notMessage;
        component.isOfferClaimed = false;
        component.ngOnInit();
        const change: SimpleChange = new SimpleChange({}, {}, true);
        component.ngOnChanges({ message: change });
        fixtureComponent.detectChanges();
    }

    it('should create component successfully, properties and functions are defined', () => {
        initComponent();
        expect(component.ngOnChanges).toBeDefined();
        expect(component.getSectionTitle).toBeDefined();
        expect(component.ngOnInit).toBeDefined();
        expect(component.getSectionTitle).toBeDefined();
        expect(component.rtmsCtaActions).toBeDefined();
        expect(component.close).toBeDefined();
        expect(component.goTo).toBeDefined();
        expect(component.closeEvent).toBeDefined();
    });

    it('init should correctly', () => {
        initComponent();
        rtmsClientConfigMock.whenReady.next();
        expect(component.content).toBeDefined();
        expect(component.message.mobileGameList).toBeDefined();
        expect(component.message.desktopGameList).toBeDefined();
        expect(component.message.mobileAllList).toBeDefined();
        expect(component.message.desktopAllList).toBeDefined();
        expect(component.message.desktopSectionGamesPairs).toBeDefined();
        expect(component.message.mobileSectionGamesPairs).toBeDefined();
        expect(component.message.mobileGames).toBeDefined();
        expect(component.message.desktopGames).toBeDefined();
    });

    it('goTo should call correct to web', () => {
        initComponent();
        toolboxNativeAppServiceMock.isNativeApp = false;
        component.goTo('http://1');
        expect(navigationServiceMock.goTo).toHaveBeenCalledWith('http://1', { forceReload: true });
    });

    it('goTo should call correct to natives', () => {
        initComponent();
        toolboxNativeAppServiceMock.isNativeApp = true;
        component.goTo('http://2');
        expect(windowMock.location.href).toEqual('http://2');
    });

    it('rtmsCtaActions work correctly', () => {
        initComponent();
        spyOn<any>(component, 'close');
        component.rtmsCtaActions(new RtmsCtaAction(RtmsCtaActionTypes.hideRtms));
        expect(component.close).toHaveBeenCalled();
    });
}
