import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tooltip, TooltipsComponent } from '@frontend/vanilla/shared/tooltips';
import { MockContext } from 'moxxi';
import { MockComponent } from 'ng-mocks';

import { CommonMessagesMock } from '../../../../core/src/client-config/test/common-messages.mock';
import { ElementRefMock } from '../../../../core/test/element-ref.mock';
import { TooltipsServiceMock } from '../../../../shared/tooltips/test/tooltips-service.mock';
import { IconCustomComponent } from '../../../icons/src/icon-fast.component';

describe('TooltipsComponent', () => {
    let fixture: ComponentFixture<TooltipsComponent>;
    let component: TooltipsComponent;
    let tooltipsServiceMock: TooltipsServiceMock;

    beforeEach(() => {
        tooltipsServiceMock = MockContext.useMock(TooltipsServiceMock);
        MockContext.useMock(CommonMessagesMock);
        MockContext.useMock(ElementRefMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
            schemas: [NO_ERRORS_SCHEMA],
        });

        TestBed.overrideComponent(TooltipsComponent, {
            remove: {
                imports: [IconCustomComponent],
            },
            add: {
                imports: [MockComponent(IconCustomComponent)],
            },
        });

        fixture = TestBed.createComponent(TooltipsComponent);
        component = fixture.componentInstance;
    });

    describe('init', () => {
        beforeEach(() => {
            component.tooltips = { test: { title: 'test', text: 'text' } };
            component.tooltipItem = 'test';
            tooltipsServiceMock.getTooltip.and.returnValue(<Tooltip>{ text: 'test', name: 'test', isActive: true });
            fixture.detectChanges();
        });

        it('should add tooltip', () => {
            expect(tooltipsServiceMock.addTooltip).toHaveBeenCalledWith('test', component.tooltips);
        });

        it('should scroll to the active tooltip', (done) => {
            spyOn(window, 'scrollTo');
            tooltipsServiceMock.activeTooltip.next(component.tooltips[component.tooltipItem] as any);

            fixture.whenStable().then(() => {
                expect(window.scrollTo).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('next', () => {
        it('should go to next tooltip and emit event', () => {
            fixture.detectChanges();
            spyOn(fixture.componentInstance.onNextClick, 'next');
            fixture.componentInstance.next('itemTest');

            expect(tooltipsServiceMock.nextTooltip).toHaveBeenCalledWith('itemTest');
            expect(fixture.componentInstance.onNextClick.next).toHaveBeenCalled();
        });
    });

    describe('previous', () => {
        it('should go to previous tooltip and emit event', () => {
            fixture.detectChanges();
            spyOn(fixture.componentInstance.onPreviousClick, 'next');
            fixture.componentInstance.previous('itemTest');

            expect(tooltipsServiceMock.previousTooltip).toHaveBeenCalledWith('itemTest');
            expect(fixture.componentInstance.onPreviousClick.next).toHaveBeenCalled();
        });
    });
});
