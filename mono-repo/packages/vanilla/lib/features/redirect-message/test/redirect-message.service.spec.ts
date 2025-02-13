import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { RedirectMessageComponent } from '../src/redirect-message.component';
import { RedirectMessageService } from '../src/redirect-message.service';

describe('RedirectMessageService', () => {
    let service: RedirectMessageService;
    let overlayMock: OverlayFactoryMock;
    let cookieServiceMock: CookieServiceMock;
    let overlayRef: OverlayRefMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);

        TestBed.configureTestingModule({
            providers: [...MockContext.providers, RedirectMessageService],
        });

        service = TestBed.inject(RedirectMessageService);
        overlayRef = new OverlayRefMock();
        overlayMock.create.and.returnValue(overlayRef);
    });

    describe('tryShowMessage', () => {
        it('should create an overlay if condition is true', () => {
            service.tryShowMessage();

            const expectedConfig = {
                panelClass: ['ip-redirect-message-panel', 'vn-dialog-container'],
            };

            expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            expect(overlayRef.attach).toHaveBeenCalled();
            const portal: ComponentPortal<RedirectMessageComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(RedirectMessageComponent);
            expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);
        });

        it('should not open overlay if it was already accepted', () => {
            cookieServiceMock.get.withArgs('redirectMsgShown').and.returnValue('1');

            service.tryShowMessage();

            expect(overlayMock.create).not.toHaveBeenCalled();
        });
    });
});
