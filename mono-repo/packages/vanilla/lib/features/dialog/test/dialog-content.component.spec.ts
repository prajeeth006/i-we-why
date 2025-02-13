import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContentComponent } from '@frontend/vanilla/features/dialog';
import { MockContext } from 'moxxi';

import { HeaderBarServiceMock } from '../../header-bar/test/header-bar.mocks';
import { MatDialogRefMock } from '../../login/test/dialog-ref.mock';

describe('DialogContentComponent', () => {
    let fixture: ComponentFixture<DialogContentComponent>;
    let dialogRefMock: MatDialogRefMock;

    beforeEach(() => {
        dialogRefMock = MockContext.useMock(MatDialogRefMock);
        MockContext.useMock(HeaderBarServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });
    });

    function initComponent() {
        fixture = TestBed.createComponent(DialogContentComponent);

        fixture.detectChanges();
    }

    it('should set if close button should be disabled', () => {
        dialogRefMock.disableClose = true;

        initComponent();

        expect(fixture.componentInstance.closeDisabled).toBeTrue();
    });

    it('should set close dialog when on close', () => {
        initComponent();

        fixture.componentInstance.close();

        expect(dialogRefMock.close).toHaveBeenCalled();
    });
});
