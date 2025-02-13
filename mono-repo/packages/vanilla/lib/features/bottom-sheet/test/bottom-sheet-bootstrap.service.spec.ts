import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { BottomSheetBootstrapService } from '../src/bottom-sheet-bootstrap.service';
import { ButtonComponent } from '../src/sub-components/button.component';
import { LinkComponent } from '../src/sub-components/link.component';
import { BottomSheetConfigMock, BottomSheetOverlayServiceMock, BottomSheetServiceMock } from './bottom-sheet.mock';

describe('BottomSheetBootstrapService', () => {
    let service: BottomSheetBootstrapService;
    let bottomSheetConfigMock: BottomSheetConfigMock;
    let bottomSheetServiceMock: BottomSheetServiceMock;
    let menuActionsServiceMock: MenuActionsServiceMock;

    beforeEach(() => {
        bottomSheetConfigMock = MockContext.useMock(BottomSheetConfigMock);
        bottomSheetServiceMock = MockContext.useMock(BottomSheetServiceMock);
        MockContext.useMock(BottomSheetOverlayServiceMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, BottomSheetBootstrapService],
        });

        service = TestBed.inject(BottomSheetBootstrapService);
    });

    describe('run()', () => {
        it('should setup menu item templates', fakeAsync(() => {
            service.onFeatureInit();
            bottomSheetConfigMock.whenReady.next();
            tick();

            expect(menuActionsServiceMock.register).toHaveBeenCalled();
            expect(bottomSheetServiceMock.setBottomSheetComponent).toHaveBeenCalledWith('default', LinkComponent);
            expect(bottomSheetServiceMock.setBottomSheetComponent).toHaveBeenCalledWith('button', ButtonComponent);
        }));
    });
});
