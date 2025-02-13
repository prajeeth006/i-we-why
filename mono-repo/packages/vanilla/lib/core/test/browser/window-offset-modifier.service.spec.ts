import { TestBed } from '@angular/core/testing';

import { WINDOW, WINDOW_OFFSET_PROVIDER, WindowOffsetModifierService, WindowOffsetProvider } from '@frontend/vanilla/core';
import { MockContext, StubObservable } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';

export class FakeWindowOffsetProvider implements WindowOffsetProvider {
    @StubObservable() getOffset: jasmine.ObservableSpy;
}

describe('WindowOffsetModifierService', () => {
    let service: WindowOffsetModifierService;
    let windowMock: WindowMock;
    let fakeProviders: FakeWindowOffsetProvider[];

    beforeEach(() => {
        windowMock = new WindowMock();

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                WindowOffsetModifierService,
                { provide: WINDOW_OFFSET_PROVIDER, useClass: FakeWindowOffsetProvider, multi: true },
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        service = TestBed.inject(WindowOffsetModifierService);
        fakeProviders = TestBed.inject<any>(WINDOW_OFFSET_PROVIDER);
    });

    it('should call providers getOffset and not call scrollBy', () => {
        service.scrollBy(5);
        fakeProviders[0]!.getOffset.completeWith(1);

        expect(fakeProviders[0]!.getOffset).toHaveBeenCalledWith(5);
        expect(windowMock.scrollBy).not.toHaveBeenCalled();
    });

    it('should call providers getOffset and call scrollBy', () => {
        service.scrollBy(5);
        fakeProviders[0]!.getOffset.completeWith(-10);

        expect(fakeProviders[0]!.getOffset).toHaveBeenCalledWith(5);
        expect(windowMock.scrollBy).toHaveBeenCalledWith(0, -10);
    });
});
