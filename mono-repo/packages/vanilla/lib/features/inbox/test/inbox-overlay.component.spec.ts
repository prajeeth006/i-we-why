import { OverlayRef } from '@angular/cdk/overlay';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationService } from '@frontend/vanilla/core';

import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { INBOX_DATA, InboxData, InboxOverlayComponent } from '../src/components/inbox-overlay.component';

describe(InboxOverlayComponent.name, () => {
    let fixture: ComponentFixture<InboxOverlayComponent>;
    let data: InboxData;

    beforeEach(() => {
        data = { showBackButton: false };
        TestBed.overrideComponent(InboxOverlayComponent, {
            set: {
                imports: [],
                schemas: [NO_ERRORS_SCHEMA],
                providers: [
                    { provide: INBOX_DATA, useValue: data },
                    { provide: OverlayRef, useClass: OverlayRefMock },
                    { provide: NavigationService, useClass: NavigationServiceMock },
                ],
            },
        });
    });

    describe('init', () => {
        it('should set back button to false', () => {
            fixture = TestBed.createComponent(InboxOverlayComponent);
            fixture.detectChanges();

            expect(fixture.componentInstance.showBackButton).toBeFalse();
        });

        it('should set back button to true', () => {
            data.showBackButton = true;
            fixture = TestBed.createComponent(InboxOverlayComponent);

            fixture.detectChanges();

            expect(fixture.componentInstance.showBackButton).toBeTrue();
        });
    });
});
