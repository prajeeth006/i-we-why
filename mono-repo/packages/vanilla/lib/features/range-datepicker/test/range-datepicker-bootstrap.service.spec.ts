import { TestBed } from '@angular/core/testing';

import { MenuAction } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { RangeDatepickerBootstrapService } from '../src/range-datepicker-bootstrap.service';
import { RangeDatepickerOverlayServiceMock } from './range-datepicker.mocks';

describe('RangeDatepickerBootstrapService', () => {
    let service: RangeDatepickerBootstrapService;
    let rangeDatepickerOverlayServiceMock: RangeDatepickerOverlayServiceMock;
    let menuActionsServiceMock: MenuActionsServiceMock;

    beforeEach(() => {
        rangeDatepickerOverlayServiceMock = MockContext.useMock(RangeDatepickerOverlayServiceMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, RangeDatepickerBootstrapService],
        });

        service = TestBed.inject(RangeDatepickerBootstrapService);
    });

    describe('onFeatureInit', () => {
        it('should register menu action', () => {
            service.onFeatureInit();

            expect(menuActionsServiceMock.register).toHaveBeenCalledOnceWith(MenuAction.TOGGLE_RANGE_DATEPICKER, jasmine.any(Function));
        });

        it('should call toggleRangeDatepicker on menu action', () => {
            service.onFeatureInit();

            menuActionsServiceMock.register.calls.mostRecent().args[1]();

            expect(rangeDatepickerOverlayServiceMock.toggleRangeDatepicker).toHaveBeenCalledOnceWith(undefined);
        });
    });
});
