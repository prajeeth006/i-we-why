import { OverlayHandler, OverlayService } from '@frontend/vanilla/features/overlay';

describe('OverlayService', () => {
    let overlay: OverlayService;
    let activeHandler: OverlayHandler | null;

    beforeEach(() => {
        overlay = new OverlayService();

        overlay.activeHandler.subscribe((handler: OverlayHandler | null) => (activeHandler = handler));
    });

    describe('getHandler()', () => {
        testShow((handler: OverlayHandler) => {
            handler.show();
        });
        testShow((handler: OverlayHandler) => {
            handler.toggle(true);
        });
        testHide((handler: OverlayHandler) => {
            handler.hide();
        });
        testHide((handler: OverlayHandler) => {
            handler.toggle(false);
        });

        function testShow(showFn: (handler: OverlayHandler) => void) {
            describe('show()', () => {
                it('should set active instance', () => {
                    const overlayHandler = overlay.getHandler();

                    expect(activeHandler).toBeNull();

                    showFn(overlayHandler);

                    expect(activeHandler).toBe(overlayHandler);
                });
            });
        }

        function testHide(hideFn: (handler: OverlayHandler) => void) {
            describe('hide()', () => {
                it('should set active instance to null', () => {
                    const overlayHandler = overlay.getHandler();
                    overlayHandler.show();

                    expect(activeHandler).toBe(overlayHandler);

                    hideFn(overlayHandler);

                    expect(activeHandler).toBeNull();
                });
            });
        }

        describe('onClick', () => {
            it('should set onClick from constructor', () => {
                const fn = jasmine.createSpy('fn');
                const overlayHandler = overlay.getHandler({
                    onClick: fn,
                });

                expect(overlayHandler.onClick).toBe(fn);
            });

            it('should be function that returns true by default', () => {
                const overlayHandler = overlay.getHandler();

                expect(overlayHandler.onClick()).toBeTrue();
            });
        });
    });

    describe('active', () => {
        let spy: jasmine.Spy;

        beforeEach(() => {
            spy = jasmine.createSpy();
        });

        it('should notify subscribers when overlay opens or closes', () => {
            overlay.active.subscribe(spy);

            const overlayHandler = overlay.getHandler();
            overlayHandler.show();

            expect(spy).toHaveBeenCalledWith(true);
            expect(overlay.isActive).toBeTrue();

            overlayHandler.hide();

            expect(spy).toHaveBeenCalledWith(false);
            expect(overlay.isActive).toBeFalse();
        });
    });
});
