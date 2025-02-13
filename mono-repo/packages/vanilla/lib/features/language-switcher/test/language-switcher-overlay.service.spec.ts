import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { MockPositionStrategies, OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { LanguageSwitcherMenuComponent } from '../src/language-switcher-menu.component';
import { LanguageSwitcherOverlayService } from '../src/language-switcher-overlay.service';

describe('LanguageSwitcherOverlayService', () => {
    let service: LanguageSwitcherOverlayService;
    let overlayRef: OverlayRefMock;
    let overlayMock: OverlayFactoryMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, LanguageSwitcherOverlayService],
        });

        overlayRef = new OverlayRefMock();
        overlayMock.create.and.returnValue(overlayRef);

        service = TestBed.inject(LanguageSwitcherOverlayService);
    });

    describe('openMenu', () => {
        it('shoule open language switcher with flexible position', () => {
            service.openMenu(<ElementRef>{}); // act

            checkIfOverlayDisplayed('f', ['vn-language-switcher']);
        });

        it('shoule open language switcher with global position', () => {
            service.openMenu(); // act

            checkIfOverlayDisplayed('gchcv', ['vn-language-switcher', 'full-view'], true);
        });
    });

    function checkIfOverlayDisplayed(position: string, cssClass: string[], isFullView: boolean = false) {
        const positionStrategy = new MockPositionStrategies();
        positionStrategy.position = position;

        if (!isFullView) {
            positionStrategy.anchor = {};
            positionStrategy.positions = [
                { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'bottom' },
                { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'top' },
            ];
            positionStrategy.push = false;
            positionStrategy.flexDimensions = false;
        }

        expect(overlayMock.create).toHaveBeenCalledWith({ panelClass: cssClass, positionStrategy });
        expect(overlayRef.attach).toHaveBeenCalled();

        const portal: ComponentPortal<LanguageSwitcherMenuComponent> = overlayRef.attach.calls.mostRecent().args[0];
        expect(portal.component).toBe(LanguageSwitcherMenuComponent);
        expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);
    }
});
