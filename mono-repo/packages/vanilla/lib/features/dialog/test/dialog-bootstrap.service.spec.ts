import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { AnimationControl, MenuAction } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { AnimationControlServiceMock } from '../../../core/test/browsercommon/animation-control.mock';
import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { MatDialogMock } from '../../login/test/dialog.mock';
import { DialogBootstrapService } from '../src/dialog-bootstrap.service';

describe('BrowserBootstrapService', () => {
    let service: DialogBootstrapService;
    let animationControlServiceMock: AnimationControlServiceMock;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let doc: Document;

    beforeEach(() => {
        animationControlServiceMock = MockContext.useMock(AnimationControlServiceMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        MockContext.useMock(MatDialogMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DialogBootstrapService],
        });

        doc = TestBed.inject(DOCUMENT);
        service = TestBed.inject(DialogBootstrapService);
    });

    describe('onFeatureInit()', () => {
        it('should disable material dialog animation', () => {
            service.onFeatureInit();

            const callback = animationControlServiceMock.addCondition.calls.mostRecent().args[0];

            const element = doc.createElement('div');

            expect(callback(element)).toBeUndefined();

            element.classList.add('mat-dialog-container');

            expect(callback(element)).toBe(AnimationControl.Disable);
        });

        it('should register openDialog', () => {
            service.onFeatureInit();

            expect(menuActionsServiceMock.register).toHaveBeenCalledWith(MenuAction.OPEN_DIALOG, jasmine.any(Function));
        });
    });
});
