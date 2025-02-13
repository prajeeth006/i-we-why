import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { ContentItem } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { HintOverlayService } from '../src/hint-overlay.service';
import { HintComponent } from '../src/hint.component';

describe('HintOverlayService', () => {
    let service: HintOverlayService;
    let overlayMock: OverlayFactoryMock;
    let overlayRef: OverlayRefMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, HintOverlayService],
        });

        service = TestBed.inject(HintOverlayService);
        overlayRef = new OverlayRefMock();
        overlayRef.attach.and.returnValue({
            setInput: () => {},
        });
        overlayMock.create.and.returnValue(overlayRef);
    });

    describe('show', () => {
        it('should create an overlay when the user is authenticated and interval expired', () => {
            service.show({ name: 'hint1' } as ContentItem);

            const expectedConfig = {
                panelClass: 'vn-overlay-hint-container',
                scrollStrategy: 'noop',
            };

            expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            expect(overlayRef.attach).toHaveBeenCalled();
            const portal: ComponentPortal<HintComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(HintComponent);
            expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);
        });
    });
});
