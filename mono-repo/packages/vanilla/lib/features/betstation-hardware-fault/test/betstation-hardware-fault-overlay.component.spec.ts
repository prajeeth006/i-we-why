import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ViewTemplate } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../core/src/client-config/test/common-messages.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { BetstationHardwareFaultOverlayComponent } from '../src/betstation-hardware-fault-overlay.component';
import { BetstationHardwareFaultConfigMock } from './betstation-hardware-fault.mocks';

describe('BetstationHardwareFaultOverlayComponent', () => {
    let fixture: ComponentFixture<BetstationHardwareFaultOverlayComponent>;
    let betstationHardwareFaultConfigMock: BetstationHardwareFaultConfigMock;
    let overlayRefMock: OverlayRefMock;

    beforeEach(() => {
        betstationHardwareFaultConfigMock = MockContext.useMock(BetstationHardwareFaultConfigMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        MockContext.useMock(CommonMessagesMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });

        betstationHardwareFaultConfigMock.overlays = <ViewTemplate[]>[
            {
                messages: {
                    type: 'hardware-fault',
                },
            },
        ];

        fixture = TestBed.createComponent(BetstationHardwareFaultOverlayComponent);
        fixture.componentRef.setInput('type', 'hardware-fault');

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('overlay should have value', fakeAsync(() => {
            betstationHardwareFaultConfigMock.whenReady.next();
            tick();

            expect(fixture.componentInstance.overlay()).toBeDefined();
        }));
    });

    describe('close', () => {
        it('should close the overlay', () => {
            fixture.componentInstance.close();

            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });
});
