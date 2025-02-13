import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { OverlayComponent, OverlayService } from '@frontend/vanilla/features/overlay';

describe('OverlayComponent', () => {
    let fixture: ComponentFixture<OverlayComponent>;
    let overlay: OverlayService;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            providers: [OverlayService],
        });

        fixture = TestBed.createComponent(OverlayComponent);
        overlay = TestBed.inject(OverlayService);

        fixture.detectChanges();
    }));

    it('should show overlay when show() is called', () => {
        expect(getOverlayElement()).toBeHidden();

        const overlayHandler = overlay.getHandler();
        overlayHandler.show();
        fixture.detectChanges();

        expect(getOverlayElement()).toBeVisible();
    });

    it('should hide overlay when hide() is called', () => {
        const overlayHandler = overlay.getHandler();
        overlayHandler.show();
        fixture.detectChanges();

        expect(getOverlayElement()).toBeVisible();

        overlayHandler.hide();
        fixture.detectChanges();

        expect(getOverlayElement()).toBeHidden();
    });

    it('should set state to toggle parameter', () => {
        const overlayHandler = overlay.getHandler();
        overlayHandler.toggle(true);
        fixture.detectChanges();

        expect(getOverlayElement()).toBeVisible();

        overlayHandler.toggle(false);
        fixture.detectChanges();

        expect(getOverlayElement()).toBeHidden();
    });

    it('should keep overlay hidden when clicked by default', () => {
        const overlayHandler = overlay.getHandler();
        overlayHandler.show();
        fixture.detectChanges();

        expect(getOverlayElement()).toBeVisible();

        clickOverlay();
        fixture.detectChanges();

        expect(getOverlayElement()).toBeVisible();
    });

    it('should keep overlay hidden when clicked by when onClick returns false', () => {
        const overlayHandler = overlay.getHandler({
            onClick: () => {
                return false;
            },
        });

        overlayHandler.show();
        fixture.detectChanges();

        expect(getOverlayElement()).toBeVisible();

        clickOverlay();
        fixture.detectChanges();

        expect(getOverlayElement()).toBeHidden();
    });

    function getOverlay() {
        return fixture.debugElement.query(By.css('#main-overlay'));
    }

    function clickOverlay() {
        getOverlay().triggerEventHandler('click', {});
    }

    function getOverlayElement() {
        return getOverlay().nativeElement;
    }
});
