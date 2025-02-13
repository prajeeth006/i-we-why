import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';
import { take } from 'rxjs/operators';

import { OverlayFactory } from '../src/overlay.factory';
import { MockPositionStrategies, OverlayMock, OverlayRefMock } from './cdk-overlay.mock';

describe('OverlayFactory', () => {
    let overlayFactory: OverlayFactory;
    let overlayMock: OverlayMock;
    let positionStrategiesMock: MockPositionStrategies;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayMock);
        positionStrategiesMock = new MockPositionStrategies();

        overlayMock.create.and.returnValue(new OverlayRefMock());

        TestBed.configureTestingModule({
            providers: [MockContext.providers, OverlayFactory],
        });

        overlayFactory = TestBed.inject(OverlayFactory);
    });

    describe('create()', () => {
        it('should create overlay with default config', () => {
            const config = {
                hasBackdrop: true,
                backdropClass: 'vn-backdrop',
                scrollStrategy: overlayMock.scrollStrategies.block(),
                positionStrategy: <any>positionStrategiesMock.global().centerHorizontally().centerVertically(),
                panelClass: ['vn-overlay'],
            };

            overlayFactory.create();

            expect(overlayMock.create).toHaveBeenCalledWith(config);
        });

        it('should create overlay with the provided config', () => {
            const config = {
                hasBackdrop: false,
                backdropClass: 'backdrop',
                scrollStrategy: overlayMock.scrollStrategies.noop(),
                positionStrategy: <any>positionStrategiesMock.global(),
                panelClass: 'overlay',
            };

            const overlayConfig: OverlayConfig = {
                ...config,
            };

            overlayFactory.create(overlayConfig);

            expect(overlayMock.create).toHaveBeenCalledWith(config);
        });
    });

    describe('dispose()', () => {
        it('should dispose the overlay', () => {
            const overlayRefMock: any = new OverlayRefMock();
            overlayFactory.dispose(overlayRefMock);

            expect(overlayRefMock.dispose).toHaveBeenCalled();
        });

        it('should remove overlay reference from overlayRefs field', () => {
            const config = {
                hasBackdrop: false,
                backdropClass: 'backdrop',
                scrollStrategy: overlayMock.scrollStrategies.noop(),
                positionStrategy: <any>positionStrategiesMock.global(),
                panelClass: 'overlay',
            };

            const overlayConfig: OverlayConfig = {
                ...config,
            };

            const overlayRef: any = overlayFactory.create(overlayConfig);
            expect(overlayFactory.overlayRefs.get('overlay')).toEqual(overlayRef);

            overlayFactory.overlayRefsSubject.pipe(take(1)).subscribe((result: Map<string, OverlayRef> | null) => {
                expect(result?.get('overlay')).toEqual(overlayRef);
            });

            overlayFactory.dispose(overlayRef);
            expect(overlayFactory.overlayRefs.get('overlay')).toBeUndefined();

            overlayFactory.overlayRefsSubject.pipe(take(1)).subscribe((result: Map<string, OverlayRef> | null) => {
                expect(result?.get('overlay')).toBeUndefined();
            });
        });
    });
});
