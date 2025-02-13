import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { IFrameComponent, TrustAsResourceUrlPipe } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { ElementRefMock } from '../../../core/test/element-ref.mock';

describe('IframeComponent', () => {
    let fixture: ComponentFixture<IFrameComponent>;
    let windowMock: WindowMock;
    let iframeMock: ElementRefMock;

    beforeEach(() => {
        windowMock = new WindowMock();

        TestBed.configureTestingModule({
            imports: [IFrameComponent, TrustAsResourceUrlPipe],
            providers: [
                MockContext.providers,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(IFrameComponent);
        iframeMock = new ElementRefMock();
        iframeMock.nativeElement.contentWindow = new WindowMock();
        fixture.componentInstance.url = 'http://www.google.com';
        fixture.componentInstance.origin = 'origin';
        fixture.detectChanges();
        fixture.componentInstance.iframe = <any>iframeMock;
    });

    it('post should postMessage', () => {
        const component = fixture.componentInstance;
        component.post({ foo: 'bar' });

        expect(iframeMock.nativeElement.contentWindow.postMessage).toHaveBeenCalledWith({ foo: 'bar' }, 'origin');
    });

    it('ngAfterViewInit should emit on message', fakeAsync(() => {
        const component = fixture.componentInstance;
        component.ngAfterViewInit();

        const spy = jasmine.createSpy();
        component.events.subscribe(spy);

        const callback = windowMock.addEventListener.calls.all().filter((c) => c.args[0] == 'message')[0]!.args[1];
        callback({ data: { foo: 'bar' }, origin: 'origin' });
        expect(spy).toHaveBeenCalledWith({ foo: 'bar' });
    }));
});
