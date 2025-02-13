import { NO_ERRORS_SCHEMA, Pipe, PipeTransform, SimpleChange, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { WINDOW } from '@frontend/vanilla/core';
import { NotificationMessage, NotificationMessageContent, RtmsCtaAction, RtmsCtaActionTypes } from '@frontend/vanilla/shared/rtms';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../../core/src/browser/window/test/window-ref.mock';
import { PageMock } from '../../../../core/test/browsercommon/page.mock';
import { NativeAppServiceMock } from '../../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock } from '../../../../core/test/navigation/navigation.mock';
import { RtmsOverlayComponentBase } from '../../../../features/rtms-overlay/src/components/overlays/rtms-overlay-component-base';
import { RtmsClientConfigMock } from '../../../../shared/rtms/test/stubs/rtms-mocks';

@Pipe({ name: 'trustAsHtml', pure: true, standalone: true })
export class FakeTrustAsHtmlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    public transform(value: string | null | undefined): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(value || '');
    }
}

export function rtmsLayerComponentBaseSpec<TComponent extends RtmsOverlayComponentBase>(typeComponent: Type<TComponent>) {
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

        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                MockContext.providers,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });
    });

    function initComponent() {
        TestBed.overrideComponent(typeComponent, { set: { imports: [FakeTrustAsHtmlPipe], schemas: [NO_ERRORS_SCHEMA] } });
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
