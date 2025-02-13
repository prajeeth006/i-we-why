import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { HeaderBarConfigMock, HeaderBarServiceMock } from '../../header-bar/test/header-bar.mocks';
import { DepositLimitExceededOverlayComponent } from '../src/deposit-limit-exceeded-overlay.component';
import { DepositLimitExceededConfigMock } from './deposit-limit-exceeded.client-config.mock';

describe('DepositLimitExceededOverlayComponent', () => {
    let fixture: ComponentFixture<DepositLimitExceededOverlayComponent>;
    let overlayRefMock: OverlayRefMock;

    beforeEach(() => {
        MockContext.useMock(DepositLimitExceededConfigMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        MockContext.useMock(HeaderBarConfigMock);
        MockContext.useMock(HeaderBarServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(DepositLimitExceededOverlayComponent);
    });

    describe('close', () => {
        it('should close the overlay', () => {
            fixture.componentInstance.close();

            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });
});
