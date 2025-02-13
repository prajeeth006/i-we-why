import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NativeEventType, VanillaElements, WINDOW } from '@frontend/vanilla/core';
import { CashierIframeComponent } from '@frontend/vanilla/shared/cashier';
import { MockContext } from 'moxxi';
import { Subject } from 'rxjs';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { EventsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { MediaQueryServiceMock } from '../../../core/test/browser/media-query.service.mock';
import { ElementRepositoryServiceMock } from '../../../core/test/browsercommon/element-repository.mock';
import { ElementRefMock, HtmlElementMock } from '../../../core/test/element-ref.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { NavigationServiceMock, ParsedUrlMock } from '../../../core/test/navigation/navigation.mock';
import { BalancePropertiesServiceMock } from '../../balance-properties/test/balance-properties.service.mock';
import { CashierConfigMock, PublicCashierServiceMock } from './cashier.mock';

@Component({ template: '' })
export class IframeTestComponent {
    events = new Subject<string>();
}

describe('CashierIframeComponent', () => {
    let iframeTestComponent: IframeTestComponent;
    let component: CashierIframeComponent;
    let cashierConfigMock: CashierConfigMock;
    let navigationServiceMock: NavigationServiceMock;
    let cashierServiceMock: PublicCashierServiceMock;
    let balancePropertiesServiceMock: BalancePropertiesServiceMock;
    let mediaQueryServiceMock: MediaQueryServiceMock;
    let wrapperElementMock: ElementRefMock;
    let quickDepositWrapperElement: HtmlElementMock;
    let mainSlotElementMock: HtmlElementMock;
    let elementRepositoryService: ElementRepositoryServiceMock;
    let eventsServiceMock: EventsServiceMock;
    let windowMock: WindowMock;
    let nativeAppServiceMock: NativeAppServiceMock;

    beforeEach(() => {
        cashierConfigMock = MockContext.useMock(CashierConfigMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        cashierServiceMock = MockContext.useMock(PublicCashierServiceMock);
        balancePropertiesServiceMock = MockContext.useMock(BalancePropertiesServiceMock);
        mediaQueryServiceMock = MockContext.useMock(MediaQueryServiceMock);
        eventsServiceMock = MockContext.useMock(EventsServiceMock);
        elementRepositoryService = MockContext.useMock(ElementRepositoryServiceMock);
        windowMock = new WindowMock();
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        MockContext.useMock(DeviceServiceMock);

        wrapperElementMock = new ElementRefMock();
        quickDepositWrapperElement = new HtmlElementMock();
        mainSlotElementMock = new HtmlElementMock();

        cashierConfigMock.host = 'http://cashier.vanilla.intranet';
        cashierConfigMock.depositUrlTemplate = '/en/deposit';
        wrapperElementMock.nativeElement.dataset = { url: 'cashier' };
        wrapperElementMock.nativeElement.getBoundingClientRect.and.returnValue(new DOMRect(1, 2, 3, 4));
        mainSlotElementMock.getBoundingClientRect.and.returnValue(new DOMRect(1, 2, 3, 4));

        quickDepositWrapperElement.querySelector.and.callFake((selector: string) =>
            selector === '.player-quickdeposit-iframe-wrapper' ? new HtmlElementMock() : null,
        );
        elementRepositoryService.get.and.callFake((elementKey: string) =>
            elementKey === VanillaElements.QUICK_DEPOSIT_WRAPPER ? quickDepositWrapperElement : null,
        );
        elementRepositoryService.get.and.callFake((elementKey: string) => (elementKey === VanillaElements.MAIN_SLOT ? mainSlotElementMock : null));
        cashierServiceMock.generateCashierUrl.and.returnValue(cashierConfigMock.host + cashierConfigMock.depositUrlTemplate);

        TestBed.overrideComponent(CashierIframeComponent, {
            set: {
                providers: [
                    MockContext.providers,
                    {
                        provide: WINDOW,
                        useValue: windowMock,
                    },
                ],
                imports: [],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        component = TestBed.createComponent(CashierIframeComponent).componentInstance;
        iframeTestComponent = TestBed.createComponent(IframeTestComponent).componentInstance;

        component.iframe = <any>iframeTestComponent;
        component.wrapper = <any>wrapperElementMock;
    });

    it('should set url', fakeAsync(() => {
        component.ngOnInit();
        cashierConfigMock.whenReady.next();
        cashierServiceMock.whenReady.next();
        tick();

        expect(component.url).toBe('http://cashier.vanilla.intranet/en/deposit');
        expect(component.host()).toBe('http://cashier.vanilla.intranet');
    }));

    it('should redirect to last known product', () => {
        component.ngAfterViewInit();
        iframeTestComponent.events.next(encodeURIComponent('action=close'));

        expect(navigationServiceMock.goToLastKnownProduct).toHaveBeenCalled();
    });

    it('should open and scroll the iframe', () => {
        mediaQueryServiceMock.isActive.withArgs('gt-xs').and.returnValue(true);
        spyOn(component.onLoaded, 'next');

        component.ngAfterViewInit();
        iframeTestComponent.events.next(encodeURIComponent('action=open&width=100&height=200&target=cashier'));

        expect(component.wrapper.nativeElement.style.width).toBe('100px');
        expect(component.wrapper.nativeElement.style.height).toBe('200px');
        expect(windowMock.scrollTo).toHaveBeenCalledWith(0, 0);
        expect(component.onLoaded.next).toHaveBeenCalled();
    });

    it('should resize and scroll the iframe', () => {
        mediaQueryServiceMock.isActive.withArgs('gt-xs').and.returnValue(true);

        component.ngAfterViewInit();
        iframeTestComponent.events.next(encodeURIComponent('action=resize&width=100&height=200&target=cashier'));

        expect(component.wrapper.nativeElement.style.width).toBe('100px');
        expect(component.wrapper.nativeElement.style.height).toBe('200px');
        expect(windowMock.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it('should not resize width', () => {
        mediaQueryServiceMock.isActive.withArgs('gt-xs').and.returnValue(false);

        component.ngAfterViewInit();
        iframeTestComponent.events.next(encodeURIComponent('action=open&width=100&height=200&target=cashier'));

        expect(component.wrapper.nativeElement.style.width).toBeUndefined();
        expect(component.wrapper.nativeElement.style.height).toBe('200px');
    });

    it('should add overflow class to the main slot element if the iframe wrapper height is bigger', () => {
        wrapperElementMock.nativeElement.getBoundingClientRect.and.returnValue(new DOMRect(1, 2, 3, 5));

        component.ngAfterViewInit();
        iframeTestComponent.events.next(encodeURIComponent('action=resize&width=100&height=200&target=cashier'));

        expect(mainSlotElementMock.classList.add).toHaveBeenCalledWith('overflow-visible');
    });

    it('should remove overflow class from the main slot element if the iframe wrapper height is smaller', () => {
        wrapperElementMock.nativeElement.getBoundingClientRect.and.returnValue(new DOMRect(1, 2, 3, 1));

        component.ngAfterViewInit();
        iframeTestComponent.events.next(encodeURIComponent('action=resize&width=100&height=200&target=cashier'));

        expect(mainSlotElementMock.classList.remove).toHaveBeenCalledWith('overflow-visible');
    });

    it('should update balance', () => {
        component.ngAfterViewInit();
        iframeTestComponent.events.next(encodeURIComponent('action=updateBalance'));

        expect(balancePropertiesServiceMock.refresh).toHaveBeenCalled();
    });

    it('with action "chat" should navigate with chat open param', () => {
        const urlMock = new ParsedUrlMock();
        spyOn(urlMock.search, 'set');
        navigationServiceMock.location.clone.and.returnValue(urlMock);

        component.ngAfterViewInit();
        iframeTestComponent.events.next(encodeURIComponent('action=chat&Web_site_URL=cashiertest'));

        expect(navigationServiceMock.goTo).toHaveBeenCalled();
        expect(urlMock.search.set).toHaveBeenCalledWith('chat', 'open');
        expect(urlMock.search.set).toHaveBeenCalledWith('cashierId', 'cashiertest');
    });

    it('should close the iframe', () => {
        component.ngAfterViewInit();
        iframeTestComponent.events.next(encodeURIComponent('action=close'));

        expect(navigationServiceMock.goToLastKnownProduct).toHaveBeenCalled();
    });

    it('should call closed onClosed next if observers are present', () => {
        component.onClosed.observers.length = 1;
        spyOn(component.onClosed, 'next');

        component.ngAfterViewInit();
        iframeTestComponent.events.next(encodeURIComponent('action=close&showAllOptions=true'));

        expect(component.onClosed.next).toHaveBeenCalled();
    });

    it('should call closed onResized next if observers are present', () => {
        component.onResized.observers.length = 1;
        spyOn(component.onResized, 'next');

        component.ngAfterViewInit();
        iframeTestComponent.events.next(encodeURIComponent('action=resize'));

        expect(component.onResized.next).toHaveBeenCalled();
    });

    it('should raise ccb event for all deposits', () => {
        spyOn(component.onClosed, 'next');

        component.ngAfterViewInit();
        iframeTestComponent.events.next(encodeURIComponent('action=depositSuccessQD&amount=10.12&currency=GBP&type=VISA'));

        expect(eventsServiceMock.raise).toHaveBeenCalled();
        expect(eventsServiceMock.raise).toHaveBeenCalledWith({ eventName: 'depositSuccessQD', data: { currency: 'GBP', value: '10.12' } });
        expect(component.onClosed.next).toHaveBeenCalled();
    });

    it('should send event to native app', () => {
        component.ngAfterViewInit();

        iframeTestComponent.events.next(encodeURIComponent('action=fetchLocation'));

        expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledOnceWith({
            eventName: NativeEventType.TRIGGER_GEO_LOCATION,
            parameters: { action: 'fetchLocation' },
        });
    });
});
