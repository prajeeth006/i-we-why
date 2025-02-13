import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { RangeDatepickerOverlayService } from '../src/range-datepicker-overlay.service';

describe('RangeDatepickerOverlayService', () => {
    let service: RangeDatepickerOverlayService;
    let overlayFactoryMock: OverlayFactoryMock;
    let overlayRefMock: OverlayRefMock;

    beforeEach(() => {
        overlayFactoryMock = MockContext.useMock(OverlayFactoryMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, RangeDatepickerOverlayService],
        });

        service = TestBed.inject(RangeDatepickerOverlayService);

        overlayRefMock = new OverlayRefMock();
        overlayRefMock.attach.and.returnValue({
            setInput: () => {},
        });
        overlayFactoryMock.create.and.returnValue(overlayRefMock);
    });

    describe('toggleRangeDatepicker', () => {
        it('should create overlay and attach the component', () => {
            service.toggleRangeDatepicker({ disableApply: true });

            expect(overlayFactoryMock.create).toHaveBeenCalledOnceWith({
                panelClass: ['vn-range-datepicker-panel', 'generic-modal-popup'],
            });
            expect(overlayRefMock.attach).toHaveBeenCalledOnceWith(jasmine.any(ComponentPortal));
            expect(overlayRefMock.detachments).toHaveBeenCalledOnceWith();
        });

        it('should detach overlay if it is already attached', () => {
            service.toggleRangeDatepicker();
            service.toggleRangeDatepicker();

            expect(overlayRefMock.detach).toHaveBeenCalledOnceWith();
        });

        it('should dispose overlay on detach', () => {
            service.toggleRangeDatepicker();
            overlayRefMock.detachments.next();

            expect(overlayFactoryMock.dispose).toHaveBeenCalledOnceWith(overlayRefMock);
        });
    });
});
