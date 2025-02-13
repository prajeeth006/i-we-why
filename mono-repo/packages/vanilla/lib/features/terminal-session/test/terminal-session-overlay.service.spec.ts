import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { TimeSpan } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { TerminalSessionOverlayComponent } from '../src/terminal-session-overlay.component';
import { TerminalSessionOverlayService } from '../src/terminal-session-overlay.service';
import { TerminalSessionNotification } from '../src/terminal-session.models';

describe('TerminalSessionOverlayService', () => {
    let service: TerminalSessionOverlayService;
    let overlayMock: OverlayFactoryMock;
    let overlayRefMock: OverlayRefMock;

    const terminalSessionNotification: TerminalSessionNotification = {
        cumulativeBalance: 100,
        timeActive: TimeSpan.fromSeconds(100),
    };

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, TerminalSessionOverlayService],
        });

        overlayRefMock = new OverlayRefMock();
        overlayRefMock.attach.and.returnValue({
            setInput: () => {},
        });
        overlayMock.create.and.returnValue(overlayRefMock);

        service = TestBed.inject(TerminalSessionOverlayService);
    });

    describe('show', () => {
        it('should create an overlay', () => {
            service.show(terminalSessionNotification);

            const expectedConfig = {
                panelClass: ['vn-terminal-session-panel', 'vn-dialog-container'],
            };

            expect(overlayMock.create).toHaveBeenCalledOnceWith(expectedConfig);
            expect(overlayRefMock.attach).toHaveBeenCalled();

            const portal: ComponentPortal<TerminalSessionOverlayComponent> = overlayRefMock.attach.calls.mostRecent().args[0];

            expect(portal.component).toBe(TerminalSessionOverlayComponent);
            expect(portal.injector?.get(OverlayRef)).toBe(<any>overlayRefMock);
        });

        it('should not open overlay multiple times', () => {
            service.show(terminalSessionNotification);
            service.show(terminalSessionNotification);

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });
    });
});
