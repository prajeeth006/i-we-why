import { TestBed } from '@angular/core/testing';

import { WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { DeviceServiceMock } from '../../../core/test/browser/device.mock';
import { HtmlElementMock } from '../../../core/test/element-ref.mock';
import { ClipboardService } from '../src/clipboard.service';

describe('ClipboardService', () => {
    let service: ClipboardService;
    let windowMock: WindowMock;

    beforeEach(() => {
        windowMock = new WindowMock();
        MockContext.useMock(DeviceServiceMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                ClipboardService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        service = TestBed.inject(ClipboardService);
    });

    describe('copy', () => {
        it('should return true if clipboard API is supported', () => {
            windowMock.document.execCommand.withArgs('copy').and.returnValue(true);
            windowMock.document.createElement.withArgs('textarea').and.returnValue(new HtmlElementMock());

            const result = service.copy('text');

            expect(result).toBeTrue();
        });
    });
});
